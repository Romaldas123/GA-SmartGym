document.addEventListener("DOMContentLoaded", () => {
  const registerTab = document.getElementById("registerTab");
  const loginTab = document.getElementById("loginTab");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  const popupOverlay = document.getElementById("popupOverlay");
  const popupTitle = document.getElementById("popupTitle");
  const popupMessage = document.getElementById("popupMessage");
  const closePopup = document.getElementById("closePopup");

  // Växla flikar
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

  function showPopup(title, message) {
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    popupOverlay.classList.add("active");
  }

  closePopup.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });

  // REGISTRERING
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
        showPopup("Ojsan!", data.message);
      } else if (data.status === "success") {
        showPopup("Konto skapat!", "Skickar dig vidare till frågorna...");
        
        registerForm.reset();

        // VIKTIGT: Här ändrar vi sökvägen baserat på din mappstruktur
        // ../ backar ut en mapp, sedan går vi in i Frontend_fragor
        setTimeout(() => {
          window.location.href = "../Frontend_fragor/fragor.html"; 
        }, 5000);
      }
    })
    .catch(err => {
      console.error("Fel:", err);
      showPopup("Systemfel", "Kunde inte kontakta servern.");
    });
  });

  // INLOGGNING
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(loginForm);

    fetch("../../Backend_Struktur/login.php", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        window.location.href = "../Frontend_fragor/fragor.html";
      } else {
        showPopup("Fel", data.message);
      }
    })
    .catch(() => showPopup("Fel", "Inloggningen misslyckades."));
  });
});