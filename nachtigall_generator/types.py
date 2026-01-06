from __future__ import annotations

import enum
from datetime import date
from typing import Iterable, List


class ContentType(str, enum.Enum):
    TYPE1 = "type1"
    TYPE2 = "type2"
    TYPE3 = "type3"
    TYPE4 = "type4"
    TYPE5 = "type5"
    TYPE6 = "type6"

    @classmethod
    def from_key(cls, key: str) -> "ContentType":
        normalized = key.lower()
        for member in cls:
            if member.value == normalized:
                return member
        raise ValueError(f"Unknown content type {key}")

    @classmethod
    def rotate_by_date(cls, types: Iterable["ContentType"], target_date: date) -> "ContentType":
        pool: List[ContentType] = list(types)
        if not pool:
            pool = list(cls)
        index = target_date.toordinal() % len(pool)
        return pool[index]

    def human_name(self) -> str:
        mapping = {
            ContentType.TYPE1: "Der Lustige",
            ContentType.TYPE2: "Der Ernste",
            ContentType.TYPE3: "Der Makabere",
            ContentType.TYPE4: "Der geplagte Ehemann",
            ContentType.TYPE5: "Der Sarkastische",
            ContentType.TYPE6: "Der Fromme",
        }
        return mapping[self]


__all__ = ["ContentType"]
