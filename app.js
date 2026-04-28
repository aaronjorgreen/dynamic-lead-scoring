/* ============================================================
   Dynamic Lead Scoring — app.js
   Frontend-only quiz logic, scoring engine, and CTA rendering.
   ============================================================ */

"use strict";

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const questions = [
  {
    id: 1,
    question: "How many pages does your website need?",
    answers: [
      { label: "1–3 pages (simple landing page)", points: 1 },
      { label: "4–8 pages (standard multi-page site)", points: 2 },
      { label: "9–15 pages (large content site)", points: 3 },
      { label: "16+ pages / web app with dynamic routes", points: 4 },
    ],
  },
  {
    id: 2,
    question: "Who will provide the website copy and content?",
    answers: [
      { label: "We have all copy and assets ready", points: 1 },
      { label: "We have rough copy — needs light editing", points: 2 },
      { label: "We need help writing most of the copy", points: 3 },
      { label: "We need full content strategy + copywriting", points: 4 },
    ],
  },
  {
    id: 3,
    question: "What integrations or special functionality does your site require?",
    answers: [
      { label: "None — static informational site", points: 1 },
      { label: "Basic (contact form, analytics, live chat)", points: 2 },
      { label: "Moderate (wallet connect, token price feeds, CMS)", points: 3 },
      { label: "Complex (DEX integration, on-chain data, custom API)", points: 4 },
    ],
  },
  {
    id: 4,
    question: "When do you need the website launched?",
    answers: [
      { label: "Flexible — 3+ months", points: 1 },
      { label: "6–12 weeks", points: 2 },
      { label: "3–6 weeks", points: 3 },
      { label: "ASAP — within 2 weeks", points: 4 },
    ],
  },
];

const tiers = [
  {
    min: 4,
    max: 7,
    label: "Low Quality Lead",
    badgeClass: "tier-badge--low",
    tierClass: "low",
    emoji: "🟡",
    description: "Your project is at an early or exploratory stage. There's nothing wrong with that — starting small is smart. Below is the best next step for where you're at right now.",
    ctaHeadline: "Let's Point You in the Right Direction",
    ctaBody: "Your project sounds like a great starting point. Check out our starter packages and resources to get clarity on scope before booking a call.",
    ctaButton: "Browse Starter Packages",
    ctaLink: "#",
  },
  {
    min: 8,
    max: 11,
    label: "Medium Quality Lead",
    badgeClass: "tier-badge--medium",
    tierClass: "medium",
    emoji: "🔵",
    description: "Your project has real scope and solid potential. You know what you need and you're serious about moving forward. Let's explore what a partnership could look like.",
    ctaHeadline: "You're a Strong Fit — Let's Talk",
    ctaBody: "Your project has solid scope. We'd love to learn more and put together a tailored proposal for your crypto website.",
    ctaButton: "Book a Discovery Call",
    ctaLink: "#",
  },
  {
    min: 12,
    max: 16,
    label: "High Quality Lead",
    badgeClass: "tier-badge--high",
    tierClass: "high",
    emoji: "🟢",
    description: "Your project is high-scope, technically complex, and right in our wheelhouse. You're exactly the kind of crypto startup we build for. Let's move fast.",
    ctaHeadline: "You're Our Ideal Client — Let's Build",
    ctaBody: "Your project is high-scope and right in our wheelhouse. Let's jump on a priority call and get started on your proposal immediately.",
    ctaButton: "Book a Priority Strategy Call",
    ctaLink: "#",
  },
];

// ─────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────

let state = {
  currentQuestion: 0,
  answers: [], // array of point values, one per question answered
  selectedPoints: null, // points for the currently displayed question
};

// ─────────────────────────────────────────────────────────────
// DOM References (cached after DOMContentLoaded)
// ─────────────────────────────────────────────────────────────

let screens, introScreen, questionScreen, resultsScreen;
let startBtn, nextBtn, resetBtn;
let progressFill, progressLabel;
let questionNumber, questionText, answerOptions;
let tierBadge, scoreDisplay, tierDescription;
let ctaHeadline, ctaBody, ctaBtn, ctaActionText;

// ─────────────────────────────────────────────────────────────
// Screen Management
// ─────────────────────────────────────────────────────────────

/**
 * Hide all screens and show the target screen with animation.
 * @param {HTMLElement} targetScreen
 */
function showScreen(targetScreen) {
  screens.forEach((s) => {
    s.classList.remove("screen--active");
    s.style.display = "none";
  });
  // Reset animation by triggering reflow
  targetScreen.style.display = "flex";
  // eslint-disable-next-line no-void
  void targetScreen.offsetWidth;
  targetScreen.classList.add("screen--active");
}

// ─────────────────────────────────────────────────────────────
// renderIntro
// ─────────────────────────────────────────────────────────────

function renderIntro() {
  showScreen(introScreen);
}

// ─────────────────────────────────────────────────────────────
// renderQuestion
// ─────────────────────────────────────────────────────────────

/**
 * Render a question card for the given question index.
 * @param {number} index - zero-based index into questions array
 */
