from pathlib import Path

import pytest

from nachtigall_generator.composer import compose_video
from nachtigall_generator.selector import AssetNotFound


def test_compose_fails_when_assets_missing(tmp_path: Path):
    with pytest.raises(AssetNotFound):
        compose_video(
            template_video=tmp_path / "missing.mp4",
            audio_loop=tmp_path / "missing.mp3",
            overlay_image=tmp_path / "missing.png",
            output_path=tmp_path / "out.mp4",
        )
