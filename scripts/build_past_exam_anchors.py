"""Find cited terms in the exact official PDF editions for the past exam reader."""

import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import unicodedata

import pymupdf

EXAMS = Path(__file__).resolve().parents[1] / "api" / "_past_exams"
IGNORE = set("""
    afirmacion afirmaciones ambas ambos caso casos clave comentario como concepto
    conceptos correcto correcta correctas ciertos cuadro debe deben dicho dicha
    donde ejemplo elementos entre examen explica falso falsa figura forma indica
    indicado incluye misma mismo muestran ninguna ninguno otros otras pagina
    parte partes permite pueden puede permite permiten pregunta preguntas
    presenta presentan primer primera principio principal principalmente
    principales proceso procesos prueba pueden relacion respecto revisa
    revisar segunda segundo seccion siguiente siguientes sobre segun solo
    tabla tambien tanto tema temas texto todas todos utiliza utilizan
    verdadero verdadera diferencia diferentes conserva conjunto conjuntos
    cuanto cuales cual cuando constituye corresponden corresponde durante
    encuentra encuentran mediante nivel numero participa posterior porque
    produce producen realiza realizan requiere resultado sentido tienen
    tener tipo tipos total frente trata presenta razon medida define
    solamente asi esta estas este estos eso esas esos siendo suele suelen
    importante importancia traves sufre permite interviene participa
""".split())

# The labels of Calvo's Fig. 1-4 are part of the figure image on page 42.
FIGURE_TERMS = {
    ("B", 42): {"capsula": [(14, 184, 40, 193), (18, 265, 45, 274), (18, 391, 45, 399)]}
}
FOCUS_TERMS = {
    "2025-2026-1-29": {"capsula", "glucocaliz"},
    "2025-2026-1-2": {"hidrogeno", "cloro", "potasio"},
}
# The ODS chart on page 9 is a single, rotated image. These boxes follow its
# visible tiles in reading order, using coordinates on the displayed page.
ODS_TILES = {
    2: (137, 234, 185, 364), 3: (137, 101, 185, 230),
    4: (189, 367, 237, 497), 5: (189, 234, 237, 364),
    6: (189, 101, 237, 230), 7: (241, 367, 289, 497),
    8: (241, 234, 289, 364), 9: (241, 101, 289, 230),
    10: (293, 367, 341, 497), 11: (293, 234, 341, 364),
    12: (293, 101, 341, 230), 17: (396, 234, 444, 364),
}
ODS_QUESTIONS = {
    "2022-2023-1-95": (5, 12, 17),
    "2022-2023-2-94": (3,),
    "2022-2023-3-92": (2, 3, 11),
    "2025-2026-1-45": (4,),
    "2025-2026-1-46": (5, 6, 7),
    "2025-2026-1-47": (10,),
    "2025-2026-1-48": (8,),
    "2025-2026-1-50": (9,),
}


def normalize(word):
    word = "".join(
        char for char in unicodedata.normalize("NFKD", word.lower())
        if not unicodedata.combining(char)
    )
    word = re.sub(r"[^a-z]", "", word)
    if len(word) < 4 or word in IGNORE:
        return ""
    if len(word) > 5 and word.endswith(("as", "es", "os", "is")):
        return word[:-1]
    return word


def tokens(text):
    return {term for word in re.findall(r"[^\W\d_]+", text) if (term := normalize(word))}


def read_page(page, extra_terms):
    words = {}
    for x0, y0, x1, y1, word, *_ in page.get_text("words"):
        term = normalize(word)
        if term and 0 <= x0 < x1 <= page.rect.width and 0 <= y0 < y1 <= page.rect.height:
            words.setdefault(term, []).append((x0, y0, x1, y1))
    words.update(extra_terms)
    return words, page.rect.width, page.rect.height


