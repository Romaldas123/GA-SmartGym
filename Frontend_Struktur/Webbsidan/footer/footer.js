// ============================
// GA SmartGym - FOOTER JS
// ============================

// Just nu inga avancerade funktioner, men här kan vi lägga till:
// ex: dynamisk årtal, scroll-to-top knapp, interaktiva sociala ikoner etc.

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.querySelector(".site-footer p span");
  if(yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
