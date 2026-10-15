"""Build the reviewed map hierarchy and source/image/download manifest.

The editorial files contain concise paraphrases of the supplied course books.
PDF page ranges are document page numbers, not printed page numbers.
The approved encephalon hierarchy is deliberately retained verbatim.
"""
from pathlib import Path
import json, re, unicodedata

ROOT = Path(__file__).resolve().parents[1]
COLORS = ['#429243', '#267dd0', '#8c59b0', '#e58929', '#209caa', '#d76387']

def load(name):
    return json.loads((ROOT / name).read_text(encoding='utf-8-sig'))

def parse(name):
    maps = {}; current = None
    for line in (ROOT / name).read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'): continue
        if line.startswith('@'):
            parts = line[1:].split('|'); current = parts[0]
            maps[current] = {'labels': parts[1:], 'rows': []}; continue
        parts = line.split('|')
        assert len(parts) >= 3, line
        titles = parts[0].split(' / ')
        assert len(titles) == 2, line
        items = [dict(zip(['title', 'text'], p.split('~', 1))) for p in parts[1:]]
        maps[current]['rows'].append({'titles': titles, 'items': items})
    for key, value in maps.items(): assert len(value['rows']) == 6, key
    return maps

def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if not unicodedata.combining(c))

def main():
    catalog = load('content/mindmaps-catalog.json')
    legacy = {x['key']: x['foundation'] for x in catalog}
    additions = {}
    specific_headings = load('content/mindmaps-detail-headings.json')
    specific_groups = load('content/mindmaps-detail-groups.json')
    for subject in ['morfo', 'bio', 'salud', 'extra']:
        additions.update(parse('content/mindmaps-' + subject + '-editorial.txt'))
    approved = (ROOT/'mindmap-detailed-content.js').read_text(encoding='utf8')
    detailed = json.JSONDecoder().raw_decode(approved.split('window.MINDMAP_DETAILED_CONTENT =', 1)[1].lstrip())[0]
    # Only the one approved map is retained from the previous build.
    detailed = {'morfo_14_encefalo_pares_craneales.png': detailed['morfo_14_encefalo_pares_craneales.png']}
    images = load('content/mindmaps-illustration-sources.json')
    ranges = {x['chapter']: x['pages'] for x in images.values() if x['book'] == 'morfo'}
    health_ranges = [(2,6),(2,5),(5,6),(6,10),(10,11),(11,15),(15,17),(20,22),(22,23),(23,25),(26,31),(32,40),(40,49),(49,60),(60,84),(85,94),(95,108),(109,115),(116,122),(123,139),(140,144),(145,160),(161,170),(171,182),(183,190),(191,204),(205,226)]
    manifest = {}
    for entry in catalog:
        key = entry['key']; stem = Path(key).stem
        if key != 'morfo_14_encefalo_pares_craneales.png':
            ident = '_'.join(stem.split('_')[:2]) if '_' in stem else stem
            edit = additions[ident]
            labels = edit['labels'] or entry['branches']
            if ident == 'morfo_02': labels = labels + ['Reacciones químicas']
            assert len(labels) == 6, key
            sections = []
            for i, row in enumerate(edit['rows']):
                original = legacy[key][i] if i < len(legacy[key]) else [
                    ['Reactivos y productos', 'Los reactivos se transforman en productos; una ecuación representa la transformación.'],
                    ['Reacciones reversibles', 'Pueden avanzar en ambas direcciones según condiciones y concentraciones.']]
                # Keep the established foundation, then open a separately named detailed group.
                foundation = [{'title': pair[0], 'text': pair[1]} for pair in original]
                foundation_titles = {x['title'] for x in foundation}
                for item in row['items']:
                    if item['title'] in foundation_titles:
                        if ident == 'membranaplasmatica' and item['title'] == 'Proteínas':
                            item['title'] = 'Integrales y periféricas'
                        else:
                            item['title'] = specific_headings[item['title']]
                sections.append({'title': labels[i], 'color': COLORS[i], 'groups': [
                    {'title': row['titles'][0], 'items': foundation},
                    {'title': row['titles'][1], 'items': row['items']}]})
            detailed[key] = sections
            for section in sections:
                for group in section['groups']:
                    if group['title'] in {item['title'] for item in group['items']}:
                        group['title'] = specific_groups[group['title']]
        if key.startswith('morfo'):
            n = int(key.split('_')[1]); source = {'book': 'Saladin: Anatomía y fisiología', 'chapter': n, 'pdfPages': ranges[n]}
        elif key.startswith('salud'):
            n = int(key.split('_')[1]); source = {'book': 'Educación en Salud e Investigación: texto suministrado del Curso Básico', 'pdfPages': health_ranges[n-1]}
        else:
            info = images[key]; source = {'book': 'Calvo: Biología celular biomédica', 'chapter': info['chapter'], 'pdfPages': info['pages']}
        image_path = images[key]['image'] if key in images else '/assets/mindmaps/illustrations/'+stem+'.svg'
        if key == 'morfo_14_encefalo_pares_craneales.png': image_path = '/assets/mindmaps/encefalo/anatomia.webp'
        manifest[key] = {'image': image_path, 'alt': 'Ilustración de '+entry['title'],
            'download': '/assets/mindmaps/complete/'+stem+'.png?v=1',
            'filename': stem+'-Prepa-Ben-Carson.png',
            'thumbnail': '/assets/mindmaps/previews/'+stem+'.webp?v=1', 'source': source}
        if key in images:
            manifest[key]['source']['imagePdfPage'] = images[key]['imagePage']
        count = sum(len(g['items']) for s in detailed[key] for g in s['groups'])
        assert count >= 24, (key, count)
        assert all(g['items'] and all(x['title'] and x['text'] for x in g['items']) for s in detailed[key] for g in s['groups'])
    assert len(detailed) == len(manifest) == len(catalog) == 79
    for key, sections in detailed.items():
        for section in sections:
            for group in section['groups']:
                for item in group['items']:
                    assert '\ufffd' not in item['title']+item['text'], key
                    assert not re.search(r'\b(senalados|segun el capitulo|capitulo tantos)\b', norm(item['title']+' '+item['text'])), key
    # These two chapters require the same verified subscription as detailed maps.
    # Rebuilding must never put their explanations back into a public script.
    for restricted in json.loads((ROOT/'content/mindmaps-restricted-general.json').read_text(encoding='utf8')):
        key, ident = restricted['parent_key'], restricted['id']
        assets = dict(manifest[key], download='/api/mindmap?id='+ident+'&format=image', filename=ident+'-Prepa-Ben-Carson.webp')
        payload = {'id': ident, 'sections': detailed.pop(key), 'assets': assets}
        (ROOT/'api/_mindmaps'/(ident+'.json')).write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf8')
    public_assets = {key: value for key,value in manifest.items() if key in detailed}
    (ROOT/'mindmap-detailed-content.js').write_text('/* Reviewed progressive hierarchies; subscription chapters are server-protected. */\nwindow.MINDMAP_DETAILED_CONTENT = '+json.dumps(detailed, ensure_ascii=False, separators=(',',':'))+';\nwindow.MINDMAP_ASSETS = '+json.dumps(public_assets, ensure_ascii=False, separators=(',',':'))+';\n', encoding='utf8')
    (ROOT/'content/mindmaps-sources.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    print(json.dumps({'maps': len(detailed), 'concepts': sum(len(g['items']) for ss in detailed.values() for s in ss for g in s['groups'])}))

if __name__ == '__main__': main()
