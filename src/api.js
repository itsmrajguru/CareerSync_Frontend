// src/api.js

const API_BASE_RAW = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const API_BASE = API_BASE_RAW.replace(/\/$/, "");
console.debug('[API] Initializing with base:', API_BASE);

async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return false;

  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    return false;
  }

  const data = await res.json();
  localStorage.setItem("token", data.access);
  return true;
}

async function authFetch(url, options = {}) {
  let token = localStorage.getItem("token");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  // Attempt token permutation on 401 response
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      token = localStorage.getItem("token");
      options.headers.Authorization = `Bearer ${token}`;
      res = await fetch(url, options);
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`${res.status} - ${errorText}`);
  }

  if (res.status === 204) {
    return {};
  }

  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Login failed: ${res.status}`);
  }
  return data;
}

export async function signupUser({ username, email, password }) {
  const res = await fetch(`${API_BASE}/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Signup failed: ${res.status}`);
  }

  return data;
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_BASE}/verify/${token}/`, {
    method: "POST"
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Verification failed");
  return data;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/forgot-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send reset email");
  return data;
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_BASE}/reset-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Password reset failed");
  return data;
}

export async function getJobs(query, page = 1, limit = 10) {
  return authFetch(`${API_BASE}/jobs/?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

export async function getProfileList() {
  return authFetch(`${API_BASE}/profile/`);
}

export async function getProfile(id) {
  return authFetch(`${API_BASE}/profile/${id}/`);
}

export async function createProfile(data) {
  return authFetch(`${API_BASE}/profile/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateProfile(id, data) {
  return authFetch(`${API_BASE}/profile/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteProfile(id) {
  return authFetch(`${API_BASE}/profile/${id}/`, {
    method: "DELETE",
  });
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  return authFetch(`${API_BASE}/resume/upload/`, {
    method: "POST",
    body: formData,
  });
}

