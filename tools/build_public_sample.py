"""Refresh the public flashcards from the campus markup and the five existing questions."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
STUDY = re.compile(r'<section id="study-area"[^>]*>.*?</section>', re.S)
MARKUP = ROOT / 'muestra.html'
ENGINE = ROOT / 'sample-engine.js'

campus = (ROOT / 'campus.html').read_text(encoding='utf-8')
study = STUDY.search(campus).group()
markup = MARKUP.read_text(encoding='utf-8')
markup = STUDY.sub(lambda _: study, markup, count=1)
for name in ('styles.css', 'student-white.css', 'campus-theme.css'):
    asset = re.compile(re.escape(name) + r'\?v=[^"]+')
    markup = asset.sub(asset.search(campus).group(), markup, count=1)
MARKUP.write_text(markup, encoding='utf-8')

script = (ROOT / 'script.js').read_text(encoding='utf-8')
questions = re.search(r'const QUIZ_QUESTIONS = \[(.*?)\n\];', script, re.S).group(1)
rows = re.findall(r'^    \{ q:.*$', questions, re.M)[:5]
declaration = 'const SAMPLE_FLASHCARDS = [\n' + '\n'.join(rows) + '\n];'
engine = ENGINE.read_text(encoding='utf-8')
ENGINE.write_text(
    re.sub(r'const SAMPLE_FLASHCARDS = \[.*?\n\];', lambda _: declaration, engine, count=1, flags=re.S),
    encoding='utf-8',
)
