from __future__ import annotations

import json
import random
from datetime import date
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from .config import Occasion, OccasionCalendar
from .types import ContentType

Overlay = Dict[str, str]


def _load_calendar(path: Path) -> OccasionCalendar:
    with path.open("r", encoding="utf-8") as handle:
        raw = json.load(handle)
    occasions = [Occasion(**item) if not isinstance(item, Occasion) else item for item in raw.get("occasions", [])]
    return OccasionCalendar(seasons=raw.get("seasons", {}), occasions=occasions)


def _select_for_date(entries: List[str], rng: random.Random) -> str:
    return entries[rng.randrange(0, len(entries))]


def _find_occasion(calendar: OccasionCalendar, target: date) -> Optional[str]:
    marker = target.strftime("%m-%d")
    for occasion in calendar.occasions:
        if occasion.date == marker:
            return occasion.name
    for season, months in calendar.seasons.items():
        if marker in months:
            return season
    return None


def _combine(base: str, occasion: Optional[str]) -> str:
    if occasion:
        return f"{base} – {occasion}"
    return base


def _templates() -> Dict[ContentType, List[Tuple[str, str]]]:
    return {
        ContentType.TYPE1: [
            ("So a Depp!", "Trink ma no oans."),
            ("Gstanzl aus'm Heurigen", "Lachfalten gratis."),
            ("G'schichtl ausm Wirtshaus", "Nix für Spaßbremsen."),
            ("Grantig?", "Naa, nur durstig."),
            ("Der Witz is so alt", "wia da Knödel in da Suppe."),
            ("Komm herst", "setz di her, Prost!"),
            ("Schmäh g'führt", "und alle lachen."),
            ("Guade Laune", "mit ordentlich Schmäh."),
            ("Oide Wuchteln", "immer no guad."),
            ("Laut und g'miatlich", "wia beim Heurigen."),
            ("Schunkel ma", "wia am Kirtag."),
            ("Schankg'schicht", "mit g'schem G'fühl."),
            ("Lachsalve", "aus Ottakring."),
            ("De Leit raunzn", "i schenk no aus."),
            ("Ein Schmäh pro Achterl", "deal?"),
            ("Mehr Witz als Würstel", "und des sogt wos."),
            ("Gstanzl im Blut", "Viertel im Glas."),
            ("Brutaler Schmäh", "aber mit Herz."),
            ("G'sundheits-Schluck", "für die Lachmuskeln."),
            ("Nix für Nobelhütten", "dafür echt."),
            ("Tannengrün & Gold", "Heurigen-Charme pur."),
            ("Die Zither schweigt", "ich ned."),
            ("Grantl?", "Nur bis zum ersten Schluck."),
            ("Sauklarer Schmäh", "wie ein Spritzer."),
            ("Gmiatlich laut", "wia a Kellner um Mitternacht."),
            ("Wirtshaus-Philosophie", "mit ordentlich Pfeffer."),
            ("Die Stammtisch-Wahrheit", "immer grad aus."),
            ("Lieb Gott steh uns bei", "der Witz kimmt grob."),
            ("Fetziges Gstanzl", "damit's kracht."),
            ("Kellner ruft", "Spaß kimmt."),
            ("Heurigen-Hit", "ohne Playlist.")
        ],
        ContentType.TYPE2: [
            ("Ruhe im Heurigen", "und a Glasl Trost."),
            ("Ballade aus Wien", "leise aber ehrlich."),
            ("Der Grant wird sanft", "wenn's dunkel wird."),
            ("Dämmerungs-Gedanke", "zwischen zwei Glockenschlägen."),
            ("Weinrot im Glas", "Dunkelblau im Hirn."),
            ("Ein tiefer Zug", "für die stillen Stunden."),
            ("Leiwand leise", "wia Schneefall im Prater."),
            ("Des Herz is schwer", "aber warm."),
            ("Gfrei di", "auf a ruhige Minute."),
            ("Griass di Nacht", "i red heit ned vü."),
            ("Aufrecht bleiben", "wenn's im Leben zieht."),
            ("Alt werd ma", "aber gscheiter."),
            ("Stille Gstanzl", "für große Gspür."),
            ("Dunkelblaues Wien", "mit Creme-Tupfen."),
            ("Sakko zu, Herz offen", "so samma."),
            ("Wenn's leise wird", "hörst die Wahrheit."),
            ("Balladen-Grant", "für Erwachsene."),
            ("Respekt vor der Nacht", "und vor dir."),
            ("Glocken läuten", "i hör zu."),
            ("Bisserl Gänsehaut", "bisserl Wärme."),
            ("Manchmal braucht's nur", "a ruhige Stimm."),
            ("Weinrot & Dunkelblau", "Passt zu uns."),
            ("Heurigenbank", "ohne Lärm."),
            ("Ruah & Respekt", "so geht's."),
            ("Nur a Lichtl", "im Dunkel."),
            ("G'schichten ausm Leben", "ohne Schnickschnack."),
            ("Zua, aber ned zua", "mia san da."),
            ("Leise Lieder", "für laute Gedanken."),
            ("Nachtigall fliegt", "nur für di."),
            ("Ein Schluck Hoffnung", "und weiter geht's."),
            ("Grantfrei", "für a paar Minuten.")
        ],
        ContentType.TYPE3: [
            ("Schiefergrau im Kopf", "Humor schwarz wie a Kaffee."),
            ("Pokerface", "aber innerlich kichern."),
            ("Die Ruh am Friedhof", "nur kurz gestört."),
            ("Marmor, Stein", "und Schmäh."),
            ("Nebelsuppe", "mit bissigem Nachgeschmack."),
            ("Galgenhumor", "aber stilvoll."),
            ("Schwarzer Kaffee", "schwarzer Schmäh."),
            ("Nebelwand", "und a Witz spuckt durch."),
            ("Kalter Stein", "heißer Kommentar."),
            ("Grabesruhe", "bis i red."),
            ("Friedhofsmauer", "mein Publikum."),
            ("Schief schauen", "grade pointiert."),
            ("Skurril?", "Fix ned, nur ehrlich."),
            ("Sarkasmus?", "Eher schwarz-braun."),
            ("Wiener Walzer", "auf der Kante."),
            ("Rauch im Nebel", "Stimme ganz klar."),
            ("Kalt lächeln", "warm treffen."),
            ("Die Ruh is um", "wenn i komm."),
            ("Leichenblass", "aber lebendig."),
            ("Stille Gassen", "mit bissl Gift."),
            ("Schiefergrau & Nebel", "passt zu mir."),
            ("Morbid gschmeidig", "wia ein Spritzer ohne Wasser."),
            ("Finster schauen", "freundlich treffen."),
            ("Im Schatten", "lacht ma anders."),
            ("Memento Schmäh", "wienerisch trocken."),
            ("Zynisch?", "Nur ehrlich."),
            ("Schmäh aus der Gruft", "mit Stil."),
            ("Geistreich", "im wahrsten Sinn."),
            ("Nebel, Bier und bissl Gift", "fertig."),
            ("Schwarz genug?", "Sicher."),
            ("Humor wie Schiefer", "schneidet tief.")
        ],
        ContentType.TYPE4: [
            ("Ja Schatz…", "i hob eh g'sagt."),
            ("I hör eh zua", "nur ned heit."),
            ("Wieder a Zettl", "auf der Kühlschranktür."),
            ("Kochlöffel-Krieg", "i halt durch."),
            ("Heut schon gestaubsaugt?", "Frag die Staubmäuse."),
            ("Wohnzimmer-Schlacht", "mit Humor."),
            ("Sackerl raus?", "Jo eh."),
            ("Genervt?", "Normalzustand."),
            ("Fernbedienung weg", "ich aa."),
            ("Kinder laut", "Nerven dünn."),
            ("Hobby: Auge verdrehen", "Cardio: Diskussion."),
            ("Schatzliste", "wird länger."),
            ("Küche im Chaos", "Herz im Takt."),
            ("Sepia Alltag", "warmweißes G'sicht."),
            ("Heimkehrer", "mit Signalrot."),
            ("Erklär ma no amoi", "aber gschwind."),
            ("Frühstück?", "Nur wenn ruah is."),
            ("To-do Zettel", "wachsen wie a Wald."),
            ("Montag schon?", "i streik."),
            ("Einkaufsdrama", "vergess die Butter ned."),
            ("Staubsauger marsch", "i geh in Deckung."),
            ("Fernbedienung is sakrisch", "heilige Pflicht."),
            ("Grant meets Liebe", "im selben Wohnzimmer."),
            ("Ja, Schatz", "der Klassiker."),
            ("Bitte ned jetzt", "i brauch a Spritzer."),
            ("Rascheln vom Kuvert", "schon wieder Rechnung."),
            ("Alltag mit Humor", "anders geht ned."),
            ("Warmweißes Licht", "Signalrot im Hirn."),
            ("Bist narrisch?", "Nur verheiratet."),
            ("Nix als Liebe", "und bissl Wahnsinn."),
            ("Der Herd piepst", "ich aa."),
            ("Heut bin i brav", "morgen schau ma.")
        ],
        ContentType.TYPE5: [
            ("Echt jetzt?", "Des glaubt ja kaner."),
            ("Skeptischer Blick", "und no mehr Schmäh."),
            ("Na sicher ned", "oder doch?"),
            ("Wiener Sarkasmus", "trocken serviert."),
            ("Steinwand im Rücken", "Sprüche im Gepäck."),
            ("Gfällt ma ned", "aber passt."),
            ("Spitzzüngig", "mit Herz."),
            ("Neutraler Raum", "volle Meinung."),
            ("Da schaut ma", "was ois so geht."),
            ("Ironie-Level", "Kellerbar."),
            ("Jaja", "eh klar."),
            ("Widerspruch?", "Standard."),
            ("Sarkasmus zählt als Cardio", "weil Herz springt."),
            ("Augenbraue oben", "Geduld unten."),
            ("Gspürst den Unterton?", "Solltest."),
            ("Leiwand?", "Eh nur a bissl."),
            ("Lächeln?", "Vielleicht morgen."),
            ("Spruchreif", "seit Geburt."),
            ("Grantige Pointe", "kühl serviert."),
            ("Skepsis pur", "Steinwand-Edition."),
            ("Nix is fix", "außer mein Schmäh."),
            ("Jeder hat Recht", "i sowieso."),
            ("Wenn i nick", "meine ich nein."),
            ("Klartext", "ohne Zucker."),
            ("Trockener geht's ned", "wie der Wein von gestern."),
            ("Fades Thema", "scharfer Kommentar."),
            ("Na geh", "red ma Tacheles."),
            ("Schmäh mit Stachel", "vorsichtig angreifen."),
            ("Zweifel im Blick", "Spruch im Mund."),
            ("Perfekte Wand", "für spitze Worte."),
            ("Freundlich grantig", "typisch Wien.")
        ],
        ContentType.TYPE6: [
            ("A ruhiger Start ins neue Jahr", "Dankbarkeit."),
            ("Mehr brauchts ned", "heut scho gar ned."),
            ("Goldene Wärme", "für a kalte Welt."),
            ("Kerzenlicht", "und a tiefe Stimm."),
            ("Altaredition", "mit Schmäh."),
            ("Serif und Seele", "passt."),
            ("Kirchenbank", "Herz offen."),
            ("Weihrauch im Sinn", "Humor im Mund."),
            ("Tradition lebt", "in jedem Wort."),
            ("Kerzenflackern", "Geduld im Blick."),
            ("Adventgruß", "ohne Kitsch."),
            ("Dankbare Minuten", "für uns alle."),
            ("Glockenklang", "und a Zwinkern."),
            ("Mehr Ruhe", "weniger Blabla."),
            ("Herz und Humor", "gehen in die Messe."),
            ("Glaub ma", "des taugt dir."),
            ("Kerzenmeer", "und a Gspür."),
            ("Tradition trifft Schmäh", "göttlich."),
            ("Alt, aber gold", "so wie ma."),
            ("Vom Chor bis zum Wirt", "alles dabei."),
            ("Feiertagsschmäh", "mit Respekt."),
            ("Glaubenssatz", "aber wienerisch."),
            ("Segen und Schmäh", "hand in Hand."),
            ("Der Himmel schaut zu", "i auch."),
            ("Heilig?", "Sicher. Aber mit Schmäh."),
            ("Gold/Braun", "passt zum Kaffee."),
            ("Kirche/Kerzen", "wärmen uns."),
            ("Weihnachten", "ganze Jahr im Herzen."),
            ("Tradition lebt", "weil ma's leben."),
            ("Anstand zahlt", "Grant bleibt."),
            ("Ein Amen", "und a Schmäh."),
            ("Dankbarkeit", "heut und morgen.")
        ],
    }


