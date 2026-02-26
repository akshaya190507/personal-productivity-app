const AUTH_URL = "/api/auth";

/* =========================
   AUTO REDIRECT IF LOGGED IN
========================= */
const existingToken = localStorage.getItem("token");
if (existingToken && window.location.pathname.includes("login.html")) {
  window.location.href = "index.html";
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🔥 prevent page reload

    try {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Email and password are required");
        return;
      }

      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      window.location.href = "index.html";

    } catch (error) {
      alert(error.message);
    }
  });
}

/* =========================
   SIGNUP
========================= */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🔥 prevent reload

    try {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !email || !password) {
        alert("All fields are required");
        return;
      }

      const res = await fetch(`${AUTH_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Signup successful! Please login.");
      window.location.href = "login.html";

    } catch (error) {
      alert(error.message);
    }
  });
}