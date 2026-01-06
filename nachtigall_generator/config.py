from pathlib import Path
from typing import Dict, List, Optional

try:  # pragma: no cover
    import yaml
except ImportError as exc:  # pragma: no cover
    yaml = None
    _yaml_error = exc

from ._compat import BaseModel, BaseSettings, Field

from .types import ContentType


class StyleConfig(BaseModel):
    name: str
    colors: Dict[str, str]
    font: str
    font_size: int
    outline: Dict[str, int | str]
    safe_margin: int = 120
    video: Dict[str, float | bool]


class AppSettings(BaseSettings):
    assets_dir: Path = Path("assets")
    config_dir: Path = Path("config")
    output_dir: Path = Path("out")
    styles_file: str = "styles.yaml"
    occasions_file: str = "occasions_at.json"
    trend_mode: bool = False
    youtube_upload: bool = False
    youtube_category_id: str | None = None
    type_rotation: List[ContentType] = Field(default_factory=lambda: list(ContentType))

    model_config = {
        "env_prefix": "NACHTIGALL_",
        "case_sensitive": False,
        "extra": "ignore",
    }

    def load_styles(self) -> Dict[ContentType, StyleConfig]:
        if yaml is None:
            raise RuntimeError(f"pyyaml missing: {_yaml_error}")
        styles_path = self.config_dir / self.styles_file
        with styles_path.open("r", encoding="utf-8") as handle:
            raw = yaml.safe_load(handle)
        mapped: Dict[ContentType, StyleConfig] = {}
        for key, value in raw.items():
            ct = ContentType.from_key(key)
            mapped[ct] = StyleConfig(**value)
        return mapped


class TrendSourceConfig(BaseModel):
    enabled: bool = False
    keywords: Optional[List[str]] = None
    source_name: str = "manual"


class Occasion(BaseModel):
    date: str
    name: str


class OccasionCalendar(BaseModel):
    seasons: Dict[str, List[str]]
    occasions: List[Occasion]


__all__ = ["AppSettings", "StyleConfig", "Occasion", "OccasionCalendar", "TrendSourceConfig"]
