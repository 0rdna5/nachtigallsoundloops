from datetime import date
from pathlib import Path

from nachtigall_generator.textgen import generate_overlay
from nachtigall_generator.types import ContentType


def test_overlay_has_fields(tmp_path: Path):
    calendar_path = Path("config/occasions_at.json")
    target_date = date(2024, 12, 24)
    for content_type in ContentType:
        overlay = generate_overlay(content_type, calendar_path, target_date, seed=123)
        assert overlay["overlay_top"]
        assert overlay["overlay_bottom"]
        assert overlay["hook_line"]
        assert overlay["cta_line"]
        assert overlay["comment_trigger"]
        assert overlay["pin_comment"]
        assert overlay["hashtags"]
