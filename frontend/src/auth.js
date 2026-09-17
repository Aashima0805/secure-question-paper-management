export function saveSession(data) {
  localStorage.setItem("token", data.token || "");
  localStorage.setItem("userId", data.id || "");
  localStorage.setItem("name", data.name || "");
  localStorage.setItem("email", data.email || "");
  localStorage.setItem("role", data.role || "");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login";
}

export function getRole() {
  return localStorage.getItem("role") || "USER";
}

export function getName() {
  return localStorage.getItem("name") || "User";
}