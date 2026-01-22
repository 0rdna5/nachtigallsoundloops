const videoAssets = [
  { id: "type1", name: "Type 1 – Clean Highlight", duration: "15s" },
  { id: "type2", name: "Type 2 – Urban Motion", duration: "20s" },
  { id: "type3", name: "Type 3 – Soft Gradient", duration: "12s" },
  { id: "type4", name: "Type 4 – Split Screen", duration: "18s" },
  { id: "type5", name: "Type 5 – Event Focus", duration: "30s" },
  { id: "type6", name: "Type 6 – Story Beats", duration: "25s" }
];

const contentTypes = [
  {
    id: "type1",
    name: "Der Lustige",
    label: "Klassische Gstanzl, Witze",
    mood: "Gesellig, laut, Stammtisch-Vibe.",
    palette: "Tannengrün & Goldgelb",
    background: "Unscharfer Heurigen-Innenraum, volle Gläser.",
    mimic: "Herzhaftes Lachen, fingerzeigend („Du verstehst mi!“).",
    thumbnailExamples: ["SO A DEPP!", "TRINK MA NO?", "FRAUEN & WEIN"],
    seoKeywords: ["Gstanzl", "Witze", "Heuriger", "Stammtisch", "österreichischer Schmäh"]
  },
  {
    id: "type2",
    name: "Der Ernste",
    label: "Balladen, Nachdenkliches",
    mood: "Melancholisch, tiefgründig, respektvoll.",
    palette: "Dunkles Weinrot oder Dunkelblau",
    background: "Abenddämmerung, Burgenland-Landschaft, Kerze.",
    mimic: "Ruhiger Blick, kein Lächeln.",
    thumbnailExamples: ["Für Annemarie", "Heimat im Herzen", "Abschied"],
    seoKeywords: ["Ballade", "Heimat", "Burgenland", "Tradition", "österreichische Musik"]
  },
  {
    id: "type3",
    name: "Der Makabere",
    label: "Schwarzer Humor, Tod, Erbe",
    mood: "Trocken, böse, Wiener Schmäh.",
    palette: "Schiefergrau, entsättigte Farben",
    background: "Friedhofsmauer, Nebel, alte Holzhütte.",
    mimic: "Pokerface, starrer Blick.",
    thumbnailExamples: ["ERBE SICHERN", "SCHADENFREUDE", "LEIDER NEIN"],
    seoKeywords: ["schwarzer Humor", "Wiener Schmäh", "makaber", "Erbe", "Satire"]
  },
  {
    id: "type4",
    name: "Der geplagte Ehemann",
    label: "Beziehungsprobleme",
    mood: "Genervt, resigniert, solidarisch.",
    palette: "Sepia & Warmweiß mit Signalrot",
    background: "Küchentisch, Wohnzimmer, Silhouette im Hintergrund.",
    mimic: "Augen verdrehen, Hand an der Stirn.",
    thumbnailExamples: ["SCHON WIEDER!", "SIE REDET NOCH...", "JA SCHATZ..."],
    seoKeywords: ["Ehemann", "Beziehungsalltag", "Stammtisch", "Humor 50+", "österreich"]
  },
  {
    id: "type5",
    name: "Der Sarkastische",
    label: "Gesellschaftskritik, Ironie",
    mood: "Überlegen, wissend, spitzzüngig.",
    palette: "Neutral, Steinwand-Look",
    background: "Schlichte Wand, Fokus auf Gesicht.",
    mimic: "Schiefes Grinsen, skeptischer Blick.",
    thumbnailExamples: ["ECHT JETZT?", "GLAUBST DU DAS?", "ALLES LÜGE?"],
    seoKeywords: ["Sarkasmus", "Gesellschaftskritik", "Ironie", "Österreich", "Wien"]
  },
  {
    id: "type6",
    name: "Der Fromme",
    label: "Kirche, Weihnachten, Tradition",
    mood: "Warm, glänzend, friedlich.",
    palette: "Goldtöne & Dunkelbraun",
    background: "Kirchenfenster, Kerzenschein, Weihnachtsbaum.",
    mimic: "Gütiges Lächeln, gefaltete Hände.",
    thumbnailExamples: ["Stille Nacht", "Gesegnetes Fest", "Dankbarkeit"],
    seoKeywords: ["Kirche", "Weihnachten", "Tradition", "christlich", "österreich"]
  }
];

