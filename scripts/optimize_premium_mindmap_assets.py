"""Keep catalog previews light and trim empty margins from complete downloads."""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]

def main():
    for path in (ROOT / 'assets/mindmaps/premium-previews').glob('*.webp'):
        image = Image.open(path).convert('RGB')
        image.thumbnail((720, 520))
        image.save(path, 'WEBP', quality=84, method=6)
    for path in (ROOT / 'api/_mindmaps').glob('*.webp'):
        image = Image.open(path).convert('RGB')
        background = Image.new('RGB', image.size, image.getpixel((0, 0)))
        difference = ImageChops.difference(image, background).convert('L')
        bounds = difference.point(lambda value: 255 if value > 14 else 0).getbbox()
        if bounds:
            left, top, right, bottom = bounds
            bounds = (max(0, left-50), max(0, top-50),
                      min(image.width, right+50), min(image.height, bottom+50))
            if bounds != (0, 0, image.width, image.height):
                image.crop(bounds).save(path, 'WEBP', quality=95, method=6)
    print('Previews optimized; complete maps trimmed without resizing their content.')

if __name__ == '__main__':
    main()
