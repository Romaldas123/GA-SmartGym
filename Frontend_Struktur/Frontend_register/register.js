document.addEventListener("DOMContentLoaded", () => {
  const registerTab = document.getElementById("registerTab");
  const loginTab = document.getElementById("loginTab");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  const popupOverlay = document.getElementById("popupOverlay");
  const popupTitle = document.getElementById("popupTitle");
  const popupMessage = document.getElementById("popupMessage");
  const closePopup = document.getElementById("closePopup");

  // Växla formulär
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

  // Popup funktion
  function showPopup(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupOverlay.classList.add("active");
  }

  closePopup.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });

  // Stoppa vanlig submit
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(registerForm);

    fetch("../../Backend_Struktur/register.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        showPopup("E-post upptagen", data.message);
      } else if (data.status === "success") {
        showPopup("Konto skapat!", "Ditt konto har registrerats.");
        registerForm.reset();
      }
    })
    .catch(() => {
      showPopup("Fel", "Något gick fel. Försök igen.");
    });
  });
});