// ============================
// GA SmartGym - Schema JS
// ============================

// Schema data (same as PHP)
const workouts = {
    "Måndag": {
        "title": "Bröst & Triceps",
        "emoji": "💪",
        "exercises": [
            { "name": "Bänkpress", "sets": "4x8", "intensity": "Hög" },
            { "name": "Lutande bänkpress", "sets": "3x10", "intensity": "Medel" },
            { "name": "Dips", "sets": "3x8", "intensity": "Hög" },
            { "name": "Triceps Pushdowns", "sets": "3x12", "intensity": "Medel" },
            { "name": "Fluguppgång", "sets": "3x10", "intensity": "Låg" }
        ],
        "duration": "60 min",
        "difficulty": "Hög"
    },
    "Tisdag": {
        "title": "Rygg & Biceps",
        "emoji": "🔙",
        "exercises": [
            { "name": "Marklyft", "sets": "4x5", "intensity": "Mycket hög" },
            { "name": "Pullups", "sets": "4x8", "intensity": "Hög" },
            { "name": "Barbellrow", "sets": "4x8", "intensity": "Hög" },
            { "name": "Biceps Curls", "sets": "3x10", "intensity": "Medel" },
            { "name": "Face Pulls", "sets": "3x15", "intensity": "Låg" }
        ],
        "duration": "70 min",
        "difficulty": "Mycket hög"
    },
    "Onsdag": {
        "title": "Vila eller lätt Cardio",
        "emoji": "🧘",
        "exercises": [
            { "name": "Jogging eller cykling", "sets": "20-30 min", "intensity": "Låg" },
            { "name": "Stretching", "sets": "10 min", "intensity": "Låg" },
            { "name": "Yoga", "sets": "Optional", "intensity": "Låg" }
        ],
        "duration": "30-40 min",
        "difficulty": "Låg"
    },
    "Torsdag": {
        "title": "Ben",
        "emoji": "🦵",
        "exercises": [
            { "name": "Squats", "sets": "4x6", "intensity": "Mycket hög" },
            { "name": "Benpress", "sets": "4x8", "intensity": "Hög" },
            { "name": "Utfall", "sets": "3x10", "intensity": "Medel" },
            { "name": "Leg Curls", "sets": "3x12", "intensity": "Medel" },
            { "name": "Calf Raises", "sets": "3x15", "intensity": "Låg" }
        ],
        "duration": "75 min",
        "difficulty": "Mycket hög"
    },
    "Fredag": {
        "title": "Axlar & Core",
        "emoji": "💥",
        "exercises": [
            { "name": "Militärpress", "sets": "4x8", "intensity": "Hög" },
            { "name": "Lateral Raises", "sets": "3x12", "intensity": "Medel" },
            { "name": "Plankan", "sets": "3x60s", "intensity": "Medel" },
            { "name": "Pallid Raises", "sets": "3x12", "intensity": "Medel" },
            { "name": "Ab Wheel", "sets": "3x10", "intensity": "Hög" }
        ],
        "duration": "60 min",
        "difficulty": "Hög"
    },
    "Lördag": {
        "title": "Aktivt Vila",
        "emoji": "🚴",
        "exercises": [
            { "name": "Promenad", "sets": "45 min", "intensity": "Låg" },
            { "name": "Lätt stretching", "sets": "15 min", "intensity": "Låg" }
        ],
        "duration": "60 min",
        "difficulty": "Låg"
    },
    "Söndag": {
        "title": "Vilodag",
        "emoji": "😴",
        "exercises": [
            { "name": "Fullständig vila", "sets": "Hela dagen", "intensity": "Ingen" }
        ],
        "duration": "0 min",
        "difficulty": "Ingen"
    }
};

// Get elements
const buttons = document.querySelectorAll(".day-btn");
const dayContent = document.getElementById("dayContent");

// Function to get intensity color class
function getIntensityClass(intensity) {
    switch(intensity) {
        case "Låg":
            return "intensity-low";
        case "Medel":
            return "intensity-medium";
        case "Hög":
            return "intensity-high";
        case "Mycket hög":
            return "intensity-very-high";
        default:
            return "";
    }
}

// Function to render workout content
function renderWorkout(day) {
    const workout = workouts[day];
    
    if (!workout) {
        dayContent.innerHTML = "<p>Ingen träning planerad för denna dag</p>";
        return;
    }

    let exercisesHTML = workout.exercises.map(exercise => `
        <div class="exercise">
            <div class="exercise-info">
                <h3>${exercise.name}</h3>
                <div class="exercise-details">
                    <span class="exercise-detail">🔢 ${exercise.sets}</span>
                    <span class="exercise-detail ${getIntensityClass(exercise.intensity)}">⚡ ${exercise.intensity}</span>
                </div>
            </div>
            <div class="exercise-sets">${exercise.sets}</div>
        </div>
    `).join('');

    dayContent.innerHTML = `
        <div class="workout-header">
            <div class="workout-title">
                <span class="workout-emoji">${workout.emoji}</span>
                <h2>${workout.title}</h2>
            </div>
            <div class="workout-meta">
                <div class="meta-item">
                    <span class="meta-label">Varaktighet</span>
                    <span class="meta-value">${workout.duration}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Svårighet</span>
                    <span class="meta-value">${workout.difficulty}</span>
                </div>
            </div>
        </div>
        <div class="exercises-list">
            ${exercisesHTML}
        </div>
    `;
}

// Add event listeners to buttons
buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        // Remove active class from all buttons
        buttons.forEach(btn => btn.classList.remove("active"));
        
        // Add active class to clicked button
        button.classList.add("active");
        
        // Render workout
        const day = button.getAttribute("data-day");
        renderWorkout(day);
    });
});

// Load first day on page load
window.addEventListener("DOMContentLoaded", () => {
    if (buttons.length > 0) {
        buttons[0].classList.add("active");
        const firstDay = buttons[0].getAttribute("data-day");
        renderWorkout(firstDay);
    }
});