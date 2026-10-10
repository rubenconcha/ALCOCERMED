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
                # Binary flashcards do not become sound four-choice questions
                # without inventing several near-identical "No" alternatives.
                if norm(answer).startswith(("no ", "si ")):
                    continue
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
    target_prefix = norm(target["respuesta"]).split()[:2]
    candidate_prefix = norm(candidate["respuesta"]).split()[:2]
    return (
        (4.0 if target["tema"] == candidate["tema"] else 0.0)
        +
        (0.45 if target["_kind"] == candidate["_kind"] else 0.0)
        + (2.6 if target["_shape"] == candidate["_shape"] else -1.2)
        + (2.0 if target["_shape"] == "number" and candidate["_shape"] == "number" else 0.0)
        + (0.8 if target_prefix == candidate_prefix else 0.0)
        + 1.2 * qj + 0.6 * length_fit
    )


def too_similar(first: str, second: str) -> bool:
    a, b = norm(first), norm(second)
    if a == b or a in b or b in a:
        return True
    wa, wb = words(first), words(second)
    return bool(wa and wb) and len(wa & wb) / min(len(wa), len(wb)) >= 0.75


def choose_distractors(target: dict, subject_cards: list[dict]) -> list[str]:
    qn = norm(target["pregunta"])
    an = norm(target["respuesta"])
    prevention_levels = ("primaria", "secundaria", "terciaria", "cuaternaria")
    if ("prevencion" in qn and any(p in qn for p in ("que nivel", "a que nivel", "que prevencion", "que tipo de prevencion"))):
        level = next((level for level in prevention_levels if re.search(r"\bprevencion " + level + r"\b", an)), None)
        if level:
            return ["Prevención " + other + "." for other in prevention_levels if other != level]
    aps_attributes = ("accesibilidad", "coordinacion", "integralidad", "longitudinalidad")
    if "atributo" in qn and ("atencion primaria" in qn or "equipo" in qn or "servicio" in qn):
        attribute = next((item for item in aps_attributes if item in an), None)
        if attribute:
            return [other.capitalize().replace("Coordinacion", "Coordinación") for other in aps_attributes if other != attribute]
    numeric = re.match(r"^(\d+)(?:,([0-9]+))?(\s+.+)$", target["respuesta"])
    if numeric:
        whole, fraction, suffix = numeric.groups()
        # Keep only the unit in wrong numeric choices. Reusing the correct
        # explanation can make a wrong number self-contradictory.
        suffix = re.split(r"[,;:]|\s+porque\b", suffix, maxsplit=1, flags=re.I)[0].rstrip(".")
        number = float(whole + ("." + fraction if fraction else ""))
        step = 1 if number < 20 else 10 if number < 100 else 20
        values = [max(0, number - step), number + step, number + step * 2]
        places = len(fraction or "")
        def render(value: float) -> str:
            amount = f"{value:.{places}f}".replace(".", ",") if places else str(int(value))
            return amount + suffix
        if len(set(values + [number])) == 4:
            return [render(value) for value in values]
    candidates = []
    target_answer = norm(target["respuesta"])
    for candidate in subject_cards:
        if candidate is target:
            continue
        answer = norm(candidate["respuesta"])
        if too_similar(candidate["respuesta"], target["respuesta"]):
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
        if any(too_similar(candidate["respuesta"], item) for item in selected):
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
