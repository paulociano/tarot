"""Generate delivery-size WebP derivatives; never modify source PNGs."""
from pathlib import Path
from PIL import Image, ImageOps
import json

source = Path("assets/cards")
target = Path("assets/optimized")
target.mkdir(parents=True, exist_ok=True)
originals = sorted(source.glob("*.png"))
if len(originals) != 79:
    raise SystemExit(f"Expected 79 PNG originals, got {len(originals)}")
before = after = 0
for path in originals:
    before += path.stat().st_size
    with Image.open(path) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        for width, quality in [(420, 83), (1050, 88)]:
            im = image.copy()
            im.thumbnail((width, round(width * 1.5)), Image.Resampling.LANCZOS)
            out = target / f"{path.stem}-{width}.webp"
            im.save(out, "WEBP", quality=quality, method=6)
            after += out.stat().st_size
        print(path.stem)
# Optional panoramic environments; original files remain untouched.
scene_target = target / "scenes"
scene_target.mkdir(exist_ok=True)
for name in ("portal", "santuario", "biblioteca", "observatorio", "grimorio", "silentium", "espelhos", "onirium"):
    candidates = [Path("assets/scenes") / (name + ext) for ext in (".png", ".webp")]
    path = next((p for p in candidates if p.is_file()), None)
    if path:
        with Image.open(path) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            image.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
            image.save(scene_target / (name + ".webp"), "WEBP", quality=86, method=6)
# Preserve the alpha channel of the optional mandala ornament.
halo = Path("assets/runes/aureola.png")
if halo.is_file():
    with Image.open(halo) as raw:
        ornament = raw.convert("RGBA")
        ornament.thumbnail((720, 720), Image.Resampling.LANCZOS)
        ornament.save(target / "aureola.webp", "WEBP", quality=84, method=6)
# Small transparent ritual material textures, loaded only inside their tools.
for name in ("runa", "moeda"):
    source_texture = Path("assets/instruments") / f"{name}.png"
    if source_texture.is_file():
        with Image.open(source_texture) as raw:
            texture = raw.convert("RGBA")
            texture.thumbnail((384, 384), Image.Resampling.LANCZOS)
            texture.save(target / f"{name}.webp", "WEBP", quality=85, method=6)
(target / "manifest.js").write_text("export const optimizedArt = true;\n", encoding="utf-8")
(target / "stats.json").write_text(json.dumps({"original_bytes": before, "derivative_bytes": after, "files": len(originals)*2}, indent=2))
print(f"Originals: {before:,} bytes; derivatives: {after:,} bytes")
if after >= before:
    raise SystemExit("Derivative budget exceeded")
