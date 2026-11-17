"use strict";

// Student username from URL
// Example: student.html?username=prompt

const params = new URLSearchParams(window.location.search);
const username = params.get("username")?.trim() || "Student";

document.getElementById("studentName").textContent = "learner";

// Local storage is separated by username.
// This is for UI progress, not authentication.
const storageKey = `techwise_student_${username}`;

function loadHistory() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let history = loadHistory();

// Quiz question bank
const quizzes = {
  computers: [
    {
      question: "What is the main purpose of a CPU?",
      options: [
        "Store files permanently",
        "Process instructions",
        "Display images",
        "Connect to Wi-Fi",
      ],
      answer: 1,
    },
    {
      question: "Which device is used to enter text?",
      options: ["Monitor", "Speaker", "Keyboard", "Projector"],
      answer: 2,
    },
    {
      question: "What does RAM primarily store?",
      options: [
        "Temporary working data",
        "Printed documents",
        "Permanent backups",
        "Internet passwords only",
      ],
      answer: 0,
    },
    {
      question: "Which of these is an operating system?",
      options: ["Canva", "Windows", "Google Chrome", "Microsoft Word"],
      answer: 1,
    },
    {
      question: "Which file extension is commonly used for PDF documents?",
      options: [".exe", ".png", ".mp3", ".pdf"],
      answer: 3,
    },
  ],

  coding: [
    {
      question: "What is a variable used for in programming?",
      options: [
        "Storing a value",
        "Connecting a monitor",
        "Deleting a program",
        "Turning off a computer",
      ],
      answer: 0,
    },
    {
      question: "Which HTML element creates a paragraph?",
      options: ["<div>", "<p>", "<img>", "<button>"],
      answer: 1,
    },
    {
      question: "What is a loop used for?",
      options: [
        "Repeating instructions",
        "Changing screen brightness",
        "Opening a browser",
        "Saving an image",
      ],
      answer: 0,
    },
    {
      question: "Which language is commonly used to style websites?",
      options: ["Python", "SQL", "CSS", "C++"],
      answer: 2,
    },
    {
      question: "What does an if statement do?",
      options: [
        "Always repeats code",
        "Checks a condition",
        "Creates a new file",
        "Stops the internet",
      ],
      answer: 1,
    },
  ],

  robotics: [
    {
      question: "What does a motor do in a robot?",
      options: [
        "Stores program files",
        "Creates movement",
        "Displays websites",
        "Measures temperature only",
      ],
      answer: 1,
    },
    {
      question: "What is the purpose of a sensor?",
      options: [
        "Detect information from the environment",
        "Store the robot's battery",
        "Decorate the robot",
        "Replace the controller",
      ],
      answer: 0,
    },
    {
      question: "Which component controls an Arduino Uno program?",
      options: ["A speaker", "A microcontroller", "A wheel", "A display cable"],
      answer: 1,
    },
    {
      question: "Which sensor can measure distance?",
      options: ["Ultrasonic sensor", "LED", "Servo motor", "Buzzer"],
      answer: 0,
    },
    {
      question: "What is a servo motor commonly used for?",
      options: [
        "Storing data",
        "Controlling angular position",
        "Displaying images",
        "Connecting to a printer",
      ],
      answer: 1,
    },
  ],
};

const subjectNames = {
  computers: "Computers",
  coding: "Coding",
  robotics: "Robotics",
};

let currentSubject = null;
let currentQuestions = [];
let currentIndex = 0;
let answers = [];

// Navigation

const navButtons = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  window.scrollTo(0, 0);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

function openQuizCenter() {
  resetQuizView();
  showPage("quiz");
}

document
  .getElementById("startLearning")
  .addEventListener("click", openQuizCenter);

document.getElementById("openQuiz").addEventListener("click", openQuizCenter);

// Quiz selection

document.querySelectorAll("[data-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    startQuiz(button.dataset.subject);
  });
});

function startQuiz(subject) {
  if (!quizzes[subject]) return;

  currentSubject = subject;
  currentQuestions = [...quizzes[subject]];
  currentIndex = 0;
  answers = new Array(currentQuestions.length).fill(null);

  document.getElementById("quizSelection").classList.add("hidden");

  document.getElementById("quizResults").classList.add("hidden");

  document.getElementById("quizPlayer").classList.remove("hidden");

  document.getElementById("quizTitle").textContent =
    `${subjectNames[subject]} Quiz`;

  renderQuestion();
}