def generate_overlay(
    content_type: ContentType,
    calendar_path: Path,
    target_date: date,
    trend_keywords: Optional[List[str]] = None,
    seed: Optional[int] = None,
) -> Overlay:
    calendar = _load_calendar(calendar_path)
    rng = random.Random(seed or (target_date.toordinal() + hash(content_type)))
    occasion = _find_occasion(calendar, target_date)

    templates = _templates()[content_type]
    top, bottom = templates[rng.randrange(0, len(templates))]
    overlay_top = _combine(top, occasion)
    overlay_bottom = _combine(bottom, occasion)

    hook_line = _select_for_date(
        [
            "Bleib nur hocken, es zahlt sich aus.",
            "Wart ab, des trifft dich.",
            "Heast, des kennst du!",
            "Triff ins Herz vom Stammtisch.",
            "Rasch anschauen, dann schimpfen.",
            "Dauert nur a Minütchen.",
        ],
        rng,
    )

    cta_line = _select_for_date(
        [
            "Abo dalassen, sonst verpasst da was.",
            "Teilst's mit deine Spezi.",
            "Kommentar da lassen, i wart.",
            "Klick auf Folgen, dann samma quitt.",
            "Schick's wem, der's hören muss.",
        ],
        rng,
    )

    comment_trigger = _select_for_date(
        [
            "Stimmt oder stimmt?",
            "Wer kennt's?",
            "Na, bist du dabei?",
            "Hast auch so gschaut?",
            "Wen musst du markieren?",
        ],
        rng,
    )

    pin_comment = _select_for_date(
        [
            "Grant teilen macht leichter.",
            "Heurigenweisheit des Tages.",
            "Servas aus der Wachau.",
            "Wiener Schmäh heilt alles.",
            "Ned alles so ernst nehmen.",
        ],
        rng,
    )

    hashtags = _build_hashtags(content_type, occasion, trend_keywords)

    return {
        "overlay_top": overlay_top,
        "overlay_bottom": overlay_bottom,
        "hook_line": hook_line,
        "cta_line": cta_line,
        "comment_trigger": comment_trigger,
        "pin_comment": pin_comment,
        "hashtags": hashtags,
    }


def _build_hashtags(
    content_type: ContentType, occasion: Optional[str], trend_keywords: Optional[List[str]]
) -> List[str]:
    base = [
        "#zahnlosenachtigall",
        "#wienerschmäh",
        "#heuriger",
        "#austriaman",
    ]
    per_type = {
        ContentType.TYPE1: ["#gschnas", "#gstanzl", "#prost"],
        ContentType.TYPE2: ["#ballade", "#ruah", "#dämmerung"],
        ContentType.TYPE3: ["#schwarzerhumor", "#pokerface", "#nebel"],
        ContentType.TYPE4: ["#ehemann", "#alltag", "#sepia"],
        ContentType.TYPE5: ["#sarkasmus", "#steinwand", "#unterton"],
        ContentType.TYPE6: ["#fromm", "#kerzenschein", "#tradition"],
    }
    tags = base + per_type[content_type]
    if occasion:
        tags.append(f"#{occasion.lower().replace(' ', '')}")
    if trend_keywords:
        tags.extend(f"#{kw.lower()}" for kw in trend_keywords[:3])
    return tags


def default_trends(keywords: Optional[List[str]]) -> List[str]:
    if keywords:
        return keywords
    return []


__all__ = ["generate_overlay", "default_trends"]
