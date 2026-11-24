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
for name in ["index.html", "style.css", "app.js", "deck.js", "engine.js", "runes.js", "storage.js", "cinematic.js", "knowledge.js", "oracle.js", "narration.js", "grimorio.js", "journey.js", "pwa.js", "sw.js", "manifest.webmanifest", ".nojekyll"]:
    shutil.copy2(name, dest / name)
shutil.copytree("assets", dest / "assets", ignore=shutil.ignore_patterns("README.md"))
stats = json.loads((dest / "assets/optimized/stats.json").read_text())
assert stats["files"] == 158
assert len(list((dest / "assets/optimized").glob("*.webp"))) == 158
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
