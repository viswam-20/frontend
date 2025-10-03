document.getElementById("loginForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let role = document.getElementById("roleSelect").value;

  if (role === "student") {
    window.location.href = "student-dashboard.html";
  } else if (role === "faculty") {
    window.location.href = "faculty-dashboard.html";
  } else if (role === "admin") {
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Please select a role before logging in!");
  }
});