function renderQuestion(index) {
  const q = questions[index];
  if (!q) return;

  // Reset selected state
  state.selectedPoints = null;

  // Update progress
  const progressPercent = (index / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressLabel.textContent = `Question ${index + 1} of ${questions.length}`;

  // Update ARIA
  const progressWrapper = document.querySelector(".progress-wrapper");
  if (progressWrapper) progressWrapper.setAttribute("aria-valuenow", progressPercent);

  // Update question text
  questionNumber.textContent = `Q${q.id}`;
  questionText.textContent = q.question;

  // Build answer options
  answerOptions.innerHTML = "";
  q.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-option";
    btn.setAttribute("data-points", answer.points);
    btn.setAttribute("aria-pressed", "false");

    const dot = document.createElement("span");
    dot.className = "answer-option-dot";
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = answer.label;

    btn.appendChild(dot);
    btn.appendChild(label);

    btn.addEventListener("click", () => selectAnswer(answer.points, btn));
    answerOptions.appendChild(btn);
  });

  // Disable Next button
  nextBtn.disabled = true;
  nextBtn.classList.add("btn--disabled");

  showScreen(questionScreen);
}

// ─────────────────────────────────────────────────────────────
// selectAnswer
// ─────────────────────────────────────────────────────────────

/**
 * Store selected answer, highlight the button, enable Next.
 * @param {number} points
 * @param {HTMLElement} clickedBtn
 */
function selectAnswer(points, clickedBtn) {
  state.selectedPoints = points;

  // Remove selection from all options
  const allOptions = answerOptions.querySelectorAll(".answer-option");
  allOptions.forEach((opt) => {
    opt.classList.remove("selected");
    opt.setAttribute("aria-pressed", "false");
  });

  // Select the clicked one
  clickedBtn.classList.add("selected");
  clickedBtn.setAttribute("aria-pressed", "true");

  // Enable Next button
  nextBtn.disabled = false;
  nextBtn.classList.remove("btn--disabled");
}

// ─────────────────────────────────────────────────────────────
// nextQuestion
// ─────────────────────────────────────────────────────────────

/**
 * Advance to next question or trigger scoring if last question.
 */
function nextQuestion() {
  if (state.selectedPoints === null) return;

  // Store the answer
  state.answers[state.currentQuestion] = state.selectedPoints;
  state.currentQuestion += 1;

  if (state.currentQuestion < questions.length) {
    renderQuestion(state.currentQuestion);
  } else {
    // All questions answered — score and show results
    const score = calculateScore();
    const tier = getTier(score);
    renderResults(tier, score);
  }
}

// ─────────────────────────────────────────────────────────────
// Scoring Engine
// ─────────────────────────────────────────────────────────────

/**
 * Sum all stored answer point values.
 * @returns {number}
 */
function calculateScore() {
  return state.answers.reduce((total, pts) => total + pts, 0);
}

/**
 * Return the matching tier object based on total score.
 * @param {number} score
 * @returns {object}
 */
function getTier(score) {
  return tiers.find((t) => score >= t.min && score <= t.max) || tiers[0];
}

// ─────────────────────────────────────────────────────────────
// renderResults
// ─────────────────────────────────────────────────────────────

/**
 * Display results screen with tier badge, score, and CTA block.
 * @param {object} tier
 * @param {number} score
 */
function renderResults(tier, score) {
  // Set progress to 100%
  progressFill.style.width = "100%";

  // Tier badge
  tierBadge.textContent = `${tier.emoji} ${tier.label}`;
  tierBadge.className = `tier-badge ${tier.badgeClass}`;

  // Score
  const maxScore = questions.length * 4;
  scoreDisplay.textContent = `Your Score: ${score} / ${maxScore}`;

  // Description
  tierDescription.textContent = tier.description;

  // CTA block
  ctaHeadline.textContent = tier.ctaHeadline;
  ctaBody.textContent = tier.ctaBody;
  ctaActionText.textContent = tier.ctaButton;
  ctaBtn.href = tier.ctaLink;

  showScreen(resultsScreen);
}

// ─────────────────────────────────────────────────────────────
// resetQuiz
// ─────────────────────────────────────────────────────────────

/**
 * Clear all state and return to the intro screen.
 */
function resetQuiz() {
  state = {
    currentQuestion: 0,
    answers: [],
    selectedPoints: null,
  };
  renderIntro();
}

// ─────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM references
  screens = document.querySelectorAll(".screen");
  introScreen = document.getElementById("intro-screen");
  questionScreen = document.getElementById("question-screen");
  resultsScreen = document.getElementById("results-screen");

  startBtn = document.getElementById("start-btn");
  nextBtn = document.getElementById("next-btn");
  resetBtn = document.getElementById("reset-btn");

  progressFill = document.getElementById("progress-fill");
  progressLabel = document.getElementById("progress-label");

  questionNumber = document.getElementById("question-number");
  questionText = document.getElementById("question-text");
  answerOptions = document.getElementById("answer-options");

  tierBadge = document.getElementById("tier-badge");
  scoreDisplay = document.getElementById("score-display");
  tierDescription = document.getElementById("tier-description");

  ctaHeadline = document.getElementById("cta-headline");
  ctaBody = document.getElementById("cta-body");
  ctaBtn = document.getElementById("cta-btn");
  ctaActionText = document.getElementById("cta-btn-text");

  // Wire events
  startBtn.addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = [];
    state.selectedPoints = null;
    renderQuestion(0);
  });

  nextBtn.addEventListener("click", nextQuestion);
  resetBtn.addEventListener("click", resetQuiz);

  // Keyboard: Enter key on answer options
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !nextBtn.disabled) {
      nextQuestion();
    }
  });

  // Initial render
  renderIntro();
});
