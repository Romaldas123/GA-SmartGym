// ============================
// GA SmartGym - STRUKTUR / Startsida JS
// ============================

document.addEventListener("DOMContentLoaded", () => {
  
  // Exempel: klick på snabbknappar loggar till console
  const quickLinks = document.querySelectorAll(".quick-links .nav-link");
  
  quickLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      console.log("Klickade på snabbknapp:", link.textContent);
      // Här kan du lägga till mer funktionalitet t.ex. load content dynamically
    });
  });

  // Ev. framtida startsida-funktioner kan läggas här
});
