from pathlib import Path

from nachtigall_generator.uploader_youtube import YouTubeUploader


def test_is_enabled_prefers_flag_over_env(tmp_path, monkeypatch):
    creds = tmp_path / "youtube_credentials.json"
    creds.write_text("{}")

    uploader = YouTubeUploader(credentials_file=creds)

    # Without flag/env it's off.
    assert uploader.is_enabled() is False

    # Env alone enables it.
    monkeypatch.setenv("NACHTIGALL_YOUTUBE_UPLOAD", "1")
    assert uploader.is_enabled() is True

    # Explicit flag wins even if env is missing.
    monkeypatch.delenv("NACHTIGALL_YOUTUBE_UPLOAD", raising=False)
    assert uploader.is_enabled(allow=True) is True


def test_is_enabled_requires_credentials(tmp_path, monkeypatch):
    missing_creds = tmp_path / "no_creds.json"
    uploader = YouTubeUploader(credentials_file=missing_creds)
    monkeypatch.setenv("YOUTUBE_UPLOAD", "1")

    # Still disabled because file not present.
    assert uploader.is_enabled() is False
