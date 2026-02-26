const API_URL = "/api/tasks";

// 🔐 Check authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

/* =========================
   LOAD WEEKLY TASKS
========================= */
async function loadWeeklyTasks() {
  try {
    const res = await fetch(`${API_URL}/weekly`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // Handle expired token
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load weekly tasks");
    }

    const tasks = await res.json();

    // Clear previous tasks
    document.querySelectorAll(".day-tasks").forEach(el => {
      el.innerHTML = `<p class="empty">No tasks 🌱</p>`;
    });

    // Group tasks by weekday (0–6)
    const tasksByDay = {};

    tasks.forEach(task => {
      if (!task.dueDate) return;

      const day = new Date(task.dueDate).getDay();

      if (!tasksByDay[day]) {
        tasksByDay[day] = [];
      }

      tasksByDay[day].push(task);
    });

    // Render tasks
    Object.keys(tasksByDay).forEach(day => {
      const column = document.querySelector(`.day-column[data-day="${day}"]`);
      if (!column) return;

      const container = column.querySelector(".day-tasks");
      container.innerHTML = "";

      tasksByDay[day].forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
          <strong>${task.title}</strong>
          <small>Mood: ${task.mood || "—"}</small>
        `;

        container.appendChild(div);
      });
    });

  } catch (error) {
    console.error("Error loading weekly tasks:", error);
    alert("Could not load weekly tasks.");
  }
}

loadWeeklyTasks();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}