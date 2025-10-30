document.addEventListener("DOMContentLoaded", () => {
  const registerTab = document.getElementById("registerTab");
  const loginTab = document.getElementById("loginTab");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  // Växla till registrering
  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Växla till inloggning
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  });
});