const audioAssets = [
  { id: "loop1", name: "Schnaderhuepfl", mood: "gesellig" },
  { id: "loop1b", name: "Schnaderhuepfl (Type 5)", mood: "gesellig" },
  { id: "loop2", name: "STritschiwutscherl", mood: "klassisch" },
  { id: "loop3", name: "Trink ma no a Flascherl hook", mood: "heuriger vibe" },
  { id: "loop4", name: "Andauer Weinlied (fröhlich)", mood: "gemütlich" },
  { id: "loop5", name: "Und da Ochs hot glocht", mood: "volksnah" },
  { id: "loop6", name: "Heit is mei Oidi gstorm", mood: "ballade" },
  { id: "loop6b", name: "Heit is mei Oidi gstorm (Type 6)", mood: "ballade" }
];

const outputConfigs = [
  { key: "overlay", label: "Text-Overlay" },
  { key: "youtubeTitle", label: "YouTube Titel" },
  { key: "youtubeDescription", label: "YouTube Beschreibung" },
  { key: "youtubeTags", label: "YouTube Tags" },
  { key: "instagramCaption", label: "Instagram Caption" },
  { key: "pinnedComment", label: "Pinned Kommentar" },
  { key: "thumbnailText", label: "Thumbnail Text" }
];

const state = {
  selectedContentType: contentTypes[0],
  selectedVideo: videoAssets[0],
  selectedAudio: audioAssets[0],
  selectedOccasion: null,
  occasions: []
};

const contentTypeList = document.getElementById("contentTypeList");
const videoAssetList = document.getElementById("videoAssetList");
const audioAssetList = document.getElementById("audioAssetList");
const occasionList = document.getElementById("occasionList");
const outputs = document.getElementById("outputs");
const generateButton = document.getElementById("generateButton");
const regenerateVideoButton = document.getElementById("regenerateVideo");
const referenceDate = document.getElementById("referenceDate");
const downloadVideoButton = document.getElementById("downloadVideo");
const downloadHint = document.getElementById("downloadHint");
const previewCanvas = document.getElementById("previewCanvas");
const tabInput = document.getElementById("tabInput");
const tabOutput = document.getElementById("tabOutput");
const inputTab = document.getElementById("inputTab");
const outputTab = document.getElementById("outputTab");

const today = new Date();
referenceDate.value = today.toISOString().split("T")[0];

const buildAssetCards = (list, items, selectedKey, onSelect) => {
  list.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "asset-card";
    if (item.id === selectedKey) {
      card.classList.add("active");
    }
    card.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.duration || item.mood}</span>
      </div>
      <span>Auswählen</span>
    `;
    card.addEventListener("click", () => onSelect(item));
    list.appendChild(card);
  });
};

const buildContentCards = () => {
  contentTypeList.innerHTML = "";
  contentTypes.forEach((type) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "content-card";
    if (type.id === state.selectedContentType.id) {
      card.classList.add("active");
    }
    card.innerHTML = `
      <header>
        <div>
          <strong>${type.name}</strong>
          <span class="helper">${type.label}</span>
        </div>
        <span class="tag">${type.palette}</span>
      </header>
      <ul>
        <li><strong>Stimmung:</strong> ${type.mood}</li>
        <li><strong>Hintergrund:</strong> ${type.background}</li>
        <li><strong>Mimik:</strong> ${type.mimic}</li>
      </ul>
      <div class="thumbnail-examples">
        ${type.thumbnailExamples.map((example) => `<span>${example}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => {
      state.selectedContentType = type;
      buildContentCards();
      handleGenerate();
    });
    contentTypeList.appendChild(card);
  });
};

const normalizeDateKey = (date) => {
  const [year, month, day] = date.split("-");
  return `${month}-${day}`;
};

const filterOccasions = (dateKey) => {
  const result = state.occasions.map((occasion) => {
    const isToday = occasion.date === dateKey;
    const upcoming = isUpcoming(dateKey, occasion.date);
    return { ...occasion, isToday, upcoming };
  });
  return result;
};

const isUpcoming = (baseDate, occasionDate) => {
  const [baseMonth, baseDay] = baseDate.split("-").map(Number);
  const [occMonth, occDay] = occasionDate.split("-").map(Number);
  const base = new Date(2024, baseMonth - 1, baseDay);
  const occ = new Date(2024, occMonth - 1, occDay);
  const diff = (occ - base) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
};

const renderOccasions = () => {
  const selectedDate = referenceDate.value;
  const dateKey = normalizeDateKey(selectedDate);
  const list = filterOccasions(dateKey);
  occasionList.innerHTML = "";

  list.forEach((occasion) => {
    const item = document.createElement("div");
    item.className = "occasion-item";
    if (state.selectedOccasion?.date === occasion.date) {
      item.classList.add("active");
    }
    const marker = occasion.isToday
      ? "Heute"
      : occasion.upcoming
        ? "In den nächsten 7 Tagen"
        : "";
    item.innerHTML = `
      <div>
        <strong>${occasion.name}</strong>
        <div class="helper">${occasion.date}${marker ? ` • ${marker}` : ""}</div>
      </div>
      <button type="button">Auswählen</button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      state.selectedOccasion = occasion;
      renderOccasions();
      drawPreview();
    });
    occasionList.appendChild(item);
  });
};