function renderQuestion() {
  const question = currentQuestions[currentIndex];
  const total = currentQuestions.length;

  document.getElementById("questionCounter").textContent =
    `Question ${currentIndex + 1} of ${total}`;

  document.getElementById("quizProgress").style.width =
    `${((currentIndex + 1) / total) * 100}%`;

  document.getElementById("questionText").textContent = question.question;

  const optionsContainer = document.getElementById("answerOptions");

  optionsContainer.replaceChildren();

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    if (answers[currentIndex] === index) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      answers[currentIndex] = index;
      renderQuestion();
    });

    optionsContainer.appendChild(button);
  });

  document.getElementById("previousQuestion").disabled = currentIndex === 0;

  document.getElementById("nextQuestion").textContent =
    currentIndex === total - 1 ? "Submit Quiz" : "Next Question";
}

document.getElementById("previousQuestion").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

document.getElementById("nextQuestion").addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    alert("Please select an answer before continuing.");
    return;
  }

  if (currentIndex < currentQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    const unanswered = answers.findIndex((a) => a === null);

    if (unanswered !== -1) {
      currentIndex = unanswered;
      renderQuestion();
      alert("Please answer all questions before submitting.");
      return;
    }

    submitQuiz();
  }
});

// Quiz results

function submitQuiz() {
  let correct = 0;

  currentQuestions.forEach((question, index) => {
    if (answers[index] === question.answer) {
      correct++;
    }
  });

  const total = currentQuestions.length;
  const percentage = Math.round((correct / total) * 100);

  history.push({
    subject: currentSubject,
    score: percentage,
    correct,
    total,
    date: new Date().toISOString(),
  });

  localStorage.setItem(storageKey, JSON.stringify(history));

  document.getElementById("quizPlayer").classList.add("hidden");

  document.getElementById("quizResults").classList.remove("hidden");

  document.getElementById("resultScore").textContent = `${percentage}%`;

  document.getElementById("resultDetails").textContent =
    `You answered ${correct} out of ${total} questions correctly.`;

  let message;

  if (percentage === 100) {
    message = "Perfect Score!";
  } else if (percentage >= 80) {
    message = "Excellent Work!";
  } else if (percentage >= 60) {
    message = "Good Effort!";
  } else {
    message = "Keep Practicing!";
  }

  document.getElementById("resultMessage").textContent = message;

  renderAnswerReview();
  updateOverview();
}

function renderAnswerReview() {
  const container = document.getElementById("answerReview");
  container.replaceChildren();

  currentQuestions.forEach((question, index) => {
    const correct = answers[index] === question.answer;

    const item = document.createElement("div");
    item.className = "review-item";

    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${question.question}`;

    const chosen = document.createElement("p");
    chosen.textContent = `Your answer: ${question.options[answers[index]]}`;
    chosen.className = correct ? "correct" : "incorrect";

    const expected = document.createElement("p");
    expected.textContent = `Correct answer: ${question.options[question.answer]}`;

    item.append(title, chosen, expected);
    container.appendChild(item);
  });
}

function resetQuizView() {
  document.getElementById("quizSelection").classList.remove("hidden");

  document.getElementById("quizPlayer").classList.add("hidden");

  document.getElementById("quizResults").classList.add("hidden");

  currentSubject = null;
  currentQuestions = [];
  currentIndex = 0;
  answers = [];
}

document
  .getElementById("backToQuizzes")
  .addEventListener("click", resetQuizView);

document.getElementById("finishQuiz").addEventListener("click", resetQuizView);

// Overview statistics

function updateOverview() {
  const completed = history.length;

  const average = completed
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / completed)
    : 0;

  const best = completed ? Math.max(...history.map((item) => item.score)) : 0;

  document.getElementById("completedCount").textContent = completed;

  document.getElementById("averageScore").textContent = `${average}%`;

  document.getElementById("bestScore").textContent = `${best}%`;

  const activity = document.getElementById("recentActivity");
  activity.replaceChildren();

  if (!completed) {
    activity.textContent = "No quizzes completed yet.";
    return;
  }

  history
    .slice(-5)
    .reverse()
    .forEach((item) => {
      const entry = document.createElement("div");
      entry.className = "activity-entry";

      const info = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = `${subjectNames[item.subject] || item.subject} Quiz`;

      const date = document.createElement("small");
      date.textContent = new Date(item.date).toLocaleString();

      const score = document.createElement("strong");
      score.textContent = `${item.score}%`;

      info.append(title, date);
      entry.append(info, score);
      activity.appendChild(entry);
    });
}

updateOverview();
