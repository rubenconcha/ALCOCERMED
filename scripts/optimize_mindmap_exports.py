"""Create lightweight card previews; preserve complete-download pixels losslessly."""
from pathlib import Path
import json
from PIL import Image, PngImagePlugin, ImageDraw

root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'content/mindmaps-catalog.json').read_text(encoding='utf8'))
sources=json.loads((root/'content/mindmaps-sources.json').read_text(encoding='utf8'))
tiles=[];preview_bytes=0;download_bytes=0
for entry in catalog:
    stem=Path(entry['key']).stem
    preview=root/'assets/mindmaps/previews'/f'{stem}.png'
    full=root/'assets/mindmaps/complete'/f'{stem}.png'
    with Image.open(preview) as original:
        small=original.convert('RGB');small.thumbnail((720,520),Image.Resampling.LANCZOS)
        target=preview.with_suffix('.webp');small.save(target,quality=84,method=6);preview_bytes+=target.stat().st_size
        tile=Image.new('RGB',(340,185),'white');small.thumbnail((330,155));tile.paste(small,((340-small.width)//2,0));ImageDraw.Draw(tile).text((7,163),entry['title'][:44],fill='#26445f');tiles.append(tile)
    source=sources[entry['key']]['source']
    with Image.open(full) as original:
        assert original.width==3540 and original.height>1400,entry['key']
        metadata=PngImagePlugin.PngInfo()
        metadata.add_itxt('Title',entry['title'])
        metadata.add_itxt('Source',source['book']+'; PDF pages '+str(source['pdfPages']))
        metadata.add_itxt('Brand','Preparatoria Ben Carson / AlcocerMed')
        original.save(full,optimize=True,pnginfo=metadata)
    download_bytes+=full.stat().st_size
sheet=Image.new('RGB',(340*4,185*20),'#eff4f8')
for i,tile in enumerate(tiles):sheet.paste(tile,(i%4*340,i//4*185))
(root/'output/mapas-qa').mkdir(exist_ok=True)
sheet.save(root/'output/mapas-qa/all-previews.jpg',quality=92)
print(json.dumps({'maps':len(catalog),'previewBytes':preview_bytes,'averagePreviewBytes':preview_bytes//len(catalog),'downloadBytes':download_bytes}))
