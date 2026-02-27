const API_URL = "/api/tasks";

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const dateEl = document.getElementById("date");
if (dateEl) {
  dateEl.textContent = new Date().toDateString();
}

/* =========================
   LOAD TASKS
========================= */
async function loadTasks() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    if (!res.ok) throw new Error("Failed to load tasks");

    const tasks = await res.json();

    const pendingList = document.querySelector("#pending .task-list");
    const inProgressList = document.querySelector("#in-progress .task-list");
    const doneList = document.querySelector("#done .task-list");

    if (!pendingList || !inProgressList || !doneList) return;

    pendingList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    if (tasks.length === 0) {
      document.querySelectorAll(".task-list").forEach(list => {
        list.innerHTML = `<p class="empty">No tasks yet 🌱</p>`;
      });
      return;
    }

    tasks.forEach(task => {
      const div = document.createElement("div");
      div.className = "task";

      div.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description || ""}</p>
        <small>Mood: ${task.mood || "—"}</small>
        <div class="actions">
            ${task.status !== "in-progress" ? `<button onclick="updateStatus('${task._id}', 'in-progress')">In Progress</button>` : ""}
            ${task.status !== "done" ? `<button onclick="updateStatus('${task._id}', 'done')">Done</button>` : ""}
            <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      `;

      if (task.status === "pending") {
        pendingList.appendChild(div);
      } else if (task.status === "in-progress") {
        inProgressList.appendChild(div);
      } else {
        doneList.appendChild(div);
      }
    });

  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("Could not load tasks.");
  }
}

/* =========================
   CREATE TASK
========================= */
async function createTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const status = document.getElementById("status").value;
  const mood = document.getElementById("mood").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!title) {
    alert("Title is required");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        status,
        mood,
        dueDate
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create task");
    }

    // Clear fields
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    // Reload data safely
    await loadTasks();

    if (typeof loadStats === "function") {
      loadStats();
    }

    if (typeof loadWeeklyTasks === "function") {
      loadWeeklyTasks();
    }

  } catch (error) {
    console.error("Create task error:", error);
    alert(error.message);
  }
}
/* =========================
   DELETE TASK
========================= */
async function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;

  try {
    const res = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to delete task");

    await loadTasks();
    loadStats();
    loadWeeklyTasks && loadWeeklyTasks();

  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Could not delete task.");
  }
}

/* =========================
   UPDATE TASK STATUS
========================= */
async function updateStatus(taskId, newStatus) {
  try {
    const res = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) throw new Error("Failed to update task");

    await loadTasks();
    loadStats();
    loadWeeklyTasks && loadWeeklyTasks();

  } catch (error) {
    console.error("Error updating task:", error);
    alert("Could not update task.");
  }
}

/* =========================
   LOAD STATS
========================= */
async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/stats`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) return;

    const data = await res.json();

    const p = document.getElementById("pendingCount");
    const ip = document.getElementById("inProgressCount");
    const d = document.getElementById("doneCount");

    if (p) p.textContent = data.pending;
    if (ip) ip.textContent = data.inProgress;
    if (d) d.textContent = data.done;

  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* =========================
   INITIAL LOAD
========================= */
const addBtn = document.getElementById("addTaskBtn");
if (addBtn) addBtn.addEventListener("click", createTask);

loadTasks();
loadStats();

function logout() {
  localStorage.removeItem("token");  // remove JWT
  window.location.href = "login.html";  // redirect to login
}
