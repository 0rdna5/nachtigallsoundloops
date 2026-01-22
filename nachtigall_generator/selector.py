from __future__ import annotations

import random
from pathlib import Path
from typing import Optional

from .types import ContentType


class AssetNotFound(Exception):
    """Raised when required assets are missing."""


class AssetSelector:
    def __init__(self, assets_root: Path, rng: Optional[random.Random] = None) -> None:
        self.assets_root = assets_root
        self.rng = rng or random.Random()

    def _pick_from_dir(self, directory: Path) -> Path:
        if not directory.exists() or not directory.is_dir():
            raise AssetNotFound(f"Asset directory missing: {directory}")
        candidates = [p for p in directory.iterdir() if p.is_file() and not p.name.startswith('.')]
        if not candidates:
            raise AssetNotFound(f"No assets found in {directory}")
        return self.rng.choice(candidates)

    def pick_video_template(self, content_type: ContentType) -> Path:
        return self._pick_from_dir(self.assets_root / "video_templates" / content_type.value)

    def pick_audio_loop(self) -> Path:
        return self._pick_from_dir(self.assets_root / "audio_loops")

    def pick_font(self, font_name: str) -> Path:
        font_path = self.assets_root / "fonts" / font_name
        if not font_path.exists():
            raise AssetNotFound(f"Font not found: {font_path}")
        return font_path

    def brand_overlay(self, name: str) -> Optional[Path]:
        overlay_path = self.assets_root / "brand" / name
        if overlay_path.exists():
            return overlay_path
        return None


__all__ = ["AssetSelector", "AssetNotFound"]
