const typeOrder = ["all", "paper", "blog", "book", "code"];
const typeNames = {
  all: "All",
  paper: "Papers",
  blog: "Blogs",
  book: "Books",
  code: "Code",
};

const state = {
  query: "",
  type: "all",
  topic: "all",
  tag: "all",
};

const elements = {
  root: document.documentElement,
  metaTheme: document.querySelector('meta[name="theme-color"]'),
  themeToggle: document.querySelector("#theme-toggle"),
  themeLabel: document.querySelector(".theme-label"),
  stats: document.querySelector("#stats"),
  search: document.querySelector("#search"),
  typeFilters: document.querySelector("#type-filters"),
  topicFilter: document.querySelector("#topic-filter"),
  tagFilter: document.querySelector("#tag-filter"),
  resultCount: document.querySelector("#result-count"),
  clearFilters: document.querySelector("#clear-filters"),
  emptyClear: document.querySelector("#empty-clear"),
  resourceGrid: document.querySelector("#resources"),
  emptyState: document.querySelector("#empty-state"),
};

let resources = [];

function getStoredTheme() {
  try {
    return localStorage.getItem("lakehouse-theme");
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("lakehouse-theme", theme);
  } catch {
    // The selected theme still applies for this visit when storage is unavailable.
  }
}

function applyTheme(theme) {
  elements.root.dataset.theme = theme;
  elements.themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  elements.themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
  elements.metaTheme?.setAttribute("content", theme === "dark" ? "#0c1413" : "#f4f7f6");
}

function initializeTheme() {
  const stored = getStoredTheme();
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(stored ?? preferred);

  elements.themeToggle.addEventListener("click", () => {
    const theme = elements.root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    storeTheme(theme);
  });
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function renderStats() {
  const values = [
    ["Resources", resources.length],
    ["Research papers", resources.filter((resource) => resource.type === "paper").length],
    ["Blogs & books", resources.filter((resource) => ["blog", "book"].includes(resource.type)).length],
    ["Topics", uniqueSorted(resources.map((resource) => resource.topic)).length],
  ];

  elements.stats.replaceChildren(
    ...values.map(([label, value]) => {
      const wrapper = document.createElement("div");
      wrapper.className = "stat";

      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value;

      wrapper.append(term, description);
      return wrapper;
    }),
  );
}

function renderTypeFilters() {
  const counts = Object.fromEntries(
    typeOrder.map((type) => [
      type,
      type === "all"
        ? resources.length
        : resources.filter((resource) => resource.type === type).length,
    ]),
  );

  elements.typeFilters.replaceChildren(
    ...typeOrder.map((type) => {
      const button = document.createElement("button");
      button.className = "type-filter";
      button.type = "button";
      button.dataset.type = type;
      button.setAttribute("aria-pressed", String(state.type === type));

      const name = document.createElement("span");
      name.textContent = typeNames[type];
      const count = document.createElement("span");
      count.className = "filter-count";
      count.textContent = ` ${counts[type]}`;

      button.append(name, count);
      button.addEventListener("click", () => {
        state.type = type;
        for (const filter of elements.typeFilters.querySelectorAll("button")) {
          filter.setAttribute("aria-pressed", String(filter === button));
        }
        renderResources();
      });

      return button;
    }),
  );
}

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

function initializeSelects() {
  addOptions(elements.topicFilter, uniqueSorted(resources.map((resource) => resource.topic)));
  addOptions(elements.tagFilter, uniqueSorted(resources.flatMap((resource) => resource.tags)));

  elements.topicFilter.addEventListener("change", (event) => {
    state.topic = event.target.value;
    renderResources();
  });

  elements.tagFilter.addEventListener("change", (event) => {
    state.tag = event.target.value;
    renderResources();
  });
}

function matchesResource(resource) {
  if (state.type !== "all" && resource.type !== state.type) {
    return false;
  }
  if (state.topic !== "all" && resource.topic !== state.topic) {
    return false;
  }
  if (state.tag !== "all" && !resource.tags.includes(state.tag)) {
    return false;
  }

  if (!state.query) {
    return true;
  }

  const searchable = [
    resource.title,
    resource.summary,
    resource.topic,
    resource.typeLabel,
    ...resource.tags,
  ]
    .join(" ")
    .toLocaleLowerCase();

  return state.query
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => searchable.includes(term));
}

function createCard(resource) {
  const card = document.createElement("article");
  card.className = "resource-card";
  card.dataset.type = resource.type;

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const type = document.createElement("span");
  type.className = "type-badge";
  type.textContent = resource.typeLabel;

  const topic = document.createElement("span");
  topic.className = "topic-label";
  topic.title = resource.topic;
  topic.textContent = resource.topic;
  meta.append(type, topic);

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = resource.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = resource.title;
  link.setAttribute("aria-label", `${resource.title} (opens in a new tab)`);
  heading.append(link);

  const summary = document.createElement("p");
  summary.className = "card-summary";
  summary.textContent = resource.summary;

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const tags = document.createElement("ul");
  tags.className = "tag-list";
  tags.setAttribute("aria-label", "Technologies");
  for (const value of resource.tags.slice(0, 4)) {
    const tag = document.createElement("li");
    tag.textContent = value;
    tags.append(tag);
  }

  const arrow = document.createElement("span");
  arrow.className = "external-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";

  footer.append(tags, arrow);
  card.append(meta, heading, summary, footer);
  return card;
}

function filtersAreActive() {
  return Boolean(
    state.query || state.type !== "all" || state.topic !== "all" || state.tag !== "all",
  );
}

function renderResources() {
  const filtered = resources.filter(matchesResource);
  elements.resourceGrid.replaceChildren(...filtered.map(createCard));
  elements.resourceGrid.setAttribute("aria-busy", "false");

  const noun = filtered.length === 1 ? "resource" : "resources";
  elements.resultCount.textContent =
    filtered.length === resources.length
      ? `${filtered.length} ${noun}`
      : `${filtered.length} of ${resources.length} resources`;

  elements.emptyState.hidden = filtered.length !== 0;
  elements.resourceGrid.hidden = filtered.length === 0;
  elements.clearFilters.hidden = !filtersAreActive();
}

function clearFilters() {
  state.query = "";
  state.type = "all";
  state.topic = "all";
  state.tag = "all";

  elements.search.value = "";
  elements.topicFilter.value = "all";
  elements.tagFilter.value = "all";
  for (const button of elements.typeFilters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.type === "all"));
  }

  renderResources();
  elements.search.focus();
}

function initializeControls() {
  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLocaleLowerCase();
    renderResources();
  });

  elements.clearFilters.addEventListener("click", clearFilters);
  elements.emptyClear.addEventListener("click", clearFilters);

  document.addEventListener("keydown", (event) => {
    const isTyping = ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      elements.search.focus();
    }
    if (event.key === "Escape" && document.activeElement === elements.search) {
      clearFilters();
    }
  });
}

async function initializeDirectory() {
  try {
    const response = await fetch("./resources.json");
    if (!response.ok) {
      throw new Error(`Resource request failed with ${response.status}`);
    }

    resources = await response.json();
    renderStats();
    renderTypeFilters();
    initializeSelects();
    initializeControls();
    renderResources();
  } catch (error) {
    console.error(error);
    elements.resultCount.textContent = "The resource directory could not be loaded.";
    elements.resourceGrid.setAttribute("aria-busy", "false");
  }
}

initializeTheme();
initializeDirectory();
