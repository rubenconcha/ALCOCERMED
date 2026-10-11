"""Ilustraciones específicas para las 18 preguntas restantes del capítulo 1.

Cada escena presenta el fenómeno del enunciado, sin texto que revele la respuesta.
"""

from pathlib import Path
from generate_contextual_game_images import frame, cell, helix

DEST = Path(__file__).resolve().parents[1] / "juegos/assets/preguntas-contextuales"


def line(x1, y1, x2, y2, color="#258db8", width=8, dash=""):
    extra = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"{extra}/>'


def arrow(x1, y1, x2, y2, color="#258db8", width=9):
    from math import atan2, cos, sin
    a = atan2(y2-y1, x2-x1)
    s = 22
    p1 = (x2-s*cos(a-.55), y2-s*sin(a-.55))
    p2 = (x2-s*cos(a+.55), y2-s*sin(a+.55))
    return line(x1,y1,x2,y2,color,width) + f'<path d="M{p1[0]:.1f} {p1[1]:.1f}L{x2} {y2}L{p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'


def dot(x, y, r=10, color="#ecad50"):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>'


def microbe(x, y, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)">
<ellipse rx="78" ry="48" fill="#c7eccc" stroke="#349b73" stroke-width="7"/>
<path d="M-38 4c27-31 48 26 80-17" fill="none" stroke="#7954a7" stroke-width="8"/>
<path d="M-76-29l-20-19m50-41-3-24m110 49 24-16m-143 101-22 17m114 20 9 20" stroke="#349b73" stroke-width="7" stroke-linecap="round"/>
</g>'''


def virus(x, y, scale=1):
    rays = ''.join(f'<g transform="rotate({i*45})"><path d="M0-48v-24" stroke="#a05baa" stroke-width="6"/><circle cy="-75" r="8" fill="#c98dcc"/></g>' for i in range(8))
    return f'<g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)"><circle r="49" fill="#e5c8e8" stroke="#9957a6" stroke-width="7"/><path d="M-19 1q19-30 37 0" fill="none" stroke="#9957a6" stroke-width="6"/>{rays}</g>'


def protein(x, y, scale=1, color="#ad76c0"):
    return f'''<g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)"><path d="M-72-8C-69-68-21-51-8-26C0-13 30-59 65-28C91 0 45 24 35 13C21 0 28 61-9 57C-34 55-20 20-49 30C-69 39-80 19-72-8Z" fill="{color}" stroke="#704a96" stroke-width="7"/><circle cx="-27" cy="-14" r="8" fill="#f7d47b"/></g>'''


def membrane(x, y, width=540):
    parts = []
    for i in range(0, width+1, 30):
        parts.append(dot(x+i,y-28,10,"#2e9cc4"))
        parts.append(dot(x+i,y+28,10,"#2e9cc4"))
        parts.append(line(x+i-4,y-17,x+i-4,y+17,"#e6ac69",3))
        parts.append(line(x+i+4,y-17,x+i+4,y+17,"#e6ac69",3))
    return ''.join(parts)


