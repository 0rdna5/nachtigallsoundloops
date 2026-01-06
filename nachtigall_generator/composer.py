from __future__ import annotations

import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional

_pil_import_error = ""
try:  # pragma: no cover - optional dependency check
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:  # pragma: no cover - handled at runtime
    Image = None
    ImageDraw = None
    ImageFont = None
    _pil_import_error = exc

from .selector import AssetNotFound


class ComposerError(RuntimeError):
    pass


def _load_font(font_path: Path, size: int) -> ImageFont.FreeTypeFont:
    if ImageFont is None:
        raise ComposerError(f"Pillow missing: {_pil_import_error}")
    if not font_path.exists():
        raise AssetNotFound(f"Font not found: {font_path}")
    return ImageFont.truetype(str(font_path), size=size)


@dataclass
class OverlayTexts:
    top: str
    bottom: str


def render_overlay_image(
    font_path: Path,
    font_size: int,
    outline: Dict[str, int | str],
    colors: Dict[str, str],
    safe_margin: int,
    overlay_texts: OverlayTexts,
    image_size: tuple[int, int] = (1080, 1920),
) -> Path:
    if Image is None or ImageDraw is None:
        raise ComposerError(f"Pillow missing: {_pil_import_error}")
    font = _load_font(font_path, font_size)
    image = Image.new("RGBA", image_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    stroke_width = int(outline.get("width", 2))
    stroke_fill = outline.get("color", "#000000")

    # Top text
    top_bbox = draw.textbbox((0, 0), overlay_texts.top, font=font, stroke_width=stroke_width)
    top_width = top_bbox[2] - top_bbox[0]
    top_height = top_bbox[3] - top_bbox[1]
    top_position = ((image_size[0] - top_width) / 2, safe_margin)
    draw.text(
        top_position,
        overlay_texts.top,
        font=font,
        fill=colors.get("text", "#ffffff"),
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )

    # Bottom text
    bottom_bbox = draw.textbbox(
        (0, 0), overlay_texts.bottom, font=font, stroke_width=stroke_width
    )
    bottom_width = bottom_bbox[2] - bottom_bbox[0]
    bottom_height = bottom_bbox[3] - bottom_bbox[1]
    bottom_position = (
        (image_size[0] - bottom_width) / 2,
        image_size[1] - safe_margin - bottom_height,
    )
    draw.text(
        bottom_position,
        overlay_texts.bottom,
        font=font,
        fill=colors.get("text", "#ffffff"),
        stroke_width=stroke_width,
        stroke_fill=stroke_fill,
    )

    tmp_file = Path(tempfile.mkstemp(suffix="_overlay.png")[1])
    image.save(tmp_file)
    return tmp_file


def _probe_duration(video_path: Path) -> float:
    try:
        result = subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(video_path),
            ]
        )
        return float(result.strip())
    except Exception:
        return 15.0


def compose_video(
    template_video: Path,
    audio_loop: Path,
    overlay_image: Path,
    output_path: Path,
    saturation: float = 1.0,
    contrast: float = 1.0,
    vignette: bool = False,
    fps: int = 30,
    max_bitrate: Optional[str] = None,
) -> None:
    if not template_video.exists():
        raise AssetNotFound(f"Template missing: {template_video}")
    if not audio_loop.exists():
        raise AssetNotFound(f"Audio loop missing: {audio_loop}")
    if not overlay_image.exists():
        raise AssetNotFound(f"Overlay missing: {overlay_image}")

    duration = _probe_duration(template_video)
    fade_start = max(duration - 0.2, 0)

    video_filters = [
        "[0:v]scale=1080:-1:force_original_aspect_ratio=decrease",
        "pad=1080:1920:(1080-iw)/2:(1920-ih)/2",
    ]
    if saturation != 1.0 or contrast != 1.0:
        video_filters.append(f"eq=saturation={saturation}:contrast={contrast}")
    if vignette:
        video_filters.append("vignette")
    video_filters.append("fade=t=in:st=0:d=0.2")
    video_filters.append(f"fade=t=out:st={fade_start:.2f}:d=0.2")
    video_filters.append("format=yuv420p")
    video_chain = ",".join(video_filters) + "[v0]"

    overlay_chain = "[v0][1:v]overlay=0:0:format=auto[v]"
    audio_chain = (
        f"[2:a]aloop=loop=-1:size=2e+09,atrim=0:{duration:.2f},asetpts=N/SR/TB,"
        f"afade=t=in:st=0:d=0.2,afade=t=out:st={fade_start:.2f}:d=0.2[a]"
    )

    filter_complex = f"{video_chain};{overlay_chain};{audio_chain}"

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(template_video),
        "-i",
        str(overlay_image),
        "-stream_loop",
        "-1",
        "-i",
        str(audio_loop),
        "-filter_complex",
        filter_complex,
        "-map",
        "[v]",
        "-map",
        "[a]",
        "-r",
        str(fps),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        "-movflags",
        "+faststart",
    ]
    if max_bitrate:
        cmd.extend(["-b:v", max_bitrate])
    cmd.append(str(output_path))

    try:
        subprocess.check_call(cmd)
    except FileNotFoundError as exc:
        raise ComposerError("ffmpeg not available in PATH") from exc
    except subprocess.CalledProcessError as exc:
        raise ComposerError(f"ffmpeg failed: {exc}") from exc


__all__ = ["compose_video", "render_overlay_image", "OverlayTexts", "ComposerError"]
