// ----------------------------
// Login Form Role-Based Redirection
// ----------------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent default form submission

    const role = document.getElementById("roleSelect").value; // correct ID for login page

    if (role === "student") {
      window.location.href = "student-dashboard.html";
    } else if (role === "faculty") {
      window.location.href = "faculty-dashboard.html";
    } else if (role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Please select a role!");
    }
  });
}

// ----------------------------
// Signup Form Role-Based Redirection
// ----------------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent default form submission

    const role = document.getElementById("role").value; // correct ID for signup page

    if (role === "student") {
      window.location.href = "student-dashboard.html";
    } else if (role === "faculty") {
      window.location.href = "faculty-dashboard.html";
    } else if (role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Please select a role!");
    }
  });
}
