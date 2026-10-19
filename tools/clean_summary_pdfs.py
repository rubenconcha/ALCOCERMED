"""Remove only the center watermark and editorial footer notes from summary PDFs."""
import re
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, TextStringObject


def clean_string(value, font_size):
    text = str(value)
    if text.strip() == 'BEN CARSON' and font_size >= 30:
        return '', 'watermark'
    cleaned = re.sub(r'\s+[\x00-\x1f\u00b7]\s+revisi.n docente pendiente', '', text, flags=re.I)
    cleaned = re.sub(r'\s*Precisi.n experimental renal:\s*PMID\s*8857934\.?', '', cleaned, flags=re.I)
    return cleaned, 'footer' if cleaned != text else None


def clean_pdf(source):
    reader = PdfReader(source)
    writer = PdfWriter(clone_from=reader)
    counts = {'watermark': 0, 'footer': 0}
    for page in writer.pages:
        stream = ContentStream(page.get_contents(), writer)
        size = 0
        for args, operator in stream.operations:
            if operator == b'Tf':
                size = float(args[1])
            elif operator in (b'Tj', b"'", b'"'):
                index = -1 if operator == b'"' else 0
                if isinstance(args[index], TextStringObject):
                    text, kind = clean_string(args[index], size)
                    if kind:
                        args[index] = TextStringObject(text)
                        counts[kind] += 1
            elif operator == b'TJ':
                for i, value in enumerate(args[0]):
                    if isinstance(value, TextStringObject):
                        text, kind = clean_string(value, size)
                        if kind:
                            args[0][i] = TextStringObject(text)
                            counts[kind] += 1
        page.replace_contents(stream)
    if any(counts.values()):
        target = source.with_suffix('.clean.pdf')
        writer.write(target)
        target.replace(source)
    return counts


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    for source in sorted([*(root / 'resumenes').glob('*.pdf'), *(root / 'api/_pdf').glob('*.pdf')]):
        counts = clean_pdf(source)
        print(source.relative_to(root), counts)
