from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path
from typing import Optional

import typer

from .composer import ComposerError, OverlayTexts, compose_video, render_overlay_image
from .config import AppSettings
from .metadata import build_metadata, write_metadata
from .selector import AssetNotFound, AssetSelector
from .textgen import default_trends, generate_overlay
from .types import ContentType
from .uploader_youtube import YouTubeUploader

app = typer.Typer(help="Nachtigall daily generator")


@app.command()
def generate(
    date_str: Optional[str] = typer.Option(None, "--date", help="YYYY-MM-DD target date"),
    out_dir: Optional[Path] = typer.Option(None, "--out", help="Output directory"),
    content_type: Optional[str] = typer.Option(None, "--type", help="Force content type (type1..type6)"),
    trend_mode: bool = typer.Option(False, "--trend", help="Enable trend keywords"),
    trend_keywords: Optional[str] = typer.Option(None, help="Comma separated trend keywords"),
    youtube_upload: bool = typer.Option(False, "--youtube-upload", help="Upload to YouTube if enabled"),
):
    target_date = (
        datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else date.today()
    )

    settings = AppSettings()
    output_root = out_dir or settings.output_dir
    trend_enabled = trend_mode or settings.trend_mode
    youtube_enabled = youtube_upload or settings.youtube_upload

    resolved_type = (
        ContentType.from_key(content_type)
        if content_type
        else ContentType.rotate_by_date(settings.type_rotation, target_date)
    )

    styles = settings.load_styles()
    style = styles.get(resolved_type)
    if not style:
        raise typer.Exit(code=1)

    rng_seed = target_date.toordinal()
    keywords = default_trends(trend_keywords.split(",") if trend_keywords else None)
    overlay_data = generate_overlay(
        resolved_type,
        settings.config_dir / settings.occasions_file,
        target_date,
        trend_keywords=keywords if trend_enabled else None,
        seed=rng_seed,
    )

    selector = AssetSelector(settings.assets_dir)
    try:
        template_video = selector.pick_video_template(resolved_type)
        audio_loop = selector.pick_audio_loop(resolved_type)
        font_path = selector.pick_font(style.font)
    except AssetNotFound as exc:
        typer.echo(f"Asset missing: {exc}")
        raise typer.Exit(code=1)

    overlay_image = render_overlay_image(
        font_path=font_path,
        font_size=style.font_size,
        outline=style.outline,
        colors=style.colors,
        safe_margin=style.safe_margin,
        overlay_texts=OverlayTexts(
            top=overlay_data["overlay_top"],
            bottom=overlay_data["overlay_bottom"],
        ),
    )

    output_dir = Path(output_root) / target_date.isoformat()
    output_dir.mkdir(parents=True, exist_ok=True)
    video_path = output_dir / "video.mp4"

    try:
        compose_video(
            template_video=template_video,
            audio_loop=audio_loop,
            overlay_image=overlay_image,
            output_path=video_path,
            saturation=float(style.video.get("saturation", 1.0)),
            contrast=float(style.video.get("contrast", 1.0)),
            vignette=bool(style.video.get("vignette", False)),
            fps=30,
            max_bitrate="20M",
        )
    except (ComposerError, AssetNotFound) as exc:
        typer.echo(f"Failed to compose video: {exc}")
        raise typer.Exit(code=1)

    metadata = build_metadata(target_date, resolved_type, overlay_data)
    metadata_path = output_dir / "metadata.json"
    write_metadata(metadata, metadata_path)

    if youtube_enabled:
        uploader = YouTubeUploader(category_id=settings.youtube_category_id)
        try:
            video_id = uploader.upload(
                video_path,
                metadata.platforms["youtube"].model_dump(),
            )
            if video_id:
                typer.echo(f"Uploaded to YouTube with id: {video_id}")
        except Exception as exc:  # pragma: no cover - optional path
            typer.echo(f"YouTube upload failed: {exc}")

    typer.echo(f"Generated package in {output_dir}")


if __name__ == "__main__":
    app()
