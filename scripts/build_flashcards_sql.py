"""Build an idempotent Supabase import from the reviewed PDF-based flashcards."""

from __future__ import annotations

import json
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INPUTS = [
    ROOT / "content" / "flashcards_morfo_2026.json",
    ROOT / "content" / "flashcards_oficiales_2026.json",
    ROOT / "content" / "flashcards_salud_investigacion_2026.json",
]
OUTPUT = ROOT / "SQL_FLASHCARDS_OFICIALES_2026.sql"
PAGE_COUNTS = {"morfo": 1251, "biologia": 829, "salud": 232}
MATTERS = {"MORFOFUNCION", "BIOLOGIA CELULAR", "SALUD PUBLICA"}


def key(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    return "".join(c for c in value if not unicodedata.combining(c)).casefold().strip()


def sql(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def main(inputs: list[Path] = INPUTS, output: Path = OUTPUT) -> None:
    groups: list[dict] = []
    for path in inputs:
        payload = json.loads(path.read_text(encoding="utf-8"))
        if payload.get("format") != "pregunta-respuesta":
            raise ValueError(f"Formato inesperado: {path}")
        groups.extend(payload["groups"])

    seen: set[tuple[str, str, str]] = set()
    card_count = 0
    out = [
        "-- Tarjetas originales, redactadas a partir de los tres PDF oficiales del curso.",
        "-- SALUD PUBLICA es la clave histórica de la base de datos; la interfaz muestra Educación para la Salud.",
        "-- Importación aditiva e idempotente: conserva las tarjetas y el progreso ya existentes.",
        "BEGIN;",
        "",
    ]
    for group in groups:
        matter, topic, source = group["materia"], group["tema"], group["source"]
        first, last = group["pages"]
        if matter not in MATTERS or source not in PAGE_COUNTS:
            raise ValueError(f"Materia o fuente inválida: {group}")
        if not (1 <= first <= last <= PAGE_COUNTS[source]):
            raise ValueError(f"Páginas fuera del PDF: {group}")
        if not group["cards"] or len(group["cards"]) < 4:
            raise ValueError(f"Tema incompleto: {matter} / {topic}")
        values = []
        for question, answer in group["cards"]:
            question, answer = question.strip(), answer.strip()
            if not question.endswith("?") or len(question) < 10 or len(answer) < 4:
                raise ValueError(f"Tarjeta poco clara: {question} / {answer}")
            fingerprint = (key(matter), key(topic), key(question))
            if fingerprint in seen:
                raise ValueError(f"Tarjeta repetida: {question}")
            seen.add(fingerprint)
            values.append(f"    ({sql(matter)}, {sql(topic)}, {sql(question)}, {sql(answer)})")
            card_count += 1
        out.extend(
            [
                f"-- {source}: páginas PDF {first}-{last} | {matter} / {topic}",
                "WITH incoming (materia, tema, pregunta, respuesta) AS (",
                "  VALUES",
                ",\n".join(values),
                ")",
                "INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)",
                "SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i",
                "WHERE NOT EXISTS (",
                "  SELECT 1 FROM public.flashcards AS f",
                "  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))",
                "    AND lower(btrim(f.tema)) = lower(btrim(i.tema))",
                "    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))",
                ");",
                "",
            ]
        )
    out.extend(
        [
            "COMMIT;",
            "NOTIFY pgrst, 'reload schema';",
            "",
            f"-- {card_count} tarjetas, {len(groups)} temas, 3 materias.",
        ]
    )
    output.write_text("\n".join(out), encoding="utf-8")
    print(f"{output.name}: {card_count} tarjetas / {len(groups)} temas / {output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
