const HABIT_URL = "/api/habits";

// 🔐 Check authentication
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

/* =========================
   LOAD HABITS
========================= */
async function loadHabits() {
  try {
    const res = await fetch(HABIT_URL, {
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
      throw new Error("Failed to load habits");
    }

    const habits = await res.json();

    const container = document.getElementById("habitList");
    if (!container) return;

    container.innerHTML = "";

    if (habits.length === 0) {
      container.innerHTML = `<p class="empty">No habits yet 🌱</p>`;
      return;
    }

    habits.forEach(habit => {
      const today = new Date().toDateString();

      const completedToday = habit.completedDates.some(date =>
        new Date(date).toDateString() === today
      );

      const div = document.createElement("div");
      div.className = "habit-item";

      div.innerHTML = `
        <span>
          <strong>${habit.name}</strong> (${habit.frequency})
        </span>

        <div>
          🔥 Current: ${habit.currentStreak || 0} days
          <br>
          🏆 Longest: ${habit.longestStreak || 0} days
        </div>

        <div>
          <button onclick="toggleHabit('${habit._id}')">
            ${completedToday ? "Undo" : "Done"}
          </button>

          <button onclick="deleteHabit('${habit._id}')">
            Delete
          </button>
        </div>
      `;

      if (completedToday) {
        div.style.background = "#d1fae5";
      }

      container.appendChild(div);
    });

  } catch (error) {
    console.error("Error loading habits:", error);
    alert("Could not load habits.");
  }
}

/* =========================
   CREATE HABIT
========================= */
const addHabitBtn = document.getElementById("addHabitBtn");

if (addHabitBtn) {
  addHabitBtn.addEventListener("click", async () => {
    const name = document.getElementById("habitName").value.trim();
    const frequency = document.getElementById("habitFrequency").value;

    if (!name) {
      alert("Habit name required");
      return;
    }

    try {
      const res = await fetch(HABIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, frequency })
      });

      if (!res.ok) {
        throw new Error("Failed to create habit");
      }

      document.getElementById("habitName").value = "";
      loadHabits();

    } catch (error) {
      console.error("Error creating habit:", error);
      alert("Could not create habit.");
    }
  });
}

/* =========================
   TOGGLE HABIT
========================= */
async function toggleHabit(id) {
  try {
    const res = await fetch(`${HABIT_URL}/${id}/toggle`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to toggle habit");
    }

    loadHabits();

  } catch (error) {
    console.error("Error toggling habit:", error);
    alert("Could not update habit.");
  }
}

/* =========================
   DELETE HABIT
========================= */
async function deleteHabit(id) {
  if (!confirm("Delete this habit?")) return;

  try {
    const res = await fetch(`${HABIT_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to delete habit");
    }

    loadHabits();

  } catch (error) {
    console.error("Error deleting habit:", error);
    alert("Could not delete habit.");
  }
}


/* =========================
   INITIAL LOAD
========================= */
loadHabits();

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}