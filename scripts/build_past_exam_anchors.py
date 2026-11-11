"""Find cited terms in the exact official PDF editions for the past exam reader."""

import argparse
from collections import Counter, defaultdict
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
    libro textos consultados bibliografia oficial historial historica menciona
    hallado dato datos especifico especifica concreta contexto presentada
""".split())
SHORT_TERMS = {"adn", "rna", "arn", "atp", "adp", "adh", "eca", "ods", "lcr", "bhe", "igg", "igm", "iga"}

# Calvo's figures have labels embedded in images with no PDF text layer.
FIGURE_TERMS = {
    ("B", 42): {"capsula": [(14, 184, 40, 193), (18, 265, 45, 274), (18, 391, 45, 399)]},
    ("B", 387): {
        "alanina": [(56, 375, 85, 383)],
        "leucina": [(141, 375, 171, 383)],
        "isoleucina": [(185, 375, 216, 383)],
        "metionina": [(97, 436, 134, 443)],
        "fenilalanina": [(142, 436, 182, 443)],
        "serina": [(14, 499, 42, 507)],
        "treonina": [(55, 499, 86, 507)],
        "tirosina": [(97, 499, 129, 507)],
    },
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
    if (len(word) < 4 and word not in SHORT_TERMS) or word in IGNORE:
        return ""
    if len(word) > 5 and word.endswith(("as", "es", "os", "is")):
        return word[:-1]
    return word


def words_in(text):
    joined = re.sub(r"(?<=\w)-\s*\n\s*(?=\w)", "", text)
    return [term for word in re.findall(r"[^\W\d_]+(?:[-‐‑–][^\W\d_]+)*", joined) if (term := normalize(word))]


def read_page(page, extra_terms):
    words = defaultdict(list)
    blocks = defaultdict(lambda: defaultdict(list))
    for x0, y0, x1, y1, word, block, line, _ in page.get_text("words"):
        term = normalize(word)
        if term and 0 <= x0 < x1 <= page.rect.width and 0 <= y0 < y1 <= page.rect.height:
            rect = (x0, y0, x1, y1)
            words[term].append(rect)
            if .038 * page.rect.height < y0 and y1 < .98 * page.rect.height:
                blocks[block][line].append((term, rect))
    words.update(extra_terms)
    windows = []
    for block in blocks.values():
        lines = list(block.values())
        for first in range(len(lines)):
            window = [entry for line in lines[first:first + 3] for entry in line]
            if len(window) < 2:
                continue
            terms = [term for term, _ in window]
            windows.append((set(terms), set(zip(terms, terms[1:])), window))
    return words, windows, page.rect.width, page.rect.height


def targets(question, comment):
    stem = question["pregunta"]
    # A sequence starting at 1 distinguishes assertions from a decimal or
    # an incidental number within a question.
    pieces = re.split(r"(?<![\w.])([1-5])(?:\.\s*[-–]?\s*|[)-]\s*)(?=\D)", stem)
    split = len(pieces) >= 5 and pieces[1::2] == [str(i) for i in range(1, len(pieces) // 2 + 1)]
    title = set(words_in(pieces[0])) if split else set()
    if split:
        statements = pieces[2::2]
    else:
        accepted = question.get("respuestas_aceptadas", [])
        options = " ".join(question.get("opcion_" + key.lower()) or "" for key in accepted if key)
        statements = [stem + " " + options]
    explanation = [
        words_in(part) for part in re.split(r"(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ0-9])|\n", comment)
        if not re.search(r"(?:los textos|el compendio|los pasajes|las páginas|la bibliograf[ií]a)\b.{0,85}"
                         r"\bno (?:detalla|incluye|contiene|permite|desarrolla|presenta|proporciona|establece|reproduce|dan?|expone)",
                         part, flags=re.I)
    ]
    all_explanation = {term for part in explanation for term in part}
    for statement in statements:
        words = words_in(statement)
        key = set(words)
        pairs = set(zip(words, words[1:]))
        if not key:
            continue
        # The explanation often supplies the corrected term for a false assertion.
        related = max(explanation, key=lambda part: len(key.intersection(part)), default=[])
        if len(key.intersection(related)) < 2 and split:
            related = []
        support = set(related) if split else all_explanation
        pairs.update(zip(related, related[1:]))
        yield key, support, title, all_explanation, pairs


def passage(target, windows, importance):
    statement, supporting, title, explanation, phrases = target
    best = None
    for terms, pairs, words in windows:
        direct = terms & statement
        corrected = terms & supporting
        shared = direct & corrected
        exact_pairs = phrases & pairs
        subject = terms & title
        if len(direct | corrected) < 2 and not (direct and subject - direct):
            continue
        if not direct and len(corrected) < 3:
            continue
        weight = sum(importance[word] for word in direct | corrected)
        weight += .7 * sum(importance[word] for word in shared)
        weight += .32 * sum(importance[word] for word in subject - direct - corrected)
        weight += .14 * sum(importance[word] for word in (terms & explanation) - direct - corrected)
        weight += 1.35 * sum(min(importance[a], importance[b]) for a, b in exact_pairs)
        if best and weight <= best[0]:
            continue
        phrase_terms = {term for pair in exact_pairs for term in pair}
        ranked = sorted(direct | corrected | subject, key=lambda word: (
            word in phrase_terms, word in shared, word in direct or word in corrected, importance[word], word
        ), reverse=True)
        boxes = [next(rect for term, rect in words if term == word) for word in ranked[:6]]
        if boxes:
            # The reader scrolls to the first rectangle.
            best = weight, boxes
    return best


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


def explicit_boxes(page, reference):
    boxes = []
    image_labels = FIGURE_TERMS.get((reference["book"], reference["pdf"]), {})
    for phrase in reference["focus"]:
        hits = image_labels.get(normalize(phrase)) or page.search_for(phrase)
        if not hits:
            raise ValueError(f"Passage missing from {reference['book']} PDF {reference['pdf']}: {phrase}")
        boxes.extend(tuple(rect) for rect in hits[:3])
    return list(dict.fromkeys(boxes))


def collect_assertion_marks(comment, book, document, assertions):
    references = {f"{ref['book']}{ref['pdf']}": ref for ref in comment["references"]}
    for claim, marks in zip(comment["afirmaciones"], assertions, strict=True):
        for key, focus in claim["pasajes"].items():
            if not key.startswith(book):
                continue
            reference = references[key]
            page = document[reference["pdf"] - 1]
            boxes = explicit_boxes(page, {**reference, "focus": focus})
            marks[key] = relative_boxes(boxes, page.rect.width, page.rect.height)


def combine_assertion_marks(assertions):
    marks_by_page = {}
    for passages in assertions:
        for page, boxes in passages.items():
            marks = marks_by_page.setdefault(page, [])
            marks.extend(box for box in boxes if box not in marks)
    return {**marks_by_page, "incisos": assertions}


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
    pinned = defaultdict(list)
    for qid, comment in comments.items():
        for ref in comment["references"]:
            if ref.get("focus"):
                pinned[ref["book"]].append((qid, ref))
    exact = {}
    verified = {
        qid: [{} for _ in comment["afirmaciones"]]
        for qid, comment in comments.items() if comment.get("afirmaciones")
    }
    frequency = Counter()
    for book, entry in zip("BSM", entries, strict=True):
        filename = args.sources / entry["archivo"]
        if hashlib.sha256(filename.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Wrong original for {book}")
        with pymupdf.open(filename) as document:
            for key in sorted(key for key in cited if key[0] == book):
                pages[key] = read_page(document[key[1] - 1], FIGURE_TERMS.get(key, {}))
                frequency.update(pages[key][0].keys())
            for qid, ref in pinned[book]:
                page = document[ref["pdf"] - 1]
                exact[qid, book, ref["pdf"]] = explicit_boxes(page, ref)
            for qid, marks in verified.items():
                collect_assertion_marks(comments[qid], book, document, marks)
    importance = {term: math.log1p(len(pages) / count) for term, count in frequency.items()}
    results = {}
    for qid, comment in comments.items():
        if qid in verified:
            results[qid] = combine_assertion_marks(verified[qid])
            continue
        question = questions[qid]
        anchors = {}
        candidate_pages = []
        for ref in comment["references"]:
            key = (ref["book"], ref["pdf"])
            words, _, _, _ = pages[key]
            if ref.get("focus"):
                boxes = exact[qid, *key]
            elif key == ("S", 9) and qid in ODS_QUESTIONS:
                boxes = [ODS_TILES[goal] for goal in ODS_QUESTIONS[qid]]
            elif qid in FOCUS_TERMS:
                boxes = cited_boxes(set(), set(), FOCUS_TERMS[qid], frequency, len(pages), words)
            else:
                candidate_pages.append(key)
                continue
            if boxes:
                anchors[key] = boxes
        # Select the best localized source for each assertion independently,
        # then open the strongest passage before any supporting pages.
        matches = []
        for target in targets(question, comment["text"]):
            candidates = [
                (key, result) for key in candidate_pages
                if (result := passage(target, pages[key][1], importance))
            ]
            if candidates:
                matches.append(max(candidates, key=lambda candidate: candidate[1][0]))
        matches.sort(key=lambda match: match[1][0], reverse=True)
        minimum_score = min(12, matches[0][1][0] * .5) if matches else 0
        for key, (score, boxes) in matches:
            if key not in anchors and score < minimum_score:
                continue
            marks = anchors.setdefault(key, [])
            marks.extend(box for box in boxes if box not in marks)
        if not anchors:
            # Tables can have one cell per PDF block. Require terms that occur
            # near one another on a cited page before using a wider search.
            stem = set(words_in(question["pregunta"]))
            explanation = set(words_in(comment["text"]))
            for key in candidate_pages:
                words, _, _, _ = pages[key]
                boxes = cited_boxes(explanation, stem, set(), frequency, len(pages), words)
                if len(boxes) >= 2:
                    anchors[key] = boxes
                    break
        if anchors:
            results[qid] = {
                f"{key[0]}{key[1]}": relative_boxes(boxes, pages[key][2], pages[key][3])
                for key, boxes in anchors.items()
            }
    (EXAMS / "reading-anchors.json").write_text(
        "{\n" + ",\n".join(json.dumps(key) + ":" + json.dumps(value, separators=(",", ":"))
                          for key, value in results.items()) + "\n}\n",
        encoding="utf-8",
    )
    marked_pages = sum(len(row) - ("incisos" in row) for row in results.values())
    print(f"{len(results)} questions with marks; {marked_pages} cited pages with marks")
    missing = [qid for qid, c in comments.items() if c["references"] and qid not in results]
    print(f"{len(missing)} cited questions without text matches: " + ", ".join(missing))


if __name__ == "__main__":
    main()
