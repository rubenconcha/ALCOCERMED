"""Build small WebP previews for the mind-map grid without changing the originals."""

from pathlib import Path

from PIL import Image, ImageOps


MAPS_DIR = Path(__file__).resolve().parents[1] / "mapas mentales"
THUMBS_DIR = MAPS_DIR / "thumbs"
SUPPORTED = {".png", ".jpg", ".jpeg", ".webp"}
MAX_WIDTH = 640


def main() -> None:
    THUMBS_DIR.mkdir(exist_ok=True)
    originals = sorted(
        path for path in MAPS_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED
    )
    for source in originals:
        target = THUMBS_DIR / f"{source.stem}.webp"
        if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
            continue
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            if image.mode in ("RGBA", "LA"):
                background = Image.new("RGB", image.size, "white")
                background.paste(image, mask=image.getchannel("A"))
                image = background
            else:
                image = image.convert("RGB")
            image.thumbnail((MAX_WIDTH, MAX_WIDTH), Image.Resampling.LANCZOS)
            image.save(target, "WEBP", quality=82, method=6)
    original_bytes = sum(path.stat().st_size for path in originals)
    preview_bytes = sum((THUMBS_DIR / f"{path.stem}.webp").stat().st_size for path in originals)
    print(f"{len(originals)} mapas: {original_bytes:,} -> {preview_bytes:,} bytes en vistas previas")


if __name__ == "__main__":
    main()
