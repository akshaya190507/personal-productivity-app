const POMO_URL = "/api/pomodoro";

// 🔐 Check authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isFocus = true;

const timerDisplay = document.getElementById("timer");
const modeLabel = document.getElementById("modeLabel");

/* =========================
   UPDATE DISPLAY
========================= */
function updateDisplay() {
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  if (timerDisplay) {
    timerDisplay.textContent = `${m}:${s}`;
  }
}

/* =========================
   START TIMER
========================= */
function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        switchMode();
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    updateDisplay();
  }, 1000);
}

/* =========================
   PAUSE TIMER
========================= */
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

/* =========================
   RESET TIMER
========================= */
function resetTimer() {
  pauseTimer();
  minutes = isFocus ? 25 : 5;
  seconds = 0;
  updateDisplay();
}

/* =========================
   SWITCH MODE
========================= */
async function switchMode() {
  pauseTimer();

  // Save focus session
  if (isFocus) {
    try {
      const res = await fetch(POMO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to save session");
      }

      await loadTodayStats();

    } catch (error) {
      console.error("Error saving pomodoro session:", error);
      alert("Could not save session.");
    }
  }

  // Switch mode
  isFocus = !isFocus;
  minutes = isFocus ? 25 : 5;
  seconds = 0;

  if (modeLabel) {
    modeLabel.textContent = isFocus ? "Focus Time" : "Break Time";
  }

  updateDisplay();
}

/* =========================
   LOAD TODAY STATS
========================= */
async function loadTodayStats() {
  try {
    const res = await fetch(`${POMO_URL}/today`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load sessions");
    }

    const sessions = await res.json();

    const total = sessions.length;

    const statsEl = document.getElementById("todayCount");
    if (statsEl) {
      statsEl.textContent = `🍅 Today's Sessions: ${total}`;
    }

  } catch (error) {
    console.error("Error loading today's sessions:", error);
  }
}

/* =========================
   EVENT LISTENERS
========================= */
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

if (startBtn) startBtn.addEventListener("click", startTimer);
if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
if (resetBtn) resetBtn.addEventListener("click", resetTimer);

updateDisplay();
loadTodayStats();
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}