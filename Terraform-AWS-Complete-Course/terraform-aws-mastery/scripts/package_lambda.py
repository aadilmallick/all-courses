from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
info = ZipInfo("handler.py", date_time=(2026, 1, 1, 0, 0, 0))
info.compress_type = ZIP_DEFLATED
info.external_attr = 0o644 << 16
with ZipFile(root / "assets/health.zip", "w") as archive:
    archive.writestr(info, (root / "assets/handler.py").read_bytes())
print("Built assets/health.zip from assets/handler.py")
