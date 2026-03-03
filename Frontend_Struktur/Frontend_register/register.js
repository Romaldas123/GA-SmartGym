document.addEventListener("DOMContentLoaded", () => {
  const registerTab = document.getElementById("registerTab");
  const loginTab = document.getElementById("loginTab");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const footerNote = document.getElementById("footerNote");

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
    footerNote.textContent = "Genom att fortsätta går du vidare till SmartGyms onboarding-frågor.";
  });

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    footerNote.textContent = "Genom att fortsätta går du vidare till din SmartGym webbsida.";
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
        // ÄNDRAT: Nytt meddelande för att instruera om Gmail-verifiering
        showPopup("Konto skapat!", "Vi har skickat en verifieringslänk till din Gmail. Klicka på den för att aktivera ditt konto!");
        
        registerForm.reset();

        // ÄNDRAT: Istället för att skicka till fragor.html, växla till login-fliken efter 4 sekunder
        setTimeout(() => {
          loginTab.click(); 
          popupOverlay.classList.remove("active");
        }, 4000); 
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
    .then(response => {
        if (!response.ok) throw new Error("Serverfel");
        return response.json();
    })
    .then(data => {
      if (data.status === "success") {
        showPopup("Inloggad!", "Välkommen tillbaka, skickar dig till din sida...");
        
        setTimeout(() => {
          window.location.href = "../Webbsidan/struktur/struktur.php";
        }, 2000);

      } else {
        // Här kommer nu även felmeddelandet "Du måste verifiera din e-post..." att visas om is_verified är 0
        showPopup("Fel", data.message || "Fel e-post eller lösenord.");
      }
    })
    .catch(err => {
      console.error("Inloggningsfel:", err);
      showPopup("Fel", "Inloggningen misslyckades. Kontrollera din anslutning.");
    });
  });
});