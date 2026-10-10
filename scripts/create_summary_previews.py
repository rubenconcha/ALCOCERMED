"""Create review images for the Ben Carson summary template (no PDFs yet)."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "resumenes-muestras"
LOGO = ROOT / "promo-ben-carson-tiktok" / "public" / "authentic" / "logo.png"
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#18263f"
BLUE = "#218bc0"
GOLD = "#f7ad24"
TEXT = "#27354b"
MUTED = "#60718a"
LINE = "#dbe6ee"
PAPER = "#fbfdff"
FONT = Path("C:/Windows/Fonts/arial.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/arialbd.ttf")


def font(size, bold=False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)


def wrap(draw, text, f, width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=f)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(draw, xy, text, f, fill, max_width, spacing=10):
    x, y = xy
    line_height = f.size + spacing
    for line in wrap(draw, text, f, max_width):
        draw.text((x, y), line, font=f, fill=fill)
        y += line_height
    return y


SAMPLES = [
    {
        "slug": "morfo-introduccion",
        "subject": "MORFOFUNCIÓN",
        "chapter": "01 / FUNDAMENTOS",
        "title": "Anatomía y fisiología:\nforma y función",
        "thesis": "Para entender el cuerpo, estudia qué estructuras tiene y cómo trabajan juntas para mantener la vida.",
        "essentials": [
            ("01", "Dos miradas, un cuerpo", "La anatomía describe la forma y la ubicación de las estructuras. La fisiología explica su funcionamiento. Una ayuda a comprender la otra."),
            ("02", "De lo simple a lo complejo", "Átomos y moléculas forman estructuras celulares; las células se agrupan en tejidos, órganos y sistemas que funcionan como un organismo."),
            ("03", "Equilibrio interno", "La homeostasis mantiene variables corporales dentro de rangos compatibles con la vida. La retroalimentación negativa contrarresta las desviaciones."),
            ("04", "No todos somos idénticos", "La anatomía y la fisiología varían entre personas y a lo largo de la vida. Por eso, un valor se interpreta en su contexto."),
        ],
        "connection": ["ESTRUCTURA", "FUNCIÓN", "EQUILIBRIO"],
        "question": "Si sube la temperatura corporal, ¿qué relación hay entre sudar y la homeostasis?",
        "answer": "La sudoración favorece la pérdida de calor. Es una respuesta que se opone al aumento de temperatura y ayuda a volver al rango habitual.",
        "source": "Saladin, Anatomía y fisiología, cap. 1 (PDF, págs. 29–53).",
        "accent": "#f1a61d",
        "soft": "#fff5df",
    },
    {
        "slug": "bio-la-celula",
        "subject": "BIOLOGÍA CELULAR",
        "chapter": "01 / LA CÉLULA",
        "title": "La célula: unidad\nde los seres vivos",
        "thesis": "La célula reúne organización, información genética y procesos que hacen posible la vida.",
        "essentials": [
            ("01", "Una idea fundamental", "Los seres vivos están formados por células. Cada célula procede de otra célula, y las funciones del organismo dependen de su actividad."),
            ("02", "Dos tipos de organización", "Las procariotas carecen de núcleo delimitado. Las eucariotas tienen núcleo y compartimentos internos especializados."),
            ("03", "La información importa", "El ADN contiene instrucciones necesarias para producir proteínas. En las eucariotas, se organiza en cromosomas dentro del núcleo."),
            ("04", "Forma ligada a tarea", "Aunque comparten rasgos básicos, las células pueden especializar su estructura para cumplir funciones distintas."),
        ],
        "connection": ["CÉLULA", "ADN", "FUNCIÓN"],
        "question": "Si observas una célula con núcleo definido, ¿es procariota o eucariota?",
        "answer": "Es eucariota. El núcleo delimitado es una de las características que la distingue de una procariota.",
        "source": "Calvo, Biología celular biomédica, cap. 1 (PDF, págs. 34–38).",
        "accent": "#208fc5",
        "soft": "#eaf6fc",
    },
    {
        "slug": "salud-concepto",
        "subject": "EDUCACIÓN PARA LA SALUD",
        "chapter": "01 / PUNTO DE PARTIDA",
        "title": "Salud: más que\nno estar enfermo",
        "thesis": "Educar para la salud ayuda a tomar decisiones y a transformar las condiciones que influyen en el bienestar.",
        "essentials": [
            ("01", "Una visión más amplia", "El enfoque biomédico se centraba en la enfermedad. La mirada biopsicosocial integra factores biológicos, psicológicos y sociales."),
            ("02", "Educar es actuar", "La educación en salud busca conocimientos, actitudes y prácticas que permitan a personas y comunidades cuidar su bienestar."),
            ("03", "El entorno también cuenta", "La vivienda, la educación, el empleo, el ambiente y las políticas públicas influyen en las oportunidades de vivir con salud."),
            ("04", "Prevenir en distintos momentos", "La prevención primaria evita que aparezca una enfermedad; la secundaria procura detectarla temprano; la terciaria reduce secuelas."),
        ],
        "connection": ["PERSONA", "ENTORNO", "ACCIÓN"],
        "question": "¿Por qué una campaña de salud no debería limitarse a decirle a la gente qué hacer?",
        "answer": "Porque conocer una recomendación no elimina barreras como la falta de agua, recursos o servicios. También hacen falta participación y condiciones que permitan actuar.",
        "source": "Educación en Salud e Investigación, Curso Básico 2025–2026 (PDF, págs. 2–5).",
        "accent": "#78a841",
        "soft": "#f0f7e9",
    },
]


def draw_sample(data):
    im = Image.new("RGB", (1400, 1980), PAPER)
    d = ImageDraw.Draw(im)
    accent = data["accent"]
    soft = data["soft"]

    d.rectangle((0, 0, 1400, 18), fill=accent)
    d.rounded_rectangle((65, 66, 1335, 1905), radius=34, fill="white", outline=LINE, width=2)

    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((100, 100), Image.Resampling.LANCZOS)
    im.paste(logo, (100, 92), logo)
    d.text((218, 100), "PREPARATORIA BEN CARSON", font=font(27, True), fill=NAVY)
    d.text((218, 139), "ALCOCERMED  ·  MATERIAL DE ESTUDIO", font=font(17, True), fill=BLUE)
    d.rounded_rectangle((1042, 108, 1295, 149), radius=20, fill="#fff1d4")
    d.text((1075, 118), "MUESTRA PARA REVISIÓN", font=font(15, True), fill="#915a08")
    d.line((101, 219, 1299, 219), fill=LINE, width=2)

    d.rounded_rectangle((101, 263, 1299, 575), radius=28, fill=soft)
    hero_mark = Image.open(LOGO).convert("RGBA")
    hero_mark.thumbnail((208, 208), Image.Resampling.LANCZOS)
    hero_mark.putalpha(hero_mark.getchannel("A").point(lambda a: int(a * 0.13)))
    im.paste(hero_mark, (1040, 347), hero_mark)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((137, 301, 137 + 305, 342), radius=18, fill=accent)
    d.text((155, 309), data["subject"], font=font(18, True), fill="white")
    d.text((1005, 308), data["chapter"], font=font(18, True), fill=NAVY)
    title_y = 371
    for line in data["title"].split("\n"):
        d.text((137, title_y), line, font=font(48, True), fill=NAVY)
        title_y += 59
    paragraph(d, (138, 498), data["thesis"], font(22), TEXT, 1080, 8)

    d.text((104, 630), "LO QUE DEBES ENTENDER", font=font(21, True), fill=accent)
    d.text((104, 671), "Cuatro ideas para ordenar el tema", font=font(32, True), fill=NAVY)

    positions = [(102, 738), (712, 738), (102, 1002), (712, 1002)]
    for (num, heading, body), (x, y) in zip(data["essentials"], positions):
        d.rounded_rectangle((x, y, x + 586, y + 236), radius=23, fill="white", outline=LINE, width=2)
        d.rounded_rectangle((x + 24, y + 24, x + 75, y + 75), radius=14, fill=soft)
        d.text((x + 36, y + 36), num, font=font(19, True), fill=accent)
        d.text((x + 91, y + 33), heading, font=font(23, True), fill=NAVY)
        paragraph(d, (x + 28, y + 99), body, font(20), TEXT, 522, 8)

    d.rounded_rectangle((102, 1291, 1298, 1454), radius=22, fill=soft)
    d.text((130, 1317), "ASÍ SE CONECTA", font=font(17, True), fill=accent)
    x_positions = [137, 522, 907]
    for i, label in enumerate(data["connection"]):
        x = x_positions[i]
        d.rounded_rectangle((x, 1363, x + 300, 1418), radius=18, fill="white", outline=accent, width=2)
        text_width = d.textbbox((0, 0), label, font=font(22, True))[2]
        d.text((x + (300 - text_width) / 2, 1378), label, font=font(22, True), fill=NAVY)
        if i < 2:
            d.text((x + 331, 1371), "→", font=font(33, True), fill=accent)

    d.rounded_rectangle((102, 1490, 1298, 1762), radius=22, fill="#f8fbfd", outline=LINE, width=2)
    d.text((130, 1519), "PONLO A PRUEBA", font=font(19, True), fill=BLUE)
    question_end = paragraph(d, (130, 1560), data["question"], font(25, True), NAVY, 1120, 10)
    d.line((130, question_end + 16, 1265, question_end + 16), fill=LINE, width=2)
    d.text((130, question_end + 38), "RESPUESTA RAZONADA", font=font(17, True), fill=accent)
    paragraph(d, (130, question_end + 72), data["answer"], font(21), TEXT, 1090, 8)

    d.line((103, 1804, 1297, 1804), fill=LINE, width=2)
    d.text((105, 1823), "Fuente para esta muestra:", font=font(17, True), fill=NAVY)
    paragraph(d, (105, 1851), data["source"], font(16), MUTED, 980, 5)
    d.text((1130, 1847), "01 / 01", font=font(18, True), fill=MUTED)
    path = OUT / f"{data['slug']}.png"
    im.save(path, optimize=True)
    print(path)


if __name__ == "__main__":
    for sample in SAMPLES:
        draw_sample(sample)