const slugifyTag = (value) => value.replace(/[^\p{L}\p{N}]+/gu, "");

const generateTextPackage = () => {
  const occasion = state.selectedOccasion?.name || "dein nächster Anlass";
  const dateKey = state.selectedOccasion?.date || normalizeDateKey(referenceDate.value);
  const contentType = state.selectedContentType;
  const audienceLine = "Für Männer 50+ aus Österreich – direkt, ehrlich und mit Schmäh.";
  const seoKeywords = [occasion, ...contentType.seoKeywords, "Österreich", "Gstanzl"].join(", ");

  const copyByType = {
    type1: {
      overlay: [
        `Stammtisch-Schmäh zu ${occasion} – da lacht da ganze Tisch!`,
        `Gstanzl & Witze: ${occasion} auf gutem Wiener Schmäh.`,
        `Laut, ehrlich, leiwand: ${occasion} mit Humor.`
      ],
      title: [
        `${occasion} | Gstanzl & Witze für den Stammtisch (Österreich)`,
        `Wiener Schmäh zu ${occasion} – lustige Gstanzl für Männer 50+`,
        `${occasion} mit Humor: Heurigen-Witz & Schmäh`
      ],
      description: [
        `Ein geselliger Schmäh zu ${occasion}, mit Gstanzl, Witz und Heurigen-Flair. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Stammtisch-Vibe pur: ${occasion} als kurzer, knackiger Schmäh. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} mit a bisserl Schmäh. 🍻\nWas war dein bester Witz dazu?\n\n#${slugifyTag(occasion)} #heuriger #gstanzl #österreich`,
        `Lachen erlaubt: ${occasion} im Stammtisch-Ton. Schreib uns deinen Spruch!`
      ],
      pinned: [
        `Was war dein bester Wirtshaus-Schmäh zu ${occasion}?`,
        `Welcher Satz passt zu ${occasion} am Stammtisch?`
      ],
      thumbnail: contentType.thumbnailExamples
    },
    type2: {
      overlay: [
        `Eine leise Ballade zu ${occasion}.`,
        `Heimat im Herzen: ${occasion} in stillen Worten.`,
        `${occasion} – nachdenklich und ehrlich.`
      ],
      title: [
        `${occasion} – Ballade & Heimatgefühl (Österreich)`,
        `Nachdenklich zu ${occasion} | Musik & Worte aus Österreich`,
        `Heimat im Herzen: ${occasion} als stille Ballade`
      ],
      description: [
        `Ein ruhiger, respektvoller Blick auf ${occasion}. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Melancholische Stimmung und ehrliche Worte zu ${occasion}. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} in leisen Zeilen. 🌙\nWelche Erinnerung verbindest du damit?\n\n#${slugifyTag(occasion)} #heimat #österreich`,
        `Ruhige Töne zu ${occasion}. Schreib deine Gedanken darunter.`
      ],
      pinned: [
        `Welche Erinnerung zu ${occasion} trägst du im Herzen?`,
        `Was bedeutet ${occasion} für dich persönlich?`
      ],
      thumbnail: contentType.thumbnailExamples
    },
    type3: {
      overlay: [
        `${occasion} – schwarzer Humor mit Wiener Schmäh.`,
        `Makaber, trocken, ehrlich: ${occasion}.`,
        `Wiener Schmäh trifft ${occasion}.`
      ],
      title: [
        `${occasion} | Schwarzer Humor mit Wiener Schmäh`,
        `Makaber & direkt: ${occasion} aus Österreich`,
        `Schadenfreude? ${occasion} mit trockenem Schmäh`
      ],
      description: [
        `Schwarzer Humor, trocken serviert: ${occasion} mit Wiener Schmäh. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Makaber und pointiert: ${occasion} als kurze Satire aus Österreich. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} mit schwarzem Humor. 😈\nVerstehst den Schmäh?\n\n#${slugifyTag(occasion)} #wienerschmäh #satire`,
        `Trocken, böse, ehrlich: ${occasion} im Wiener Ton.`
      ],
      pinned: [
        `Darf man darüber lachen? Schreib dein Urteil zu ${occasion}.`,
        `Welcher schwarze Schmäh passt zu ${occasion}?`
      ],
      thumbnail: contentType.thumbnailExamples
    },
    type4: {
      overlay: [
        `${occasion} – und daheim redt sie wieder.`,
        `Ehemann-Schmäh zu ${occasion}: Ja Schatz...`,
        `${occasion} aus Sicht vom geplagten Mann.`
      ],
      title: [
        `${occasion} | Beziehungs-Schmäh für Männer 50+`,
        `Ja Schatz... ${occasion} im Ehemann-Style (Österreich)`,
        `Beziehungsalltag & Schmäh: ${occasion}`
      ],
      description: [
        `Genervt, aber mit Humor: ${occasion} aus Sicht vom geplagten Ehemann. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Ein solidarischer Blick auf den Beziehungsalltag: ${occasion} mit Augenzwinkern. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} – und daheim is wieder Theater. 😅\nWer kennt's?\n\n#${slugifyTag(occasion)} #ehemann #beziehung`,
        `Ehemann-Schmäh zu ${occasion}. Männer 50+ fühlen mit.`
      ],
      pinned: [
        `Welche „Ja Schatz“-Situation passt zu ${occasion}?`,
        `Erzähl deinen besten Ehemann-Schmäh zu ${occasion}.`
      ],
      thumbnail: contentType.thumbnailExamples
    },
    type5: {
      overlay: [
        `${occasion} – echt jetzt?`,
        `Ironischer Blick auf ${occasion}.`,
        `${occasion} mit scharfem Kommentar.`
      ],
      title: [
        `${occasion} | Sarkasmus & Gesellschaftskritik aus Österreich`,
        `Echt jetzt? ${occasion} ironisch kommentiert`,
        `${occasion} – kritisch, pointiert, österreichisch`
      ],
      description: [
        `Sarkastisch, wissend und pointiert: ${occasion} mit gesellschaftlichem Unterton. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Ironie mit Schmäh: ${occasion} kritisch auf den Punkt gebracht. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} – glaubst du das? 🤨\nDeine Meinung zählt.\n\n#${slugifyTag(occasion)} #sarkasmus #kritik`,
        `Sarkastischer Blick auf ${occasion}. Schreib deinen Kommentar.`
      ],
      pinned: [
        `Welcher sarkastische Satz passt zu ${occasion}?`,
        `Was ist dein kritischster Gedanke zu ${occasion}?`
      ],
      thumbnail: contentType.thumbnailExamples
    },
    type6: {
      overlay: [
        `${occasion} – mit Dankbarkeit im Herzen.`,
        `Tradition & Frieden zu ${occasion}.`,
        `Gesegnete Worte zu ${occasion}.`
      ],
      title: [
        `${occasion} | Tradition, Glaube & Dankbarkeit (Österreich)`,
        `Gesegnete Worte zu ${occasion} – ruhig & herzlich`,
        `${occasion} in christlicher Tradition`
      ],
      description: [
        `Warme, friedliche Worte zu ${occasion}. ${audienceLine}\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}\n🔎 Keywords: ${seoKeywords}`,
        `Tradition und Dankbarkeit: ${occasion} mit ruhigem Ton. ${audienceLine}\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}\nKeywords: ${seoKeywords}`
      ],
      instagram: [
        `${occasion} mit Dankbarkeit und Frieden. ✨\nEin gesegnetes Fest!\n\n#${slugifyTag(occasion)} #tradition #kirche`,
        `Ruhige Worte zu ${occasion}. Teilen & weitergeben.`
      ],
      pinned: [
        `Wofür bist du rund um ${occasion} dankbar?`,
        `Welche Tradition zu ${occasion} ist dir wichtig?`
      ],
      thumbnail: contentType.thumbnailExamples
    }
  };

  const variants = copyByType[contentType.id];
  const tagVariants = [
    `#${slugifyTag(occasion)} #österreich #austria #shorts #nachtigall`,
    `#${slugifyTag(occasion)} #reels #heimat #wienerschmäh #österreich`
  ];

  return {
    overlay: pickRandom(variants.overlay),
    youtubeTitle: pickRandom(variants.title),
    youtubeDescription: pickRandom(variants.description),
    youtubeTags: pickRandom(tagVariants),
    instagramCaption: pickRandom(variants.instagram),
    pinnedComment: pickRandom(variants.pinned),
    thumbnailText: pickRandom(variants.thumbnail)
  };
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const renderOutputs = (texts) => {
  outputs.innerHTML = "";

  outputConfigs.forEach((config) => {
    const card = document.createElement("div");
    card.className = "output-card";
    const value = texts[config.key];
    card.innerHTML = `
      <header>
        <h3>${config.label}</h3>
        <div class="output-actions">
          <button type="button" data-action="copy">Kopieren</button>
          <button type="button" data-action="edit">Bearbeiten</button>
          <button type="button" data-action="regen">Neu generieren</button>
        </div>
      </header>
      <textarea readonly>${value}</textarea>
    `;
    const textarea = card.querySelector("textarea");
    const [copyButton, editButton, regenButton] = card.querySelectorAll("button");

    copyButton.addEventListener("click", async () => {
      await navigator.clipboard.writeText(textarea.value);
      copyButton.textContent = "Kopiert";
      setTimeout(() => {
        copyButton.textContent = "Kopieren";
      }, 1200);
    });

    editButton.addEventListener("click", () => {
      const isReadonly = textarea.hasAttribute("readonly");
      if (isReadonly) {
        textarea.removeAttribute("readonly");
        textarea.focus();
        editButton.textContent = "Fertig";
      } else {
        textarea.setAttribute("readonly", "readonly");
        editButton.textContent = "Bearbeiten";
      }
    });

    regenButton.addEventListener("click", () => {
      const updatedTexts = generateTextPackage();
      textarea.value = updatedTexts[config.key];
      drawPreview(updatedTexts);
    });

    outputs.appendChild(card);
  });
};

const drawPreview = (texts = null) => {
  const ctx = previewCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 540, 960);
  gradient.addColorStop(0, "#3b5bff");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  ctx.fillRect(40, 60, 460, 140);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText("Nachtigall Studio", 60, 110);

  ctx.font = "18px Inter, sans-serif";
  ctx.fillText(`Template: ${state.selectedVideo.name}`, 60, 150);
  ctx.fillText(`Audio: ${state.selectedAudio.name}`, 60, 175);
  ctx.fillText(`Content-Typ: ${state.selectedContentType.name}`, 60, 200);

  const overlayText = texts?.overlay || generateTextPackage().overlay;
  wrapText(ctx, overlayText, 60, 280, 420, 28);

  if (state.selectedOccasion) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(40, 760, 460, 140);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillText(state.selectedOccasion.name, 60, 810);
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText(`Anlass: ${state.selectedOccasion.date}`, 60, 840);
  }
};

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, y);
};

