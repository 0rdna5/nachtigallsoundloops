from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Dict, List

from ._compat import BaseModel, Field

from .types import ContentType


class PlatformMetadata(BaseModel):
    title: str | None = None
    description: str | None = None
    caption: str | None = None
    hashtags: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    pinned_comment: str | None = None
    thumbnail_text: str | None = None
    alt_text: str | None = None
    comment_trigger: str | None = None
    cta_line: str | None = None


class DailyMetadata(BaseModel):
    date: str
    content_type: str
    hook_line: str
    overlay_top: str
    overlay_bottom: str
    platforms: Dict[str, PlatformMetadata]


def build_metadata(
    target_date: date,
    content_type: ContentType,
    overlay_data: Dict[str, str],
) -> DailyMetadata:
    base_title = f"{content_type.human_name()} | {overlay_data['overlay_top']}"
    hashtags = overlay_data.get("hashtags", [])

    youtube = PlatformMetadata(
        title=base_title[:100],
        description=_compose_description(overlay_data, platform="youtube"),
        hashtags=hashtags,
        tags=[ct.value for ct in ContentType],
        pinned_comment=overlay_data.get("pin_comment"),
        thumbnail_text=overlay_data.get("overlay_top", "")[:35],
        comment_trigger=overlay_data.get("comment_trigger"),
        cta_line=overlay_data.get("cta_line"),
    )

    instagram = PlatformMetadata(
        caption=_compose_description(overlay_data, platform="instagram"),
        hashtags=hashtags[:15],
        alt_text=overlay_data.get("overlay_bottom"),
        comment_trigger=overlay_data.get("comment_trigger"),
        cta_line=overlay_data.get("cta_line"),
    )

    tiktok = PlatformMetadata(
        caption=_compose_description(overlay_data, platform="tiktok"),
        hashtags=hashtags[:8],
        comment_trigger=overlay_data.get("comment_trigger"),
        cta_line=overlay_data.get("cta_line"),
    )

    return DailyMetadata(
        date=target_date.isoformat(),
        content_type=content_type.value,
        hook_line=overlay_data.get("hook_line", ""),
        overlay_top=overlay_data.get("overlay_top", ""),
        overlay_bottom=overlay_data.get("overlay_bottom", ""),
        platforms={
            "youtube": youtube,
            "instagram": instagram,
            "tiktok": tiktok,
        },
    )


def _compose_description(overlay_data: Dict[str, str], platform: str) -> str:
    hashtags = " ".join(overlay_data.get("hashtags", []))
    hook = overlay_data.get("hook_line", "")
    trigger = overlay_data.get("comment_trigger", "")
    cta = overlay_data.get("cta_line", "")
    description_parts = [hook, overlay_data.get("overlay_bottom", ""), trigger, cta, hashtags]
    description = " | ".join(part for part in description_parts if part)
    if platform == "tiktok":
        return description[:150]
    return description


def write_metadata(metadata: DailyMetadata, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(metadata.model_dump(), handle, ensure_ascii=False, indent=2)


__all__ = ["DailyMetadata", "PlatformMetadata", "build_metadata", "write_metadata"]
