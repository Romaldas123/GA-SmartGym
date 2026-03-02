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

  // REGISTRERING - Skickar användaren till onboarding-frågorna
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
        showPopup("Konto skapat!", "Välkommen! Nu ska vi bara ställa in din profil...");
        
        registerForm.reset();

        // Skickar till fragor.html för nya användare
        setTimeout(() => {
          window.location.href = "../Frontend_fragor/fragor.html"; 
        }, 2000);
      }
    })
    .catch(err => {
      console.error("Fel:", err);
      showPopup("Systemfel", "Kunde inte kontakta servern.");
    });
  });

  // INLOGGNING - Skickar användaren direkt till webbsidan (struktur.php)
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(loginForm);

    fetch("../../Backend_Struktur/login.php", {
      method: "POST",
      body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error("Serverfel");
        return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        showPopup("Inloggad!", "Välkommen nigga tillbaka, skickar dig till din sida...");
        
        // Här ändrar vi till sökvägen för din huvudsida
        setTimeout(() => {
          window.location.href = "../Webbsidan/Header/header.html";
        }, 1500);

      } else {
        showPopup("Fel", data.message || "Fel e-post eller lösenord.");
      }
    })
    .catch(err => {
      console.error("Inloggningsfel:", err);
      showPopup("Fel", "Inloggningen misslyckades. Kontrollera din anslutning eller login.php.");
    });
  });
});