from __future__ import annotations

try:  # pragma: no cover - prefer real pydantic
    from pydantic import BaseModel, Field
except ImportError:  # pragma: no cover - lightweight fallback
    class BaseModel:  # type: ignore
        def __init__(self, **data):
            for key, value in data.items():
                setattr(self, key, value)

        def model_dump(self):
            return self.__dict__

    def Field(default=None, default_factory=None):  # type: ignore
        if default_factory is not None:
            return default_factory()
        return default

try:  # pragma: no cover
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover - fallback
    class BaseSettings(BaseModel):
        model_config = {}

        def __init__(self, **data):
            super().__init__(**data)
