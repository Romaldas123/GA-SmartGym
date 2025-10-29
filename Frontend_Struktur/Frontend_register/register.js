
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
});

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
});

// Registrering
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Fyll i alla fält.");
    return;
  }

  localStorage.setItem("smartgym_user", JSON.stringify({ name, email }));

  window.location.href = "../Frontend_fragor/fragor.html";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Ange e-post och lösenord.");
    return;
  }

  localStorage.setItem("smartgym_user", JSON.stringify({ email }));

  window.location.href = "../Frontend_fragor/fragor.html";
});
