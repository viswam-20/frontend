// =======================
// Card 3D Tilt + Input/Button Parallax
// =======================
const card = document.querySelector(".glass-effect");

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 8;
  const rotateY = ((x - centerX) / centerX) * 8;

  // Card tilt
  card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

  // Input/Button subtle parallax
  const inputs = card.querySelectorAll(
    ".form-control, .form-select, .stylish-btn"
  );
  inputs.forEach((el) => {
    el.style.transform = `translateX(${(x - centerX) / 50}px) translateY(${
      (y - centerY) / 50
    }px)`;
  });
});

card.addEventListener("mouseleave", () => {
  card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  const inputs = card.querySelectorAll(
    ".form-control, .form-select, .stylish-btn"
  );
  inputs.forEach((el) => {
    el.style.transform = "translateX(0) translateY(0)";
  });
});

// =======================
// Login/Signup Role Redirect
// =======================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const role = document.getElementById("roleSelect").value;
    if (role === "student") {
      window.location.href = "/student-dashboard.html";
    } else if (role === "faculty") {
      window.location.href = "/faculty-dashboard.html";
    } else if (role === "admin") {
      window.location.href = "/admin-dashboard.html";
    } else {
      alert("Please select a role!");
    }
  });
}