def cited_boxes(terms, question_terms, focus, frequency, page_count, words):
    matches = (terms | question_terms | focus) & words.keys()
    if not matches:
        return []

    def score(term):
        return (math.log1p(page_count / frequency[term])
                + 2 * (term in terms and term in question_terms)
                + 1.5 * (term in terms)
                + 30 * (term in focus))

    ordered = sorted(matches, key=lambda term: (-score(term), term))
    if focus & words.keys():
        ordered = [term for term in ordered if term in focus]
    ranked = ordered[:3]
    # Pick the occurrence nearest the other concepts so marks point to one passage.
    def distance(first, second):
        return abs(first[1] - second[1]) + .25 * abs(first[0] - second[0])

    def proximity(rect):
        return sum(min(distance(rect, other) for other in words[term]) for term in ranked[1:])

    primary = min(words[ranked[0]], key=proximity)
    boxes = [primary]
    for term in ranked[1:]:
        nearest = min(words[term], key=lambda other: distance(primary, other))
        if distance(primary, nearest) < 130 or term in focus:
            boxes.append(nearest)
    if len(ranked) == 1 or ranked[0] in focus:
        boxes.extend(
            rect for rect in words[ranked[0]]
            if rect != primary and distance(primary, rect) < 240
        )
    return boxes[:5]


def relative_boxes(boxes, width, height):
    return [
        [round(value, 4) for value in (x0 / width, y0 / height, (x1 - x0) / width, (y1 - y0) / height)]
        for x0, y0, x1, y1 in boxes
    ]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", type=Path, help="Private referencias-oficiales directory")
    args = parser.parse_args()
    entries = json.loads((args.sources / "manifest.json").read_text(encoding="utf-8"))["archivos"]
    comments = json.loads((EXAMS / "commentaries.json").read_text(encoding="utf-8"))
    questions = {
        q["id"]: q
        for file in EXAMS.glob("20*.json")
        for q in json.loads(file.read_text(encoding="utf-8"))["questions"]
    }
    cited = {(r["book"], r["pdf"]) for c in comments.values() for r in c["references"]}
    pages = {}
    frequency = Counter()
    for book, entry in zip("BSM", entries, strict=True):
        filename = args.sources / entry["archivo"]
        if hashlib.sha256(filename.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Wrong original for {book}")
        with pymupdf.open(filename) as document:
            for key in sorted(key for key in cited if key[0] == book):
                pages[key] = read_page(document[key[1] - 1], FIGURE_TERMS.get(key, {}))
                frequency.update(pages[key][0].keys())
    results = {}
    for qid, comment in comments.items():
        question = questions[qid]
        terms = tokens(comment["text"])
        question_terms = tokens(" ".join([question["pregunta"]] + [
            question.get("opcion_" + letter) or "" for letter in "abcde"
        ]))
        focus = FOCUS_TERMS.get(qid, set())
        anchors = {}
        for ref in comment["references"]:
            key = (ref["book"], ref["pdf"])
            words, width, height = pages[key]
            if key == ("S", 9) and qid in ODS_QUESTIONS:
                boxes = [ODS_TILES[goal] for goal in ODS_QUESTIONS[qid]]
            else:
                boxes = cited_boxes(terms, question_terms, focus, frequency, len(pages), words)
            if boxes:
                anchors[f"{key[0]}{key[1]}"] = relative_boxes(boxes, width, height)
        if anchors:
            results[qid] = anchors
    (EXAMS / "reading-anchors.json").write_text(
        "{\n" + ",\n".join(json.dumps(key) + ":" + json.dumps(value, separators=(",", ":"))
                          for key, value in results.items()) + "\n}\n",
        encoding="utf-8",
    )
    print(f"{len(results)} questions with marks; {sum(map(len, results.values()))} cited pages with marks")
    missing = [qid for qid, c in comments.items() if c["references"] and qid not in results]
    print(f"{len(missing)} cited questions without text matches: " + ", ".join(missing))


if __name__ == "__main__":
    main()
