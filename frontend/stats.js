const STATS_URL = "/api/stats";

// 🔐 Check authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

/* =========================
   LOAD STATS
========================= */
async function loadStats() {
  try {
    const res = await fetch(STATS_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // Handle expired or invalid token
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load statistics");
    }

    const data = await res.json();

    const container = document.getElementById("statsContainer");
    if (!container) return;

    container.innerHTML = `
      <div class="stat-box">
        <h3>Total Tasks</h3>
        <p>${data.totalTasks ?? 0}</p>
      </div>

      <div class="stat-box">
        <h3>Completed Tasks</h3>
        <p>${data.completedTasks ?? 0}</p>
      </div>

      <div class="stat-box">
        <h3>Completion Rate</h3>
        <p>${data.taskCompletionRate ?? 0}%</p>
      </div>

      <div class="stat-box">
        <h3>Total Pomodoros</h3>
        <p>${data.totalPomodoros ?? 0}</p>
      </div>

      <div class="stat-box">
        <h3>Total Focus Minutes</h3>
        <p>${data.totalFocusMinutes ?? 0}</p>
      </div>

      <div class="stat-box">
        <h3>Total Habits</h3>
        <p>${data.totalHabits ?? 0}</p>
      </div>
    `;

  } catch (error) {
    console.error("Error loading stats:", error);
    alert("Could not load statistics.");
  }
}

loadStats();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}