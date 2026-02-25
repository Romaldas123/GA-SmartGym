// ============================
// GA SmartGym - Schema JS
// ============================

const buttons = document.querySelectorAll(".day-btn");
const dayContent = document.getElementById("dayContent");

const workouts = {
    "Måndag": "Bröst & Triceps - Bänkpress, Dips, Pushdowns",
    "Tisdag": "Rygg & Biceps - Marklyft, Pullups, Curls",
    "Onsdag": "Vila eller lätt cardio",
    "Torsdag": "Ben - Squats, Benpress, Utfall",
    "Fredag": "Axlar & Core - Militärpress, Plankan"
};

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const day = button.getAttribute("data-day");
        dayContent.textContent = workouts[day];
    });
});
