// Onboarding Questions
const questions = [
    "What is your name?",
    "How old are you?",
    "What is your gender? (Male/Female/Other)",
    "What is your weight (kg)?",
    "What is your height (cm)?",
    "What is your activity level? (Sedentary, Moderate, Active)",
    "What are your fitness goals? (Strength, Fat Loss, Cardio, Flexibility)"
];

let currentQuestion = 0;
const answers = [];

const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const onboarding = document.getElementById('onboarding');
const dashboard = document.getElementById('dashboard');
const workoutPlan = document.getElementById('workout-plan');

function loadQuestion() {
    questionText.textContent = questions[currentQuestion];
    answerInput.value = "";
}

nextBtn.addEventListener('click', () => {
    const answer = answerInput.value.trim();
    if(answer === "") return;

    answers.push(answer);
    currentQuestion++;
    progressFill.style.width = ((currentQuestion / questions.length) * 100) + "%";

    if(currentQuestion < questions.length) {
        loadQuestion();
    } else {
        // Finish onboarding
        onboarding.classList.add('hidden');
        dashboard.classList.remove('hidden');
        generateWorkoutPlan();
    }
});

function generateWorkoutPlan() {
    // Simple simulated AI logic for demonstration
    workoutPlan.innerHTML = `
        <h2>${answers[0]}'s Personalized Workout Plan</h2>
        <p><strong>Goal:</strong> ${answers[6]}</p>
        <p><strong>Activity Level:</strong> ${answers[5]}</p>
        <ul>
            <li>Day 1: Full Body Strength</li>
            <li>Day 2: Cardio + Core</li>
            <li>Day 3: Active Recovery / Flexibility</li>
            <li>Day 4: Upper Body Strength</li>
            <li>Day 5: Lower Body Strength</li>
        </ul>
        <p>Track your progress and chat with your AI trainer below!</p>
    `;
}

// AI Trainer Chat (simulated)
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if(msg === "") return;

    addMessage(msg, 'user');
    chatInput.value = "";

    // Simulated AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(msg);
        addMessage(aiResponse, 'ai');
    }, 800);
});

function addMessage(msg, type) {
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.classList.add(type === 'user' ? 'user-msg' : 'ai-msg');
    div.textContent = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple AI response simulator
function generateAIResponse(msg) {
    const lower = msg.toLowerCase();
    if(lower.includes("exercise") || lower.includes("workout")) {
        return "I recommend a mix of strength and cardio exercises tailored to your goals.";
    } else if(lower.includes("diet") || lower.includes("nutrition")) {
        return "Make sure to eat balanced meals rich in protein and complex carbs.";
    } else if(lower.includes("rest") || lower.includes("recovery")) {
        return "Recovery is crucial! Sleep 7-9 hours and include stretching sessions.";
    } else {
        return "Great question! Keep training consistently and I will guide you along the way.";
    }
}

// Initialize first question
loadQuestion();
