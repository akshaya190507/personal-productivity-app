const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function redirectIfNotLoggedIn() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
  }
  return token;
}

async function authFetch(endpoint, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  return res;
}