const handleGenerate = () => {
  const texts = generateTextPackage();
  renderOutputs(texts);
  drawPreview(texts);
  setActiveTab("output");
};

const setupDownload = () => {
  if (!window.MediaRecorder) {
    downloadHint.textContent = "MediaRecorder wird in diesem Browser nicht unterstützt.";
    downloadVideoButton.disabled = true;
    return;
  }

  downloadVideoButton.addEventListener("click", async () => {
    downloadVideoButton.disabled = true;
    downloadVideoButton.textContent = "Video wird erstellt…";

    const stream = previewCanvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nachtigall-video.webm";
      link.click();
      URL.revokeObjectURL(url);
      downloadVideoButton.disabled = false;
      downloadVideoButton.textContent = "Video herunterladen";
    });

    recorder.start();
    drawPreview();

    setTimeout(() => {
      recorder.stop();
    }, 3000);
  });
};

const selectVideo = (item) => {
  state.selectedVideo = item;
  buildAssetCards(videoAssetList, videoAssets, item.id, selectVideo);
  drawPreview();
};

const selectAudio = (item) => {
  state.selectedAudio = item;
  buildAssetCards(audioAssetList, audioAssets, item.id, selectAudio);
  drawPreview();
};

const init = async () => {
  const response = await fetch("data/occasions_at.json");
  const data = await response.json();
  state.occasions = data.occasions;
  state.selectedOccasion = state.occasions[0];

  buildContentCards();
  buildAssetCards(videoAssetList, videoAssets, state.selectedVideo.id, selectVideo);

  buildAssetCards(audioAssetList, audioAssets, state.selectedAudio.id, selectAudio);

  renderOccasions();
  handleGenerate();
  setupDownload();
};

referenceDate.addEventListener("change", renderOccasions);
generateButton.addEventListener("click", handleGenerate);
regenerateVideoButton.addEventListener("click", handleGenerate);
tabInput.addEventListener("click", () => setActiveTab("input"));
tabOutput.addEventListener("click", () => setActiveTab("output"));

init();
