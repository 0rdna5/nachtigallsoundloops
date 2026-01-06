from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Optional

try:
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from google.oauth2.service_account import Credentials
except Exception:  # pragma: no cover - optional dependency
    build = None
    MediaFileUpload = None
    Credentials = None


class YouTubeUploader:
    def __init__(self, credentials_file: Optional[Path] = None, category_id: Optional[str] = None):
        self.credentials_file = credentials_file or Path("youtube_credentials.json")
        self.category_id = category_id

    def is_enabled(self) -> bool:
        return bool(os.getenv("YOUTUBE_UPLOAD") == "1" and self.credentials_file.exists())

    def upload(self, video_path: Path, metadata: dict) -> Optional[str]:
        if not self.is_enabled():
            return None
        if build is None or MediaFileUpload is None or Credentials is None:
            raise RuntimeError("google-api-python-client not installed; install with 'pip install .[youtube]'")

        credentials = Credentials.from_service_account_file(
            str(self.credentials_file), scopes=["https://www.googleapis.com/auth/youtube.upload"]
        )
        youtube = build("youtube", "v3", credentials=credentials)
        body = {
            "snippet": {
                "title": metadata.get("title"),
                "description": metadata.get("description"),
                "tags": metadata.get("tags", []),
                "categoryId": self.category_id or "22",
            },
            "status": {"privacyStatus": "private"},
        }
        media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True)
        request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)
        response = request.execute()
        return response.get("id")


__all__ = ["YouTubeUploader"]
