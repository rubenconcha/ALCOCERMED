"""Build reproducible MCQ imports from the PDF-grounded editorial flashcards.

The flashcard files contain human-written prompts, answers, source PDF and page
spans. This script turns each distinct prompt into a four-option practice item.
Distractors come from other answers in the same bibliography; the generated
JSON is retained so editors can review and revise individual items.
"""

from __future__ import annotations

import hashlib
import csv
import json
import math
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = CONTENT / "banco_bibliografia_2026.json"
SQL_DIR = ROOT / "sql" / "banco_bibliografia_2026"

SOURCES = {
    "morfo": "Saladin, Anatomía y fisiología: la unidad entre forma y función",
    "biologia": "Biología celular y biomédica, St. Alfonso",
    "salud": "Educación en Salud e Investigación CB24-25",
}
STOPWORDS = set("a al ante bajo con contra de del desde durante el ella en entre es esta este estos haber hacia la las le lo los o para por que se sin sobre su sus un una unas unos y ya como cual cuando donde quien qué cuál cómo dónde porque puede pueden tambien cada parte forma tipo ocurre cuerpo celula celulas".split())


def norm(value: str) -> str:
    value = unicodedata.normalize("NFD", value.casefold())
    value = "".join(c for c in value if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def words(value: str) -> set[str]:
    return {w for w in norm(value).split() if len(w) > 2 and w not in STOPWORDS}


def first_kind(q: str) -> str:
    qn = norm(q)
    for kind in ("que", "cual", "como", "por que", "donde", "cuando", "cuanto", "si", "en", "una", "un"):
        if qn.startswith(kind + " "):
            return kind
    return qn.split(" ", 1)[0]


def answer_shape(answer: str) -> str:
    first = norm(answer).split(" ", 1)[0]
    if first.isdigit() or re.match(r"^\d", answer):
        return "number"
    if first in {"porque", "para", "cuando", "aunque", "si"}:
        return "reason"
    if first in {"el", "la", "los", "las", "un", "una"}:
        return "noun"
    if first in {"en", "dentro", "fuera", "hacia", "desde", "por"}:
        return "place"
    if first in {"que", "se", "al"}:
        return "clause"
    if first in {"no", "si"}:
        return "binary"
    return "term"


def difficulty(q: str) -> str:
    qn = norm(q)
    if any(x in qn for x in ("por que", "que pasaria", "que consecuencia", "como distinguir", "que diferencia", "por que no")):
        return "dificil"
    if any(x in qn for x in ("si ", " una persona ", " un paciente ", " una celula ", " un grupo ", " en un ", " en una ")):
        return "medio"
    return "facil"


def stable_number(value: str) -> int:
    return int(hashlib.sha256(value.encode("utf-8")).hexdigest()[:12], 16)


def load_cards() -> list[dict]:
    files = sorted(CONTENT.glob("flashcards_*.json"))
    rows = []
    seen = set()
    for path in files:
        payload = json.loads(path.read_text(encoding="utf-8"))
        for group in payload["groups"]:
            source = group["source"]
            assert source in SOURCES, (path.name, source)
            pages = group.get("pages") or []
            for question, answer in group["cards"]:
                question, answer = question.strip(), answer.strip()
                key = (group["materia"], norm(question))
                if key in seen:
                    continue
                seen.add(key)
                rows.append({
                    "materia": group["materia"],
                    "tema": group["tema"],
                    "pregunta": question,
                    "respuesta": answer,
                    "dificultad": difficulty(question),
                    "fuente": SOURCES[source],
                    "paginas_pdf": "–".join(map(str, pages)) if pages else "",
                    "_qwords": words(question),
                    "_awords": words(answer),
                    "_kind": first_kind(question),
                    "_shape": answer_shape(answer),
                })
    return rows


def distractor_score(target: dict, candidate: dict) -> float:
    qj = len(target["_qwords"] & candidate["_qwords"]) / max(1, len(target["_qwords"] | candidate["_qwords"]))
    length_fit = 1 - abs(math.log((len(candidate["respuesta"]) + 12) / (len(target["respuesta"]) + 12)))
    same_topic = target["tema"] == candidate["tema"]
    # Explanatory questions often have several simultaneously true causes in a
    # chapter. Use other chapters for their distractors to keep one clear key.
    explanatory = target["_kind"] in {"por que", "como"} or target["_shape"] == "reason"
    return (
        ((-1.0 if explanatory else 1.5) if same_topic else 0.0)
        + (0.45 if target["_kind"] == candidate["_kind"] else 0.0)
        + (2.6 if target["_shape"] == candidate["_shape"] else -1.2)
        + 1.2 * qj + 0.6 * length_fit
    )


def choose_distractors(target: dict, subject_cards: list[dict]) -> list[str]:
    candidates = []
    target_answer = norm(target["respuesta"])
    for candidate in subject_cards:
        if candidate is target:
            continue
        answer = norm(candidate["respuesta"])
        if answer == target_answer or answer in target_answer or target_answer in answer:
            continue
        target_stems = {w[:6] for w in target["_awords"]}
        candidate_stems = {w[:6] for w in candidate["_awords"]}
        # A different true statement about the same concept is a particularly
        # dangerous distractor (it can yield two correct answers).
        if target_stems & candidate_stems:
            continue
        score = distractor_score(target, candidate)
        # Stable tie break prevents unrelated source-file order from changing options.
        tie = stable_number(target["pregunta"] + "|" + candidate["respuesta"]) / 2**48
        candidates.append((score + tie * 0.0001, candidate))
    candidates.sort(key=lambda x: x[0], reverse=True)
    selected = []
    seen = {target_answer}
    for _, candidate in candidates:
        answer = norm(candidate["respuesta"])
        if answer in seen:
            continue
        selected.append(candidate["respuesta"])
        seen.add(answer)
        if len(selected) == 3:
            return selected
    raise ValueError("Not enough distinct distractors for " + target["pregunta"])


def build() -> list[dict]:
    cards = load_cards()
    by_subject = defaultdict(list)
    for card in cards:
        by_subject[card["materia"]].append(card)
    result = []
    for card in cards:
        distractors = choose_distractors(card, by_subject[card["materia"]])
        correct_index = stable_number(card["pregunta"] + card["respuesta"]) % 4
        options = distractors.copy()
        options.insert(correct_index, card["respuesta"])
        result.append({
            "MATERIA": card["materia"],
            "TEMA": card["tema"],
            "DIFICULTAD": card["dificultad"],
            "PREGUNTA": card["pregunta"],
            "OPCION_A": options[0], "OPCION_B": options[1],
            "OPCION_C": options[2], "OPCION_D": options[3],
            "RESPUESTA_CORRECTA": "ABCD"[correct_index],
            "EXPLICACION": card["respuesta"],
            "FUENTE": card["fuente"],
            "PAGINAS_PDF": card["paginas_pdf"],
        })
    validate(result)
    return result


def validate(rows: list[dict]) -> None:
    seen = set()
    for row in rows:
        key = row["MATERIA"], norm(row["PREGUNTA"])
        assert key not in seen, key
        seen.add(key)
        assert row["RESPUESTA_CORRECTA"] in "ABCD"
        options = [row[f"OPCION_{x}"] for x in "ABCD"]
        assert len(set(map(norm, options))) == 4, row["PREGUNTA"]
        assert all(len(x) < 300 for x in options)
        assert all(row[k] for k in ("MATERIA", "TEMA", "PREGUNTA", "FUENTE"))
    expected = {"MORFOFUNCION": 29, "BIOLOGIA CELULAR": 18, "SALUD PUBLICA": 21}
    topics = defaultdict(set)
    for row in rows:
        topics[row["MATERIA"]].add(row["TEMA"])
    assert {subject: len(items) for subject, items in topics.items()} == expected


def make_sql(rows: list[dict], batch_size: int = 80) -> None:
    SQL_DIR.mkdir(parents=True, exist_ok=True)
    for old in SQL_DIR.glob("lote_*.sql"):
        old.unlink()
    fields = ["MATERIA", "TEMA", "DIFICULTAD", "PREGUNTA", "OPCION_A", "OPCION_B", "OPCION_C", "OPCION_D", "RESPUESTA_CORRECTA", "EXPLICACION", "FUENTE", "PAGINAS_PDF"]
    all_sql = []
    for number, start in enumerate(range(0, len(rows), batch_size), 1):
        chunk = rows[start:start + batch_size]
        payload = json.dumps([{key: row[key] for key in fields} for row in chunk], ensure_ascii=False, separators=(",", ":"))
        payload = payload.replace("'", "''")
        columns = ", ".join('"' + key + '"' for key in fields)
        record_type = ", ".join('"' + key + '" text' for key in fields)
        select_fields = ", ".join('p."' + key + '"' for key in fields)
        select_n = ", ".join('n."' + key + '"' for key in fields)
        sql = f"""-- Banco de preguntas oficial, lote {number:02d}. Reejecutable sin duplicados.
BEGIN;
ALTER TABLE public.banco_preguntas ADD COLUMN IF NOT EXISTS "FUENTE" text;
ALTER TABLE public.banco_preguntas ADD COLUMN IF NOT EXISTS "PAGINAS_PDF" text;
WITH payload AS (
  SELECT * FROM jsonb_to_recordset('{payload}'::jsonb) AS p({record_type})
), missing AS (
  SELECT p.* FROM payload p
  WHERE NOT EXISTS (
    SELECT 1 FROM public.banco_preguntas b
    WHERE b."MATERIA" = p."MATERIA" AND lower(b."PREGUNTA") = lower(p."PREGUNTA")
  )
), numbered AS (
  SELECT (SELECT coalesce(max(id), 0) FROM public.banco_preguntas) + row_number() OVER (ORDER BY "MATERIA", "TEMA", "PREGUNTA") AS id, m.*
  FROM missing m
)
INSERT INTO public.banco_preguntas (id, {columns})
SELECT n.id, {select_n} FROM numbered n;
COMMIT;
"""
        (SQL_DIR / f"lote_{number:02d}.sql").write_text(sql, encoding="utf-8")
        all_sql.append(sql)
    (ROOT / "SQL_BANCO_BIBLIOGRAFIA_2026.sql").write_text("\n".join(all_sql), encoding="utf-8")


def make_csv(rows: list[dict]) -> None:
    """Dashboard import copies for the existing table (last preimport ID: 100)."""
    by_subject = defaultdict(list)
    for offset, row in enumerate(rows, 101):
        by_subject[row["MATERIA"]].append({"id": offset, **row})
    for subject, items in by_subject.items():
        filename = {"MORFOFUNCION": "morfofuncion", "BIOLOGIA CELULAR": "biologia_celular", "SALUD PUBLICA": "educacion_salud"}[subject]
        with (SQL_DIR / f"importar_{filename}.csv").open("w", encoding="utf-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=["id", *rows[0].keys()])
            writer.writeheader()
            writer.writerows(items)


if __name__ == "__main__":
    rows = build()
    OUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    make_sql(rows)
    make_csv(rows)
    print("questions", len(rows), "topics", len({(r["MATERIA"], r["TEMA"]) for r in rows}))
    print("by subject", dict(Counter(r["MATERIA"] for r in rows)))
    print("sql batches", len(list(SQL_DIR.glob("lote_*.sql"))))
