# Zahnlose Nachtigall – Daily Short Generator

Automatisierter Generator für tägliche Kurzvideos (9:16) inklusive Overlays, Soundloop, Metadaten und optionalem YouTube-Upload.

## Features
- Content-Typen 1–6 mit Style-Konfiguration in `config/styles.yaml`.
- Anlasskalender Österreich in `config/occasions_at.json` zur Textanreicherung.
- Asset-Auswahl: Video-Templates pro Typ, Audio-Loops global, Schrift.
- Overlay-Renderer mit Safe-Margins (≥120px), Outline und Farbthemen.
- ffmpeg-Pipeline: Scale/Crop auf 1080x1920, optional Vignette, Fade in/out (200ms), Audio-Loop, MP4 Export.
- Metadaten-Generator pro Plattform (YouTube, Instagram, TikTok) inkl. CTA, Hashtags, Kommentar-Trigger.
- Optionaler YouTube-Upload (offizielle API) via Feature Flag, IG/TT Upload nur Stub.
- CLI: `nachtigall generate --date YYYY-MM-DD --out out/`

## Projektstruktur
```
assets/
  video_templates/type1..type6/.gitkeep
  audio_loops/*.mp3
  fonts/.gitkeep
  brand/.gitkeep
config/
  occasions_at.json
  styles.yaml
nachtigall_generator/
  cli.py, composer.py, selector.py, textgen.py, metadata.py, uploader_youtube.py, types.py, config.py
out/
  YYYY-MM-DD/
    video.mp4
    metadata.json
```

## Setup
1. Python 3.11+ installieren.
2. Abhängigkeiten installieren (lokal oder in venv):
   ```bash
   pip install -e .
   # optional für YouTube-Upload
   pip install -e .[youtube]
   ```
3. ffmpeg/ffprobe in PATH verfügbar machen.
4. Assets in die jeweiligen Ordner legen (Templates 9:16 oder croppbar, Audio-Loops global, Fonts wie in `config/styles.yaml`).

### Environment
- `.env` (optional) für Einstellungen, Beispiel siehe `.env.example`.
- Relevante Variablen (Prefix `NACHTIGALL_`): `ASSETS_DIR`, `CONFIG_DIR`, `OUTPUT_DIR`, `TREND_MODE`, `YOUTUBE_UPLOAD`, `YOUTUBE_CATEGORY_ID`.
- YouTube Upload läuft, wenn **ein** der folgenden Flags gesetzt ist und `youtube_credentials.json` existiert:
  - CLI-Flag `--youtube-upload`
  - `NACHTIGALL_YOUTUBE_UPLOAD=1` (per ENV)
  - `YOUTUBE_UPLOAD=1` (Legacy ENV)

## Nutzung
Generiere das Paket für heute:
```bash
nachtigall generate
```

Beispieldatum und Ausgabepfad:
```bash
nachtigall generate --date 2024-12-24 --out out/
```

Trend-Begriffe einschalten:
```bash
nachtigall generate --trend --trend-keywords "heuriger,donau"
```

YouTube-Upload aktivieren (wenn `YOUTUBE_UPLOAD=1` und Credentials existieren):
```bash
nachtigall generate --youtube-upload
```

## Cron Beispiel (täglich 07:10 Europe/Vienna)
```
10 7 * * * cd /path/to/nachtigallsoundloops && /usr/bin/env NACHTIGALL_OUTPUT_DIR=/path/to/out \ 
    /usr/bin/python -m nachtigall_generator.cli generate --date $(date +\%F)
```

## Tests
```bash
pytest
```

## Hinweise
- IG/TikTok Uploads sind nicht automatisiert; Adapter-Stubs können ergänzt werden.
- Fehlende Assets führen zu klaren Fehlermeldungen (Exit-Code 1).
- Keine Secrets in Git hinterlegen. Credentials lokal als Datei oder per ENV pflegen.
