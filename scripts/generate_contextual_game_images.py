"""Ilustraciones SVG breves para preguntas concretas de Juegos.

No contienen la respuesta escrita ni reutilizan una lámina de capítulo.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "juegos" / "assets" / "preguntas-contextuales"
DEST.mkdir(parents=True, exist_ok=True)


def frame(body: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="960" height="480" viewBox="0 0 960 480" role="img">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#f5fbff"/><stop offset="1" stop-color="#fff8e9"/></linearGradient>
<linearGradient id="cell" x2="1" y2="1"><stop stop-color="#c8edfa"/><stop offset="1" stop-color="#e5d8fa"/></linearGradient>
<filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1e3a5f" flood-opacity=".14"/></filter></defs>
<rect width="960" height="480" rx="28" fill="url(#bg)"/>
<path d="M0 378C202 301 285 420 478 370S796 334 960 398V480H0Z" fill="#e9f4fb" opacity=".65"/>
{body}</svg>'''


def cell(x: int, y: int, s: float = 1, color: str = "#3b9bc4") -> str:
    return f'''<g transform="translate({x} {y}) scale({s})" filter="url(#shadow)">
<path d="M0-91C55-93 98-47 94 6C89 66 45 94-11 90C-71 87-99 38-92-17C-86-67-51-91 0-91Z" fill="url(#cell)" stroke="{color}" stroke-width="7"/>
<ellipse cx="-8" cy="-4" rx="33" ry="29" fill="#b69bd6" stroke="#6e54a5" stroke-width="5"/>
<circle cx="-6" cy="-6" r="11" fill="#674792"/>
<ellipse cx="46" cy="-42" rx="15" ry="8" transform="rotate(-25 46 -42)" fill="#f3ad6b" stroke="#d5804d" stroke-width="3"/>
<ellipse cx="38" cy="44" rx="15" ry="8" transform="rotate(26 38 44)" fill="#f3ad6b" stroke="#d5804d" stroke-width="3"/>
<path d="M-70 13q15-14 23-2m-23 19q18-7 22 4M15-69q17-2 21 9" fill="none" stroke="#4eb3ab" stroke-width="6" stroke-linecap="round"/></g>'''


def person(x: int, y: int, color: str = "#278dba", scale: float = 1) -> str:
    return f'''<g transform="translate({x} {y}) scale({scale})" fill="{color}" stroke="#173b62" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
<circle cy="-45" r="24"/><path d="M-33-7q33-21 66 0l13 77h-92Z"/><path d="M-36 9-67 62M36 9l31 53"/></g>'''


def helix(x: int, y: int, scale: float = 1) -> str:
    bars = "".join(f'<line x1="{-37 if i % 2 else -23}" y1="{i*22-133}" x2="{37 if i % 2 else 23}" y2="{i*22-133}" stroke="#f5b24d" stroke-width="7" stroke-linecap="round"/>' for i in range(13))
    return f'''<g transform="translate({x} {y}) scale({scale})">{bars}
<path d="M-34-145C56-79-55-18 35 51S-55 118-35 146" fill="none" stroke="#238db7" stroke-width="11" stroke-linecap="round"/>
<path d="M34-145C-56-79 55-18-35 51S55 118 35 146" fill="none" stroke="#714ba4" stroke-width="11" stroke-linecap="round"/></g>'''


SCENES = {
    "teoria-celular": frame('''<path d="M160 242C305 176 435 180 535 225s136 67 235 5" fill="none" stroke="#b8cddb" stroke-width="7" stroke-dasharray="13 15"/>
''' + cell(189, 245, .80) + cell(430, 175, .62, "#56a56d") + cell(471, 311, .58, "#eeaa4c") + cell(727, 238, .90, "#3b9bc4") + '''<circle cx="856" cy="118" r="12" fill="#f5b24d"/><circle cx="96" cy="365" r="11" fill="#58bba3"/>'''),
    "procariota": frame('''<g transform="translate(471 240) rotate(-8)" filter="url(#shadow)">
<ellipse rx="250" ry="133" fill="#b9e6cc" stroke="#2a9b77" stroke-width="12"/><ellipse rx="219" ry="104" fill="none" stroke="#6ab78f" stroke-width="8"/>
<path d="M-62-28c91-112 126 68 34 80-98 12 4-133 90-43" fill="none" stroke="#704ea5" stroke-width="10" stroke-linecap="round"/>
<circle cx="-130" cy="-45" r="7" fill="#206c93"/><circle cx="-126" cy="31" r="7" fill="#206c93"/><circle cx="90" cy="55" r="7" fill="#206c93"/>
<circle cx="140" cy="-30" r="8" fill="#e2a65f"/><circle cx="116" cy="63" r="8" fill="#e2a65f"/>
<path d="M246 20c102-38 109 45 183 21" fill="none" stroke="#2a9b77" stroke-width="11" stroke-linecap="round"/>
<path d="M-192-111l-30-29m87 0-10-34m-76 104-42-5m107 188-13 27m111-20 8 42" stroke="#2a9b77" stroke-width="7" stroke-linecap="round"/></g>'''),
    "eucariota": frame('''<circle cx="482" cy="240" r="192" fill="url(#cell)" stroke="#2c94c2" stroke-width="13" filter="url(#shadow)"/>
<ellipse cx="475" cy="226" rx="77" ry="70" fill="#baa5dc" stroke="#7355a4" stroke-width="9"/><circle cx="466" cy="220" r="25" fill="#7455a6"/>
<path d="M295 206q59-67 108 0M309 230q57-52 94 4M550 285q64-55 111-1M560 309q48-42 88-4" fill="none" stroke="#5bb5a7" stroke-width="12" stroke-linecap="round"/>
<ellipse cx="581" cy="124" rx="36" ry="20" transform="rotate(-24 581 124)" fill="#f4ac73" stroke="#cd7c57" stroke-width="6"/>
<ellipse cx="378" cy="343" rx="37" ry="20" transform="rotate(28 378 343)" fill="#f4ac73" stroke="#cd7c57" stroke-width="6"/>
<circle cx="343" cy="142" r="13" fill="#e7c451"/><circle cx="622" cy="352" r="13" fill="#e7c451"/>'''),
    "adn": frame('''<circle cx="480" cy="239" r="191" fill="#dbedfa" stroke="#3197bf" stroke-width="13" filter="url(#shadow)"/>
<circle cx="480" cy="239" r="153" fill="#eee2f8" stroke="#9274b8" stroke-width="8"/>''' + helix(480, 240, 1.0) + '''<circle cx="738" cy="101" r="11" fill="#f0b14d"/>'''),
    "arn": frame('''<path d="M179 139C278 111 272 260 363 235s139-97 204-37c60 56 114 9 179-3" fill="none" stroke="#208caf" stroke-width="15" stroke-linecap="round"/>
<g stroke="#e69b48" stroke-width="7" stroke-linecap="round"><path d="m229 130 18 32m79 65-10 35m108-77 5 36m101-49 7 38m113 25 1 38"/></g>
<path d="M653 273c47-49 122-19 123 39 1 75-153 82-178 21-13-30 10-53 55-60Z" fill="#bfa8df" stroke="#71549e" stroke-width="9" filter="url(#shadow)"/>
<path d="M630 324c46-19 89-18 130 4" fill="none" stroke="#7654a0" stroke-width="7"/>
<circle cx="751" cy="184" r="11" fill="#f1b14c"/>'''),
    "virus": frame('''<g transform="translate(302 231)" filter="url(#shadow)"><circle r="103" fill="#e8c5e7" stroke="#9550a4" stroke-width="10"/>
<circle r="64" fill="#fff1f0" stroke="#c46cad" stroke-width="6"/><path d="M-38 6c26-45 50 34 76-14" fill="none" stroke="#a154a8" stroke-width="8"/>
''' + "".join(f'<g transform="rotate({i*45})"><path d="M0-105v-29" stroke="#9550a4" stroke-width="9"/><circle cy="-145" r="13" fill="#c46cad"/></g>' for i in range(8)) + '''</g>
<path d="M464 235h92" stroke="#e69e43" stroke-width="10" stroke-linecap="round"/><path d="m536 217 29 18-29 18" fill="none" stroke="#e69e43" stroke-width="10" stroke-linecap="round"/>
''' + cell(736, 239, 1.13)),
    "salud-colectiva": frame('''<path d="M480 252 217 183M480 252l263-69M480 252 297 367M480 252l366 342" stroke="#9ebbc8" stroke-width="9" stroke-linecap="round"/>
<rect x="384" y="161" width="192" height="163" rx="24" fill="#fff" stroke="#208eab" stroke-width="11" filter="url(#shadow)"/>
<rect x="457" y="181" width="46" height="124" rx="7" fill="#ee876c"/><rect x="418" y="220" width="124" height="46" rx="7" fill="#ee876c"/>
''' + person(197, 199, "#4ea2bd", .80) + person(745, 199, "#e4aa4f", .80) + person(275, 372, "#72aa85", .72) + person(690, 371, "#987eb6", .72)),
    "promocion-salud": frame('''<circle cx="480" cy="237" r="118" fill="#fff" stroke="#4aaf9e" stroke-width="13" filter="url(#shadow)"/>
<path d="M480 297c-89-54-91-109-43-130 25-11 42 4 43 16 1-12 23-27 47-16 51 23 41 78-47 130Z" fill="#ef8079"/>
<path d="M202 188c71-93 189-130 282-122m268 126c-33-57-83-94-143-115M258 359c102 57 190 51 252 25m215-56c-41 56-112 86-167 84" fill="none" stroke="#9dc9b6" stroke-width="8" stroke-linecap="round"/>
''' + person(220, 282, "#5aa9c9", .79) + person(740, 283, "#d5a15a", .79)),
    "prevencion": frame('''<path d="M480 77c88 67 158 73 158 73v111c0 101-58 148-158 180-100-32-158-79-158-180V150s70-6 158-73Z" fill="#d7f1e2" stroke="#2c9a77" stroke-width="13" filter="url(#shadow)"/>
<path d="m418 263 42 42 87-101" fill="none" stroke="#2c9a77" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
<g transform="translate(173 215)" fill="#de8f98" stroke="#ae5770" stroke-width="7"><circle r="38"/>''' + "".join(f'<path transform="rotate({i*45})" d="M0-38v-31"/>' for i in range(8)) + '''</g>
<g transform="translate(788 290)" fill="#de8f98" stroke="#ae5770" stroke-width="7"><circle r="27"/>''' + "".join(f'<path transform="rotate({i*60})" d="M0-27v-22"/>' for i in range(6)) + '''</g>'''),
}


for name, source in SCENES.items():
    (DEST / f"{name}.svg").write_text(source, encoding="utf-8")

print(f"{len(SCENES)} ilustraciones creadas en {DEST}")