def nucleus(x, y, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale})" filter="url(#shadow)"><circle r="100" fill="#e9dff4" stroke="#9475b7" stroke-width="9"/><circle r="30" fill="#8062ac"/>{helix(-50,0,.28)}{helix(48,8,.23)}</g>'


def organelle(x, y, scale=1):
    return f'<g transform="translate({x} {y}) scale({scale}) rotate(-22)"><ellipse rx="58" ry="33" fill="#f5b475" stroke="#ce8058" stroke-width="6"/><path d="M-38-12q20 21 0 31m28-34q20 21 0 31m28-34q20 21 0 31" fill="none" stroke="#d47751" stroke-width="5"/></g>'


def microscope(x, y, scale=1):
    return f'''<g transform="translate({x} {y}) scale({scale})" stroke="#1d688d" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none">
<path d="M-45-116l40-30 54 66-40 30Z" fill="#d6eff7"/><path d="M23-36q84 41 25 116m-100 15h117m-45-57h-96"/><circle cx="-11" cy="-44" r="13" fill="#edae55"/></g>'''


def card(body, x, y, stroke="#8bbaca"):
    return f'<g transform="translate({x} {y})"><rect x="-110" y="-98" width="220" height="196" rx="25" fill="#fff" stroke="{stroke}" stroke-width="6" filter="url(#shadow)"/>{body}</g>'


SCENES = {
    # Una proteína mal plegada que induce el mismo cambio en una proteína vecina.
    "prion": frame(protein(306,240,1.2,"#bca7d5") + arrow(420,240,535,240,"#e1a048") + protein(646,240,1.2,"#e09da2") + '<path d="M613 181q-50-71-87-23" fill="none" stroke="#e09da2" stroke-width="10"/>'),
    # Observación de un sistema real, representación reducida y contraste.
    "modelo-biologico": frame(cell(196,234,.95) + arrow(310,235,428,235) + card('<circle r="55" fill="#d0eadd" stroke="#4da682" stroke-width="7"/>' + helix(0,0,.29),540,234) + arrow(650,235,765,235) + microscope(829,252,.7)),
    # Bacterias creciendo en una placa bajo observación, no un mapa del capítulo.
    "bacterias-modelo": frame('<circle cx="387" cy="242" r="170" fill="#eff7e6" stroke="#6aa681" stroke-width="12" filter="url(#shadow)"/>' + microbe(320,190,.52) + microbe(455,240,.67) + microbe(340,324,.43) + microbe(470,345,.30) + microscope(738,250,.9)),
    # De células y tejidos a un problema biomédico observado.
    "biomedicina-celular": frame(cell(248,241,1.08) + arrow(364,238,490,238,"#e8a543") + '<g transform="translate(615 239)"><path d="M-86-8c8-59 78-63 86-12 8-51 78-47 86 12 10 65-86 118-86 118S-96 57-86-8Z" fill="#f2a09a" stroke="#c86770" stroke-width="8"/></g>' + microscope(810,252,.65)),
    # Bicapa con un canal y moléculas atravesándola.
    "membrana-plasmatica": frame(membrane(177,243,600) + '<rect x="455" y="184" width="66" height="117" rx="26" fill="#9574b6" stroke="#654b97" stroke-width="7"/>' + arrow(488,112,488,366,"#ed9f48",8) + dot(488,146,13,"#e66e74") + dot(488,342,13,"#e66e74")),
    # Medio acuoso interno con orgánulos suspendidos.
    "citoplasma": frame('<circle cx="480" cy="240" r="186" fill="#d8f2f7" stroke="#2d98bd" stroke-width="10" filter="url(#shadow)"/>' + nucleus(445,224,.72) + organelle(595,190,.78) + organelle(365,325,.5) + ''.join(dot(x,y,6,"#62baa6") for x,y in [(315,177),(614,293),(538,343),(330,267),(545,110),(390,119),(660,225)])),
    # Envoltura nuclear, nucléolo y ADN dentro del núcleo.
    "nucleo": frame('<circle cx="480" cy="238" r="190" fill="#eaf4fa" stroke="#3996bd" stroke-width="10"/>' + nucleus(480,239,1.38) + ''.join(dot(x,y,7,"#8d72bb") for x,y in [(482,105),(610,245),(360,297)])),
    # Regulación ante cambios del medio: desvío y retorno a una banda estable.
    "homeostasis-celular": frame(cell(470,239,1.11) + '<path d="M130 142q96-86 173 0M650 339q87 93 177-7" fill="none" stroke="#e4a34e" stroke-width="10"/>' + arrow(300,150,340,180,"#e4a34e") + arrow(660,313,630,285,"#e4a34e") + '<path d="M102 363h163v-104h-84v52h-79Zm594-233h161v104h-83v-52h-78Z" fill="#d4ecf3" stroke="#368fad" stroke-width="7"/>'),
    # ADN transcrito y ARN que alcanza al ribosoma.
    "expresion-genica": frame(helix(192,240,.75) + arrow(289,240,418,240,"#e2a044") + '<path d="M446 173q25 100 78 58t66 37" fill="none" stroke="#208cab" stroke-width="12"/>' + arrow(600,240,696,240,"#e2a044") + protein(778,250,.95)),
    # Proteína encajada en un sustrato, reacción biológica concreta.
    "proteina-funcion": frame(protein(466,240,1.72) + '<path d="M497 159q19-33 43-9l34 38q12 21-7 36l-36 15-29-30Z" fill="#f1bc64" stroke="#d38843" stroke-width="8"/>' + arrow(140,240,280,240,"#4da9aa") + dot(114,239,18,"#edac57") + arrow(670,240,810,240,"#4da9aa") + dot(837,213,14,"#edac57") + dot(837,267,14,"#edac57")),
    # Serie temporal de células con cambio heredable, no evolución humana.
    "evolucion-celular": frame(microbe(205,240,.73) + arrow(307,240,413,240,"#69a77b") + microbe(499,240,.89) + arrow(606,240,701,240,"#69a77b") + microbe(787,240,1.0) + '<path d="M741 177q38-26 70 0" fill="none" stroke="#e6a858" stroke-width="8"/>'),
    # Dos organizaciones celulares lado a lado.
    "comparacion-celulas": frame(microbe(248,242,1.36) + '<path d="M476 101v278" stroke="#a9c0cc" stroke-width="6" stroke-dasharray="13 14"/>' + cell(708,239,1.48)),
    # Elementos estructurales distintos en la misma célula.
    "componentes-celulares": frame('<circle cx="480" cy="240" r="191" fill="#d9f0f8" stroke="#318fb7" stroke-width="11" filter="url(#shadow)"/>' + nucleus(421,225,.79) + organelle(581,164,.62) + organelle(584,310,.56) + membrane(315,378,330)),
    # Partículas acelulares de distinta naturaleza fuera de una célula.
    "sistemas-acelulares": frame(virus(279,238,1.35) + '<path d="M474 114v252" stroke="#b0c2cb" stroke-width="5" stroke-dasharray="12 15"/>' + protein(665,238,1.37,"#e1a5b7") + '<circle cx="808" cy="119" r="10" fill="#e7ae57"/>'),
    # Núcleo y compartimentos representativos de la organización eucariota.
    "rasgos-eucariotas": frame(cell(470,239,1.88) + nucleus(470,230,.50) + organelle(567,162,.57) + organelle(549,328,.43)),
    # Distintas tareas biológicas de proteínas, cada una en escena propia.
    "funciones-proteinas": frame(card(protein(0,0,.80) + dot(53,-20,12,"#e9ad57"),218,239) + card('<path d="M-63 10h126M0-52v124" stroke="#4a9fb2" stroke-width="17" stroke-linecap="round"/>' + protein(0,-48,.45),480,239,"#b7d5c3") + card('<path d="M-78 35q65-115 155 2" fill="none" stroke="#dfaa5e" stroke-width="11"/>' + protein(0,0,.80),742,239,"#d5b3d9")),
    # Secuencia de escalas: célula, código hereditario, molécula funcional.
    "conceptos-introductorios": frame(cell(185,237,.76) + arrow(289,237,390,237,"#6aa9b9") + helix(486,236,.69) + arrow(577,237,674,237,"#6aa9b9") + protein(774,237,1.05)),
    # Jerarquía de información sin etiquetas-respuesta.
    "niveles-informacion": frame(helix(178,240,.70) + arrow(264,240,366,240,"#e3a451") + '<path d="M386 166q43 31 78 0t76 0q-42 33-78 0t-76 0Zm0 74q43 31 78 0t76 0q-42 33-78 0t-76 0Zm0 74q43 31 78 0t76 0q-42 33-78 0t-76 0Z" fill="#b99dd7" stroke="#7458a2" stroke-width="5"/>' + arrow(572,240,665,240,"#e3a451") + protein(777,240,1.06)),
}

for name, svg in SCENES.items():
    (DEST / f"{name}.svg").write_text(svg, encoding="utf-8")

print(f"{len(SCENES)} ilustraciones nuevas: {DEST}")
