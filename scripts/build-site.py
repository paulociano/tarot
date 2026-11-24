"""Build the tested static site without dev artifacts or Git history."""
from pathlib import Path
import shutil
import json
import hashlib
import re

dest = Path("dist")
if dest.exists():
    shutil.rmtree(dest)
dest.mkdir()
for name in ["index.html", "style.css", "app.js", "universe.js", "atelier.js", "astrarium.js", "astronomy-data.js", "ancestral.js", "ancestral-data.js", "silentium.js", "silentium-clock.js", "mirrors.js", "mirrors-data.js", "deck.js", "engine.js", "runes.js", "storage.js", "cinematic.js", "soundscape.js", "knowledge.js", "oracle.js", "vault.js", "narration.js", "voice-script.js", "voice-worker.js", "grimorio.js", "journey.js", "art-protection.js", "reading-art.js", "custom-ritual.js", "pwa.js", "sw.js", "manifest.webmanifest", ".nojekyll"]:
    shutil.copy2(name, dest / name)
shutil.copytree("assets", dest / "assets", ignore=shutil.ignore_patterns("README.md"))
shutil.copytree("vendor", dest / "vendor")
for name in ("portal", "santuario", "biblioteca", "observatorio", "grimorio", "silentium"):
    assert (dest / "assets" / f"{name}.mp3").is_file(), f"Missing soundtrack: {name}"
stats = json.loads((dest / "assets/optimized/stats.json").read_text())
assert stats["files"] == 158
optimized = dest / "assets/optimized"
# Verify the exact derivative set rather than count unrelated ornamental art.
originals = sorted((dest / "assets/cards").glob("*.png"))
assert len(originals) == 79, "Expected 78 cards and one back"
expected = {f"{p.stem}-{width}.webp" for p in originals for width in (420, 1050)}
actual = {p.name for p in optimized.glob("*.webp") if re.search(r"-(420|1050)\.webp$", p.name)}
assert actual == expected, f"Card derivatives: missing={sorted(expected-actual)}, extra={sorted(actual-expected)}"
if (dest / "assets/runes/aureola.png").is_file():
    assert (optimized / "aureola.webp").is_file(), "Missing transparent ornamental derivative"
for name in ("runa", "moeda"):
    if (dest / "assets/instruments" / f"{name}.png").is_file():
        assert (optimized / f"{name}.webp").is_file(), f"Missing instrument: {name}"
for scene in ("portal", "santuario", "biblioteca", "observatorio", "grimorio", "silentium", "espelhos"):
    if any((dest / "assets/scenes" / f"{scene}{ext}").is_file() for ext in (".png", ".webp")):
        assert (optimized / "scenes" / f"{scene}.webp").is_file(), f"Missing scene: {scene}"
assert stats["derivative_bytes"] < stats["original_bytes"] * .5
assert "optimizedArt = true" in (dest / "assets/optimized/manifest.js").read_text()
index = dest / "index.html"
index.write_text(index.read_text(encoding="utf-8").replace('<body data-scene="home">','<body data-scene="home" class="optimized-art">'), encoding="utf-8")
# Stamp a content-derived shell version for atomic updates in Actions releases.
fingerprint = hashlib.sha256()
for path in sorted(dest.rglob("*")):
    if path.is_file() and path.suffix in (".html", ".js", ".css", ".webmanifest") and path.name != "sw.js":
        fingerprint.update(str(path.relative_to(dest)).encode())
        fingerprint.update(path.read_bytes())
worker = dest / "sw.js"
worker.write_text(re.sub(r"const VERSION='[^']+';", "const VERSION='"+fingerprint.hexdigest()[:16]+"';", worker.read_text(encoding="utf-8"), count=1), encoding="utf-8")
print(json.dumps(stats))
