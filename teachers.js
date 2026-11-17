const grid = document.getElementById("workbookGrid");
const search = document.getElementById("search");
const subjectFilter = document.getElementById("subjectFilter");
const levelFilter = document.getElementById("levelFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

let workbooks = [];

const colors = {
  Mathematics: "#2468ed",
  Science: "#159b87",
  English: "#d78a25",
  Chinese: "#db5364",
  Thai: "#8659d3",
  Japanese: "#bb5a91",
  Computers: "#5264d8",
  Coding: "#6347bd",
  Robotics: "#178baf",
};

function createCard(book) {
  const card = document.createElement("article");
  card.className = "workbook-card";

  const cover = document.createElement("div");
  cover.className = "book-cover";
  cover.style.setProperty("--cover-color", colors[book.subject] || "#2468ed");

  const coverLabel = document.createElement("span");
  coverLabel.textContent = `TECHWISE JAM • ${book.level}`;

  const coverTitle = document.createElement("strong");
  coverTitle.textContent = book.subject;

  cover.append(coverLabel, coverTitle);

  const details = document.createElement("div");
  details.className = "book-details";

  const title = document.createElement("h3");
  title.textContent = book.title;

  const description = document.createElement("p");
  description.textContent = `${book.subject} • ${book.level} • PDF Workbook`;

  const actions = document.createElement("div");
  actions.className = "book-actions";

  const view = document.createElement("a");
  view.className = "view-btn";
  view.textContent = "View PDF";
  view.href = book.file;
  view.target = "_blank";
  view.rel = "noopener noreferrer";

  const download = document.createElement("a");
  download.className = "download-btn";
  download.textContent = "Download";
  download.href = book.file;
  download.download = book.file.split("/").pop();

  actions.append(view, download);
  details.append(title, description, actions);
  card.append(cover, details);

  return card;
}

function renderWorkbooks() {
  const query = search.value.trim().toLowerCase();
  const subject = subjectFilter.value;
  const level = levelFilter.value;

  const filtered = workbooks.filter((book) => {
    const matchesSearch = `${book.title} ${book.subject} ${book.level}`
      .toLowerCase()
      .includes(query);

    return (
      matchesSearch &&
      (subject === "all" || book.subject === subject) &&
      (level === "all" || book.level === level)
    );
  });

  grid.replaceChildren(...filtered.map(createCard));

  resultCount.textContent = `${filtered.length} workbook${filtered.length === 1 ? "" : "s"} available`;

  emptyState.hidden = filtered.length !== 0;
}

function populateFilters() {
  const subjects = [...new Set(workbooks.map((b) => b.subject))];
  const levels = [...new Set(workbooks.map((b) => b.level))];

  subjects.sort();
  levels.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const subject of subjects) {
    const option = new Option(subject, subject);
    subjectFilter.add(option);
  }

  for (const level of levels) {
    const option = new Option(level, level);
    levelFilter.add(option);
  }
}

async function loadWorkbooks() {
  try {
    const response = await fetch("./workbooks.json", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to load workbook catalog");
    }

    const data = await response.json();

    if (!Array.isArray(data.workbooks)) {
      throw new Error("Invalid workbook catalog");
    }

    workbooks = data.workbooks.filter(
      (book) =>
        typeof book.title === "string" &&
        typeof book.subject === "string" &&
        typeof book.level === "string" &&
        typeof book.file === "string" &&
        book.file.toLowerCase().endsWith(".pdf"),
    );

    populateFilters();
    renderWorkbooks();
  } catch (err) {
    console.error(err);
    resultCount.textContent = "Unable to load workbooks.";
  }
}

search.addEventListener("input", renderWorkbooks);
subjectFilter.addEventListener("change", renderWorkbooks);
levelFilter.addEventListener("change", renderWorkbooks);

loadWorkbooks();
