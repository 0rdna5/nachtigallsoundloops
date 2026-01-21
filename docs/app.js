const videoAssets = [
  { id: "type1", name: "Type 1 – Clean Highlight", duration: "15s" },
  { id: "type2", name: "Type 2 – Urban Motion", duration: "20s" },
  { id: "type3", name: "Type 3 – Soft Gradient", duration: "12s" },
  { id: "type4", name: "Type 4 – Split Screen", duration: "18s" },
  { id: "type5", name: "Type 5 – Event Focus", duration: "30s" },
  { id: "type6", name: "Type 6 – Story Beats", duration: "25s" }
];

const audioAssets = [
  { id: "loop1", name: "Soundloop Aurora", mood: "uplifting" },
  { id: "loop2", name: "Soundloop Vienna Nights", mood: "moody" },
  { id: "loop3", name: "Soundloop Alpine Rise", mood: "cinematic" },
  { id: "loop4", name: "Soundloop City Pulse", mood: "energetic" }
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

const defaultOccasions = [
  { date: "01-01", name: "Neujahr" },
  { date: "01-06", name: "Heilige Drei Könige" },
  { date: "03-31", name: "Ostern" },
  { date: "05-12", name: "Muttertag" },
  { date: "06-09", name: "Vatertag" },
  { date: "08-15", name: "Maria Himmelfahrt" },
  { date: "10-26", name: "Nationalfeiertag" },
  { date: "11-01", name: "Allerheiligen" },
  { date: "12-01", name: "Adventbeginn" },
  { date: "12-24", name: "Weihnachten" },
  { date: "12-31", name: "Silvester" }
];

const state = {
  selectedVideo: videoAssets[0],
  selectedAudio: audioAssets[0],
  selectedOccasion: null,
  occasions: []
};

const videoAssetList = document.getElementById("videoAssetList");
const audioAssetList = document.getElementById("audioAssetList");
const occasionList = document.getElementById("occasionList");
const outputs = document.getElementById("outputs");
const generateButton = document.getElementById("generateButton");
const referenceDate = document.getElementById("referenceDate");
const downloadVideoButton = document.getElementById("downloadVideo");
const downloadHint = document.getElementById("downloadHint");
const previewCanvas = document.getElementById("previewCanvas");
const summaryVideo = document.getElementById("summaryVideo");
const summaryAudio = document.getElementById("summaryAudio");
const summaryOccasion = document.getElementById("summaryOccasion");
const lastGenerated = document.getElementById("lastGenerated");
const generationStatus = document.getElementById("generationStatus");

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

const updateSummary = () => {
  summaryVideo.textContent = state.selectedVideo?.name ?? "–";
  summaryAudio.textContent = state.selectedAudio?.name ?? "–";
  summaryOccasion.textContent = state.selectedOccasion?.name ?? "–";
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
      updateSummary();
    });
    occasionList.appendChild(item);
  });
};

const generateTextPackage = () => {
  const occasion = state.selectedOccasion?.name || "dein nächster Anlass";
  const dateKey = state.selectedOccasion?.date || normalizeDateKey(referenceDate.value);
  const overlayVariants = [
    `Heute in Österreich: ${occasion} ✨`,
    `Bereit für ${occasion}? Jetzt reinschauen!`,
    `${occasion} – die Highlights im 30-Sekunden-Recap.`
  ];
  const titleVariants = [
    `${occasion} in 30 Sekunden | Schnell erklärt`,
    `Top-Highlights zu ${occasion} (AT)`,
    `${occasion}: 3 Dinge, die du heute wissen solltest`
  ];
  const descriptionVariants = [
    `Wir feiern ${occasion} mit schnellen Eindrücken, passenden Clips und dem passenden Soundloop.\n\n📌 Anlass: ${dateKey}\n🎬 Template: ${state.selectedVideo.name}\n🎧 Audio: ${state.selectedAudio.name}`,
    `Alles Wichtige zu ${occasion} in einem kurzen Video zusammengefasst. Ideal zum Teilen und Speichern.\n\nTemplate: ${state.selectedVideo.name}\nAudio: ${state.selectedAudio.name}`
  ];
  const tagVariants = [
    `#${occasion.replace(/\s+/g, "")} #österreich #shorts #nachtigall`,
    `#${occasion.replace(/\s+/g, "")} #austria #reels #shortvideo #trend`
  ];
  const instaVariants = [
    `Heute ist ${occasion}! 🎉\nWas verbindest du damit? Schreib's in die Kommentare.\n\n#${occasion.replace(/\s+/g, "")} #austria #reels`,
    `${occasion} steht vor der Tür – hier sind die besten Clips in 30 Sekunden. \nMarkiere jemanden, der das sehen muss!`
  ];
  const pinnedVariants = [
    `Welches Detail zu ${occasion} hat dich am meisten überrascht?`,
    `Schreib uns dein persönliches Highlight zu ${occasion} unten rein!`
  ];
  const thumbnailVariants = [
    `${occasion} Heute!`,
    `${occasion} Highlights`
  ];

  return {
    overlay: pickRandom(overlayVariants),
    youtubeTitle: pickRandom(titleVariants),
    youtubeDescription: pickRandom(descriptionVariants),
    youtubeTags: pickRandom(tagVariants),
    instagramCaption: pickRandom(instaVariants),
    pinnedComment: pickRandom(pinnedVariants),
    thumbnailText: pickRandom(thumbnailVariants)
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
      try {
        await navigator.clipboard.writeText(textarea.value);
      } catch (error) {
        textarea.removeAttribute("readonly");
        textarea.select();
        document.execCommand("copy");
        textarea.setAttribute("readonly", "readonly");
      }
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

  const overlayText = texts?.overlay || generateTextPackage().overlay;
  wrapText(ctx, overlayText, 60, 260, 420, 28);

  if (state.selectedOccasion) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.fillRect(40, 780, 460, 120);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillText(state.selectedOccasion.name, 60, 830);
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText(`Anlass: ${state.selectedOccasion.date}`, 60, 860);
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
  lastGenerated.textContent = new Date().toLocaleString("de-AT");
  generationStatus.textContent = "Aktualisiert";
  setTimeout(() => {
    generationStatus.textContent = "Bereit";
  }, 1400);
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
  updateSummary();
};

const selectAudio = (item) => {
  state.selectedAudio = item;
  buildAssetCards(audioAssetList, audioAssets, item.id, selectAudio);
  drawPreview();
  updateSummary();
};

const loadOccasions = async () => {
  try {
    const response = await fetch("data/occasions_at.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Occasion data not found.");
    }
    const data = await response.json();
    return data.occasions ?? defaultOccasions;
  } catch (error) {
    return defaultOccasions;
  }
};

const init = async () => {
  generateButton.disabled = true;
  generationStatus.textContent = "Lädt…";
  state.occasions = await loadOccasions();
  state.selectedOccasion = state.occasions[0];

  buildAssetCards(videoAssetList, videoAssets, state.selectedVideo.id, selectVideo);

  buildAssetCards(audioAssetList, audioAssets, state.selectedAudio.id, selectAudio);

  renderOccasions();
  updateSummary();
  handleGenerate();
  setupDownload();
  generateButton.disabled = false;
  generationStatus.textContent = "Bereit";
};

referenceDate.addEventListener("change", renderOccasions);
generateButton.addEventListener("click", handleGenerate);

init();
