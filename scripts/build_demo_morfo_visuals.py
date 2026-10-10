"""Build focused, non-photographic illustrations for the free Morfofunción demo."""

from pathlib import Path


OUT = Path(__file__).resolve().parents[1] / "juegos/assets/demo-morfo"
OUT.mkdir(parents=True, exist_ok=True)


def frame(kicker: str, subtitle: str, color: str, drawing: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 340" role="img" aria-label="{subtitle}">
<defs>
  <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#f8fbff"/><stop offset="1" stop-color="#e9f5fb"/></linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#1a4565" flood-opacity=".12"/></filter>
  <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 7 4 1 7" fill="none" stroke="{color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></marker>
</defs>
<rect width="760" height="340" rx="22" fill="url(#bg)"/>
<circle cx="670" cy="62" r="110" fill="{color}" opacity=".06"/><circle cx="110" cy="310" r="120" fill="{color}" opacity=".05"/>
<rect x="24" y="21" width="712" height="298" rx="22" fill="#fff" stroke="#d9e8f1" filter="url(#shadow)"/>
<rect x="48" y="43" width="6" height="34" rx="3" fill="{color}"/>
<text x="67" y="59" fill="#16324a" font-size="18" font-weight="800" font-family="Arial,sans-serif">{kicker}</text>
<text x="67" y="78" fill="#6a8092" font-size="12" font-family="Arial,sans-serif">{subtitle}</text>
{drawing}
</svg>'''


def card(x: int, y: int, w: int, h: int, fill="#f3f8fc") -> str:
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{fill}" stroke="#dce9f0"/>'


art = {}

# Anatomy: a clothed-neutral structural model, with clearly distinct bone, heart and lung forms.
art["anatomia.svg"] = frame("ANATOMÍA", "Estructuras y relaciones del cuerpo", "#2591c5", f'''
{card(76, 110, 260, 178)}{card(424, 110, 260, 178)}
<circle cx="206" cy="139" r="19" fill="#dcecf2" stroke="#347fa8" stroke-width="4"/>
<path d="M206 158v72m-40-54 40 22 40-22m-40 54-27 38m27-38 27 38" fill="none" stroke="#347fa8" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M190 185c14-5 28-5 32 0m-36 15c18-7 35-7 40 0m-37 14c15-4 29-4 34 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
<path d="M468 199c-9-30 9-55 33-54 17 0 28 12 31 29 8-26 23-34 42-28 25 8 29 39 12 58-15 18-39 34-55 48-18-14-47-31-63-53Z" fill="#f3a085" stroke="#df7568" stroke-width="4"/>
<path d="M530 153v-24m-25 12-10-19m59 20 11-18" fill="none" stroke="#347fa8" stroke-width="7" stroke-linecap="round"/>
<path d="M335 199h87" stroke="#2591c5" stroke-width="5" stroke-dasharray="6 8"/>
<circle cx="379" cy="199" r="12" fill="#2591c5"/><circle cx="379" cy="199" r="4" fill="#fff"/>
''')

# Physiology: show a process in action, without a human photo.
art["fisiologia.svg"] = frame("FISIOLOGÍA", "Órganos en funcionamiento", "#ed8d32", f'''
{card(70, 112, 286, 180)}{card(404, 112, 286, 180)}
<path d="M157 174c0-19 24-26 39-7 15-19 40-12 40 8 0 30-40 48-40 48s-39-23-39-49Z" fill="#ef6e78" stroke="#ca475b" stroke-width="5"/>
<path d="M196 224v31m-20-54h-41m60-50v-23" fill="none" stroke="#ca475b" stroke-width="8" stroke-linecap="round"/>
<path d="M126 258h140" stroke="#b7d8e3" stroke-width="4"/>
<path d="M129 248h24l9-27 12 42 13-23h15l9-13 10 21h42" fill="none" stroke="#ed8d32" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M539 142v44m-4 0c-19-24-45-14-45 14 0 21 13 34 31 34 12 0 16-8 18-14m4-34c19-24 45-14 45 14 0 21-13 34-31 34-12 0-16-8-18-14" fill="#a9d9e8" stroke="#347fa8" stroke-width="5" stroke-linecap="round"/>
<path d="M556 250c18 0 32-5 45-16m-68 16c-18 0-32-5-45-16" fill="none" stroke="#ed8d32" stroke-width="4" marker-end="url(#arrow)"/>
<path d="M354 201h46" stroke="#ed8d32" stroke-width="5" stroke-dasharray="5 7"/>
''')

art["radiologia.svg"] = frame("RADIOLOGÍA", "Una mirada al interior", "#268fba", f'''
{card(105, 105, 550, 188, "#e9f3f9")}
<rect x="155" y="123" width="292" height="149" rx="13" fill="#183754" stroke="#70b5d2" stroke-width="7"/>
<path d="M292 136v100m-51-75 51 22 51-22m-53 25-28 46m28-46 28 46" fill="none" stroke="#b4dfe9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M270 169q22 8 44 0m-48 14q26 9 52 0m-49 15q24 7 46 0" fill="none" stroke="#e8f8fc" stroke-width="3"/>
<circle cx="543" cy="190" r="48" fill="#fff" stroke="#268fba" stroke-width="10"/><path d="m577 225 37 36" stroke="#268fba" stroke-width="13" stroke-linecap="round"/>
<path d="M495 190h96m-48-48v96" stroke="#c8e4ee" stroke-width="2" opacity=".7"/>
''')

art["metodo-cientifico.svg"] = frame("MÉTODO CIENTÍFICO", "De una pregunta a una prueba", "#9258b1", f'''
{card(76, 117, 608, 174)}
<circle cx="172" cy="202" r="47" fill="#e6dcf4" stroke="#9258b1" stroke-width="4"/>
<text x="172" y="223" text-anchor="middle" fill="#734199" font-size="68" font-weight="700" font-family="Arial,sans-serif">?</text>
<path d="M221 202h65" stroke="#9258b1" stroke-width="5" marker-end="url(#arrow)"/>
<path d="M333 173c-20 0-35 13-35 32 0 11 6 20 14 26v16h40v-16c9-6 15-16 15-27 0-18-14-31-34-31Z" fill="#ffe5aa" stroke="#dca849" stroke-width="4"/>
<path d="M320 254h26" stroke="#dca849" stroke-width="5" stroke-linecap="round"/>
<path d="M372 202h65" stroke="#9258b1" stroke-width="5" marker-end="url(#arrow)"/>
<path d="M482 159h65l-12 50 27 51h-95l27-51-12-50Z" fill="#b5e2d9" stroke="#438e83" stroke-width="5"/>
<path d="M479 227q33-14 67 0" fill="none" stroke="#438e83" stroke-width="4"/>
<circle cx="496" cy="217" r="5" fill="#438e83"/><circle cx="525" cy="238" r="4" fill="#438e83"/>
<path d="M571 202h50" stroke="#9258b1" stroke-width="5" marker-end="url(#arrow)"/>
''')

art["evolucion.svg"] = frame("EVOLUCIÓN", "Poblaciones y cambio a través del tiempo", "#68a75d", f'''
{card(86, 109, 588, 186)}
<path d="M173 262v-52h101v-61m-101 61h140v38m-39-99h130v44m0 0h114v-47m-114 47h94v53m-325-36h-66" fill="none" stroke="#71ad69" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="173" cy="263" r="19" fill="#cceac8" stroke="#549551" stroke-width="4"/>
<circle cx="274" cy="149" r="19" fill="#d6efd0" stroke="#549551" stroke-width="4"/>
<circle cx="313" cy="248" r="19" fill="#c4e5d0" stroke="#549551" stroke-width="4"/>
<circle cx="518" cy="146" r="19" fill="#cceac8" stroke="#549551" stroke-width="4"/>
<circle cx="498" cy="246" r="19" fill="#c4e5d0" stroke="#549551" stroke-width="4"/>
<path d="m166 256 9-8 9 8m82-109 9-8 9 8m20 100 9-8 9 8m188-101 9-8 9 8m-28 99 9-8 9 8" fill="none" stroke="#549551" stroke-width="3"/>
<path d="M104 263h-3m548-117h10m-10 100h12" stroke="#68a75d" stroke-width="6" stroke-linecap="round"/>
''')

art["microscopia.svg"] = frame("MICROSCOPÍA", "Del tejido a la célula", "#2e9cab", f'''
{card(80, 110, 250, 183)}{card(408, 110, 270, 183)}
<path d="m159 256 43-22-37-54 27-20 43 60-21 16m-43 19h110m-84-64 15-36 25 10-15 36m-59 62h108" fill="none" stroke="#2e8298" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="249" cy="220" r="26" fill="#c7edf0" stroke="#2e8298" stroke-width="6"/>
<circle cx="550" cy="203" r="75" fill="#edf9fa" stroke="#2e9cab" stroke-width="6"/>
<circle cx="520" cy="181" r="25" fill="#d6b9e9" stroke="#916bb4" stroke-width="4"/><circle cx="581" cy="181" r="22" fill="#d6b9e9" stroke="#916bb4" stroke-width="4"/>
<circle cx="547" cy="233" r="25" fill="#d6b9e9" stroke="#916bb4" stroke-width="4"/>
<circle cx="520" cy="181" r="8" fill="#916bb4"/><circle cx="581" cy="181" r="7" fill="#916bb4"/><circle cx="547" cy="233" r="8" fill="#916bb4"/>
<path d="M330 202h70" stroke="#2e9cab" stroke-width="5" marker-end="url(#arrow)"/>
''')

art["historia.svg"] = frame("HISTORIA DE LA MEDICINA", "Observación, anatomía y microscopía", "#b08355", f'''
{card(93, 112, 260, 176)}{card(408, 112, 260, 176)}
<path d="M151 152q53-20 94 0v105q-47-19-94 0V152Zm94 0q45-20 94 0v105q-44-19-94 0V152Z" fill="#fff2d7" stroke="#a9784d" stroke-width="5" stroke-linejoin="round"/>
<path d="M178 178h43m-43 18h42m48-18h42m-42 18h43m-133 19h43m48 0h42" stroke="#caa77e" stroke-width="4" stroke-linecap="round"/>
<circle cx="245" cy="178" r="9" fill="#d58e79"/>
<path d="m481 244 40-21-31-49 25-16 38 57-24 17m-45 11h123m-79-50 16-38 25 10-16 38m-61 49h117" fill="none" stroke="#487b91" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="560" cy="214" r="24" fill="#e0f3f5" stroke="#487b91" stroke-width="6"/>
<path d="M356 202h48" stroke="#b08355" stroke-width="5" marker-end="url(#arrow)"/>
''')

art["hipotesis.svg"] = frame("HIPÓTESIS CIENTÍFICA", "Una idea que puede contrastarse", "#e39a3d", f'''
{card(81, 110, 598, 184)}
<path d="M164 155h114v105H164z" fill="#fff" stroke="#7d9db2" stroke-width="5"/>
<path d="M182 179h70m-70 21h50m-50 21h64" stroke="#b7cdd8" stroke-width="5" stroke-linecap="round"/>
<circle cx="278" cy="166" r="32" fill="#ffe1ad" stroke="#e39a3d" stroke-width="5"/>
<text x="278" y="179" text-anchor="middle" fill="#ae6b18" font-family="Arial,sans-serif" font-weight="800" font-size="35">?</text>
<path d="M316 204h60" stroke="#e39a3d" stroke-width="5" marker-end="url(#arrow)"/>
<path d="M414 155h61l-10 50 25 53h-92l25-53-9-50Z" fill="#b6dcd5" stroke="#519787" stroke-width="5"/>
<path d="M407 232q36-18 74 0" fill="none" stroke="#519787" stroke-width="4"/>
<path d="M490 204h55" stroke="#e39a3d" stroke-width="5" marker-end="url(#arrow)"/>
<path d="M567 255V167m0 88h78m-67-28 18-24 18 8 21-33" fill="none" stroke="#558aaa" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="597" cy="203" r="5" fill="#e39a3d"/><circle cx="614" cy="211" r="5" fill="#e39a3d"/>
''')

for name, svg in art.items():
    (OUT / name).write_text(svg + "\n", encoding="utf-8")

print(f"Generated {len(art)} illustrations in {OUT}")
