"""Pack verified copies of official PDF pages for the private campus reader."""

import argparse
import hashlib
import io
import json
from pathlib import Path

import pikepdf
import pymupdf


BOOKS = (
    ("biologia-celular", 9),
    ("educacion-salud", 1),
    ("morfofuncion", 1),
)
PAGES_PER_SEGMENT = 8
SEGMENT_TARGET_BYTES = 768 * 1024


def spans(page_count, cover):
    for first, stop in ((1, cover), (cover, cover + 1), (cover + 1, page_count + 1)):
        for start in range(first, stop, PAGES_PER_SEGMENT):
            yield start, min(start + PAGES_PER_SEGMENT, stop)


def page_signature(page):
    image = page.get_pixmap(matrix=pymupdf.Matrix(0.28, 0.28))
    return page.get_text(), page.rect, hashlib.sha256(image.samples).digest()


def segment(source, start, stop, trim):
    with pikepdf.Pdf.new() as pdf:
        pdf.pages.extend(source.pages[start - 1 : stop - 1])
        if trim:
            pdf.remove_unreferenced_resources()
        output = io.BytesIO()
        pdf.save(output, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    return output.getvalue()


def verify_segment(data, expected):
    with pymupdf.open(stream=data, filetype="pdf") as pdf:
        return [page_signature(page) for page in pdf] == expected


def verified_segments(source, original, start, stop):
    data = segment(source, start, stop, trim=True)
    if len(data) > SEGMENT_TARGET_BYTES and stop - start > 1:
        middle = (start + stop) // 2
        yield from verified_segments(source, original, start, middle)
        yield from verified_segments(source, original, middle, stop)
        return
    expected = [page_signature(original[n - 1]) for n in range(start, stop)]
    if not verify_segment(data, expected):
        data = segment(source, start, stop, trim=False)
        if not verify_segment(data, expected):
            raise ValueError(f"Page rendering changed on page {start}")
    yield start, data


def pack(source_path, destination, cover, page_count):
    index = {}
    with pikepdf.Pdf.open(source_path) as source, pymupdf.open(source_path) as original:
        if len(source.pages) != page_count:
            raise ValueError("Unexpected official page count")
        with destination.open("wb") as packed:
            for start, stop in spans(page_count, cover):
                for page, data in verified_segments(source, original, start, stop):
                    index[str(page)] = [packed.tell(), len(data)]
                    packed.write(data)
    return {"bytes": destination.stat().st_size, "segments": index}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sources", type=Path, help="Private referencias-oficiales directory")
    parser.add_argument("output", type=Path, help="Private location for the generated packs")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    entries = json.loads((args.sources / "manifest.json").read_text(encoding="utf-8"))["archivos"]
    result = {}
    for (slug, cover), entry in zip(BOOKS, entries, strict=True):
        original = args.sources / entry["archivo"]
        if hashlib.sha256(original.read_bytes()).hexdigest() != entry["sha256"]:
            raise ValueError(f"Wrong original for {slug}")
        data = pack(original, args.output / f"{slug}.bin", cover, entry["paginas_pdf"])
        result[slug] = data
        print(slug, len(data["segments"]), data["bytes"], flush=True)
    (args.output / "segments.json").write_text(
        json.dumps(result, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
