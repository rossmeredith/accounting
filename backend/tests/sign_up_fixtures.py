import json
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[2]

SIGN_UP = json.loads(
    (_REPO_ROOT / "test-fixtures/sign-up.json").read_text(encoding="utf-8")
)
