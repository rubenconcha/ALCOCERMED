"""Build the difficult Medicine bank from editorial checks against the three originals."""

import argparse
import hashlib
import json
from pathlib import Path
import re

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "api" / "_mindmaps"
SUBJECTS = {
    "morfo": ("MORFOFUNCION", "morfofuncion", "Saladin"),
    "biologia": ("BIOLOGIA CELULAR", "biologia-celular", "Calvo"),
    "salud": ("SALUD PUBLICA", "educacion-salud", "Educación en Salud"),
}
# In the methodology section the folios are scanned into the running header.
HEALTH_METHODOLOGY_FOLIOS = {34: 27, 41: 34, 51: 44, 52: 45, 61: 54, 62: 55, 72: 65}


def load_topics():
    script = (ROOT / "script.js").read_text(encoding="utf-8")
    block = script.split("const BANCO_TOPIC_ORDER = ", 1)[1].split(";\n", 1)[0]
    return json.loads(block)


def reading_definitions():
    source = (BANK / "banco-verificado-fuentes.txt").read_text(encoding="utf-8")
    current = None
    for line in source.splitlines():
        if not line:
            continue
        if line.startswith("@"):
            topic, identity, section = line[1:].split("|")
            current = {"topic": topic, "identity": identity, "section": section, "claims": []}
            yield current
        else:
            number, anchor, truth, claim, reason = line.split("|")
            if truth not in ("+", "−"):
                raise ValueError(f"Invalid truth marker on {line}")
            current["claims"].append((int(number), anchor, truth == "+", claim, reason))


def printed_page(area, number, page):
    if area == "morfo":
        return number - 28
    if area == "biologia":
        return number
    if number <= 31:
        return number - 1
    if number >= 76:
        folio = str(number - 75)
        if any(w[4] == folio and w[1] > page.rect.height * .85 for w in page.get_text("words")):
            return int(folio)
    return HEALTH_METHODOLOGY_FOLIOS.get(number)


def positions(page, anchor):
    # The anchor is also the editorial lookup term. Layout coordinates always
    # come from the same, checksum-verified PDF the student will open.
    hits = page.search_for(anchor)
    width, height = page.rect.width, page.rect.height
    return [
        [round(n, 4) for n in (r.x0 / width, r.y0 / height, r.width / width, r.height / height)]
        for r in hits[:2]
        if 0 <= r.x0 < r.x1 <= width and 0 <= r.y0 < r.y1 <= height
    ]


def item(entry, topics, pdfs):
    topic, section = entry["topic"], entry["section"]
    area, chapter = topic.split("-")
    chapter = int(chapter)
    if area != "salud" and not section.startswith("Atlas"):
        section = f"Capítulo {chapter} · {section}"
    subject, slug, label = SUBJECTS[area]
    questions, readings, missing = [], {}, []
    for number, anchor, correct, text, reason in entry["claims"]:
        page = pdfs[area][number - 1]
        marks = positions(page, anchor)
        if not marks:
            missing.append((topic, entry["identity"], number, anchor))
        reading = readings.setdefault(number, {
            "slug": slug, "label": label, "section": section,
            "page": number, "printed": printed_page(area, number, page), "marks": [],
        })
        reading["marks"].extend(mark for mark in marks if mark not in reading["marks"])
        questions.append({"text": text, "correct": correct, "reason": reason})
    return {
        "id": f"banco-verificado:{topic}:{entry['identity']}",
        "materia": subject, "tema": topics[subject][chapter - 1], "claims": questions,
        "references": list(readings.values()),
    }, missing


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", type=Path)
    args = parser.parse_args()
    manifest = json.loads((args.sources / "manifest.json").read_text(encoding="utf-8"))["archivos"]
    books = {}
    for area, entry in zip(("biologia", "salud", "morfo"), manifest, strict=True):
        path = args.sources / entry["archivo"]
        if hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Wrong official source for {area}")
        books[area] = pymupdf.open(path)
    topics = load_topics()
    definitions = list(reading_definitions())
    rows, problems = [], []
    for definition in definitions:
        row, missing = item(definition, topics, books)
        rows.append(row)
        problems.extend(missing)
    if problems:
        for problem in problems:
            print(*problem, sep=" | ")
        raise SystemExit(f"{len(problems)} anchors missing from the official PDF")
    expected = {
        f"{area}-{index:02d}" for area, (subject, _, _) in SUBJECTS.items()
        for index in range(1, len(topics[subject]) + 1)
    }
    if {definition["topic"] for definition in definitions} != expected:
        raise ValueError("The audited questions must cover every course topic")
    (BANK / "banco-verificado.json").write_text(
        "[\n" + ",\n".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) for row in rows) + "\n]\n",
        encoding="utf-8",
    )
    print(f"{len(rows)} questions across {len(expected)} topics")


if __name__ == "__main__":
    main()
