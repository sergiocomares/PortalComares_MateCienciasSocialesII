const app = document.querySelector("#app");
let blocks = [];

function setView(view) {
  const isMobile = view === "mobile";
  document.body.classList.toggle("preview-mobile", isMobile);
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.view === view));
  });
  localStorage.setItem("preview-view", view);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

setView(localStorage.getItem("preview-view") || "desktop");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function getYouTubeId(url = "") {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match ? match[1] : null;
}

function renderHome() {
  const cards = blocks.map((block) => `
    <button class="block-card" type="button" data-block-id="${escapeHtml(block.id)}">
      <span class="block-number">${escapeHtml(block.numero)}</span>
      <h3>${escapeHtml(block.nombre)}</h3>
      <span class="video-count">${block.videos.length} ${block.videos.length === 1 ? "vídeo" : "vídeos"}</span>
      <span class="card-link">Ver ejercicios <span aria-hidden="true">→</span></span>
    </button>`).join("");

  app.innerHTML = `
    <section class="hero" id="inicio">
      <div>
        <p class="eyebrow">Resoluciones de ejercicios PEvAU</p>
        <h1>Matemáticas Aplicadas<br>a las Ciencias Sociales II</h1>
        <p class="hero-course">2.º Bachillerato</p>
        <p class="hero-meta">IES Marqués de Comares · Lucena (Córdoba)</p>
        <p class="hero-meta">Sergio Jodral Estepa · Profesor de Matemáticas</p>
        <p class="hero-notice">Página en continua construcción para ayudar al alumnado que se presenta a la PEvAU.</p>
      </div>
      <div class="school-mark">
        <img src="assets/logo-centro.png.png" alt="Logo oficial del IES Marqués de Comares">
      </div>
    </section>
    <section aria-labelledby="blocks-title">
      <div class="content-head">
        <h2 id="blocks-title">Ejercicios PEvAU</h2>
        <p class="section-note">Selecciona un bloque para ver sus resoluciones.</p>
      </div>
      <div class="block-grid">${cards}</div>
    </section>`;

  document.querySelectorAll("[data-block-id]").forEach((card) => {
    card.addEventListener("click", () => { window.location.hash = `bloque=${card.dataset.blockId}`; });
  });
}

function createFilterButtons(label, values, filterName) {
  return `<div class="filter-group"><span class="filter-label">${label}</span><div class="filter-buttons">${values.map((value) => `<button class="filter-button" type="button" data-filter="${filterName}" data-value="${escapeHtml(value)}" aria-pressed="${value === "Todos"}">${escapeHtml(value)}</button>`).join("")}</div></div>`;
}

function renderBlock(block) {
  const videos = block.videos;
  const years = ["Todos", ...new Set(videos.map((video) => video.year).sort((a, b) => b.localeCompare(a, "es", { numeric: true })))];
  const calls = ["Todos", ...new Set(videos.map((video) => video.convocatoria))];

  app.innerHTML = `
    <button class="back-link" type="button" id="back-home"><span aria-hidden="true">←</span> Todos los bloques</button>
    <section aria-labelledby="block-heading">
      <p class="eyebrow">Bloque ${escapeHtml(block.numero)} · PEvAU</p>
      <h1 class="block-title" id="block-heading">${escapeHtml(block.nombre)}</h1>
      <p class="block-subtitle">${videos.length} ${videos.length === 1 ? "vídeo disponible" : "vídeos disponibles"}</p>
      <div class="controls">
        <div class="search-field">
          <label for="search">Buscar ejercicio</label>
          <input id="search" type="search" placeholder="Buscar ejercicio..." autocomplete="off">
        </div>
        ${createFilterButtons("Año", years, "year")}
        ${createFilterButtons("Convocatoria", calls, "call")}
      </div>
      <div class="video-results" id="video-results"></div>
    </section>`;

  document.querySelector("#back-home").addEventListener("click", () => { window.location.hash = "inicio"; });
  let activeYear = "Todos";
  let activeCall = "Todos";
  const search = document.querySelector("#search");

  const updateResults = () => {
    const term = search.value.trim().toLocaleLowerCase("es");
    const filtered = videos.filter((video) => {
      const searchable = [video.year, video.convocatoria, video.title, video.description].join(" ").toLocaleLowerCase("es");
      return (activeYear === "Todos" || video.year === activeYear)
        && (activeCall === "Todos" || video.convocatoria === activeCall)
        && searchable.includes(term);
    });
    renderVideos(filtered);
  };

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.filter === "year") activeYear = button.dataset.value;
      if (button.dataset.filter === "call") activeCall = button.dataset.value;
      document.querySelectorAll(`[data-filter="${button.dataset.filter}"]`).forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      updateResults();
    });
  });
  search.addEventListener("input", updateResults);
  renderVideos(videos);
}

function renderVideos(videos) {
  const container = document.querySelector("#video-results");
  if (!videos.length) {
    container.innerHTML = '<p class="empty-state">No hay vídeos que coincidan con la búsqueda.</p>';
    return;
  }
  container.innerHTML = videos.map((video) => {
    const videoId = getYouTubeId(video.youtube);
    const thumbnail = videoId ? `<img src="https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg" alt="Miniatura de ${escapeHtml(video.title)}">` : "";
    return `<article class="video-card">
      <div class="video-thumb">${thumbnail}<span>${videoId ? "Resolución PEvAU" : "Miniatura de YouTube"}</span></div>
      <div class="video-body">
        <p class="video-meta">${escapeHtml(video.year)} · ${escapeHtml(video.convocatoria)}</p>
        <h3>${escapeHtml(video.title)}</h3>
        <p class="video-description">${escapeHtml(video.description || "Resolución de ejercicio PEvAU.")}</p>
        <a class="video-link" href="${escapeHtml(video.youtube)}" target="_blank" rel="noopener noreferrer">▶ Ver vídeo</a>
      </div>
    </article>`;
  }).join("");
}

function route() {
  const blockId = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("bloque");
  const block = blocks.find((item) => item.id === blockId);
  if (block) renderBlock(block);
  else renderHome();
  app.focus({ preventScroll: true });
}

async function init() {
  try {
    const response = await fetch("data/videos.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    blocks = data.bloques || [];
    window.addEventListener("hashchange", route);
    route();
  } catch (error) {
    app.innerHTML = '<p class="empty-state">No se pudieron cargar los contenidos. Abre la web desde un servidor local o GitHub Pages.</p>';
    console.error("Error loading videos:", error);
  }
}

init();
