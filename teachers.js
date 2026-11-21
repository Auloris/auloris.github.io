const loginTime = Number(sessionStorage.getItem("loginTime"));
const sessionDuration = 30 * 60 * 1000; // 30 minutes

if (
  sessionStorage.getItem("isLoggedIn") !== "true" ||
  !loginTime ||
  Date.now() - loginTime >= sessionDuration
) {
  sessionStorage.clear();
  window.location.replace("login.html");
}

const isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  window.location.replace("login.html");
} else {
  document.addEventListener("DOMContentLoaded", initializeDashboard);
}

function initializeDashboard() {
  const grid = document.getElementById("workbookGrid");
  const search = document.getElementById("search");
  const subjectFilter = document.getElementById("subjectFilter");
  const levelFilter = document.getElementById("levelFilter");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  let workbooks = [];

  const colors = {
    Computers: "#5264d8",
    "Computer Science": "#5264d8",
    Coding: "#6347bd",
    Robotics: "#178baf",
    Math: "#0000ff",
    Science: "#1a7000",
    Chinese: "#9e3500",
  };

  function createCard(book) {
    const card = document.createElement("article");
    card.className = "workbook-card";

    const cover = document.createElement("div");
    cover.className = "book-cover";

    cover.style.setProperty("--cover-color", colors[book.subject] || "#2468ed");

    const coverLabel = document.createElement("span");
    coverLabel.textContent = `Auloris • ${book.level}`;

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

    const print = document.createElement("a");
    print.className = "download-btn";
    print.textContent = "Print";
    print.href = book.file;
    print.target = "_blank";
    print.rel = "noopener noreferrer";
    // download.download = book.file.split("/").pop();

    actions.append(view, print);
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

    resultCount.textContent = `${filtered.length} workbook${
      filtered.length === 1 ? "" : "s"
    } available`;

    emptyState.hidden = filtered.length !== 0;
  }

  function populateFilters() {
    const subjects = [...new Set(workbooks.map((book) => book.subject))];

    const levels = [...new Set(workbooks.map((book) => book.level))];

    subjects.sort();

    levels.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    subjectFilter.replaceChildren(new Option("All Subjects", "all"));

    levelFilter.replaceChildren(new Option("All Levels", "all"));

    for (const subject of subjects) {
      const option = new Option(subject, subject);
      subjectFilter.add(option);
    }

    for (const level of levels) {
      const option = new Option(level, level);
      levelFilter.add(option);
    }
  }

  function loadWorkbooks() {
    try {
      const data = {
        workbooks: [
          {
            title: "Level 1 Computer Science",
            subject: "Computer Science",
            level: "Level 1",
            file: "c1.pdf",
          },
          {
            title: "Level 2 Computer Science",
            subject: "Computer Science",
            level: "Level 2",
            file: "c2.pdf",
          },
          {
            title: "Level 3 Computer Science",
            subject: "Computer Science",
            level: "Level 3",
            file: "c3.pdf",
          },
          {
            title: "Level 4 Computer Science",
            subject: "Computer Science",
            level: "Level 4",
            file: "c4.pdf",
          },
          {
            title: "Level 5 Computer Science",
            subject: "Computer Science",
            level: "Level 5",
            file: "c5.pdf",
          },
          {
            title: "Level 6 Computer Science",
            subject: "Computer Science",
            level: "Level 6",
            file: "c6.pdf",
          },
          {
            title: "Level 1 Robotics",
            subject: "Robotics",
            level: "Level 1",
            file: "lev1rob.pdf",
          },
          {
            title: "Level 2 Robotics",
            subject: "Robotics",
            level: "Level 2",
            file: "lev2rob.pdf",
          },
          {
            title: "Level 3 Robotics",
            subject: "Robotics",
            level: "Level 3",
            file: "lev3rob.pdf",
          },
          {
            title: "Level 4 Robotics",
            subject: "Robotics",
            level: "Level 4",
            file: "lev4rob.pdf",
          },
          {
            title: "Level 5 Robotics",
            subject: "Robotics",
            level: "Level 5",
            file: "lev5rob.pdf",
          },
          {
            title: "Level 6 Robotics",
            subject: "Robotics",
            level: "Level 6",
            file: "lev6rob.pdf",
          },
          {
            title: "Level 1A Chinese",
            subject: "Chinese",
            level: "Level 1",
            file: "chn1a.pdf",
          },
          {
            title: "Level 1B Chinese",
            subject: "Chinese",
            level: "Level 1",
            file: "chn1b.pdf",
          },
          {
            title: "Level 2A Chinese",
            subject: "Chinese",
            level: "Level 2",
            file: "chn2a.pdf",
          },
          {
            title: "Level 2B Chinese",
            subject: "Chinese",
            level: "Level 2",
            file: "chn2b.pdf",
          },
          //
          {
            title: "Level 3A Chinese",
            subject: "Chinese",
            level: "Level 3",
            file: "chn3a.pdf",
          },
          {
            title: "Level 3B Chinese",
            subject: "Chinese",
            level: "Level 3",
            file: "chn3b.pdf",
          },
          {
            title: "Level 4A Chinese",
            subject: "Chinese",
            level: "Level 4",
            file: "chn4a.pdf",
          },
          {
            title: "Level 4B Chinese",
            subject: "Chinese",
            level: "Level 4",
            file: "chn4b.pdf",
          },
          //
          {
            title: "Level 5A Chinese",
            subject: "Chinese",
            level: "Level 5",
            file: "chn5a.pdf",
          },
          {
            title: "Level 5B Chinese",
            subject: "Chinese",
            level: "Level 5",
            file: "chn5b.pdf",
          },
          {
            title: "Level 6A Chinese",
            subject: "Chinese",
            level: "Level 6",
            file: "chn6a.pdf",
          },
          {
            title: "Level 6B Chinese",
            subject: "Chinese",
            level: "Level 6",
            file: "chn6b.pdf",
          },
          // Next sub
          // next sub gtag
          {
            title: "Level 1A Science",
            subject: "Science",
            level: "Level 1",
            file: "sc1a.pdf",
          },
          {
            title: "Level 1B Science",
            subject: "Science",
            level: "Level 1",
            file: "sc1b.pdf",
          },
          {
            title: "Level 2A Science",
            subject: "Science",
            level: "Level 2",
            file: "sc2a.pdf",
          },
          {
            title: "Level 2B Science",
            subject: "Science",
            level: "Level 2",
            file: "sc2b.pdf",
          },
          //
          {
            title: "Level 3A Science",
            subject: "Science",
            level: "Level 3",
            file: "sc3a.pdf",
          },
          {
            title: "Level 3B Science",
            subject: "Science",
            level: "Level 3",
            file: "sc3b.pdf",
          },
          {
            title: "Level 4A Science",
            subject: "Science",
            level: "Level 4",
            file: "sc4a.pdf",
          },
          {
            title: "Level 4B Science",
            subject: "Science",
            level: "Level 4",
            file: "sc4b.pdf",
          },
          //
          {
            title: "Level 5A Science",
            subject: "Science",
            level: "Level 5",
            file: "sc5a.pdf",
          },
          {
            title: "Level 5B Science",
            subject: "Science",
            level: "Level 5",
            file: "sc5b.pdf",
          },
          {
            title: "Level 6A Science",
            subject: "Science",
            level: "Level 6",
            file: "sc6a.pdf",
          },
          {
            title: "Level 6B Science",
            subject: "Science",
            level: "Level 6",
            file: "sc6b.pdf",
          },
          // Next sub
          // next sub gtag
          {
            title: "Level 1A Math",
            subject: "Mathematics",
            level: "Level 1",
            file: "m1a.pdf",
          },
          {
            title: "Level 1B Math",
            subject: "Mathematics",
            level: "Level 1",
            file: "m1b.pdf",
          },
          {
            title: "Level 2A Math",
            subject: "Mathematics",
            level: "Level 2",
            file: "m2a.pdf",
          },
          {
            title: "Level 2B Math",
            subject: "Mathematics",
            level: "Level 2",
            file: "m2b.pdf",
          },
          //
          {
            title: "Level 3A Math",
            subject: "Mathematics",
            level: "Level 3",
            file: "m3a.pdf",
          },
          {
            title: "Level 3B Math",
            subject: "Mathematics",
            level: "Level 3",
            file: "m3b.pdf",
          },
          {
            title: "Level 4A Math",
            subject: "Mathematics",
            level: "Level 4",
            file: "m4a.pdf",
          },
          {
            title: "Level 4B Math",
            subject: "Mathematics",
            level: "Level 4",
            file: "m4b.pdf",
          },
          //
          {
            title: "Level 5A Math",
            subject: "Mathematics",
            level: "Level 5",
            file: "m5a.pdf",
          },
          {
            title: "Level 5B Math",
            subject: "Mathematics",
            level: "Level 5",
            file: "m5b.pdf",
          },
          {
            title: "Level 6A Math",
            subject: "Mathematics",
            level: "Level 6",
            file: "m6a.pdf",
          },
          {
            title: "Level 6B Math",
            subject: "Mathematics",
            level: "Level 6",
            file: "m6b.pdf",
          },
        ],
      };

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

  if (
    !grid ||
    !search ||
    !subjectFilter ||
    !levelFilter ||
    !resultCount ||
    !emptyState
  ) {
    console.error("Dashboard HTML elements are missing.");
    return;
  }

  search.addEventListener("input", renderWorkbooks);
  subjectFilter.addEventListener("change", renderWorkbooks);
  levelFilter.addEventListener("change", renderWorkbooks);

  loadWorkbooks();
}
