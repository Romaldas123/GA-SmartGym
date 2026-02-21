// ============================
// GA SmartGym - Chatten JS
// ============================

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Skicka meddelande
function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    // Skapa nytt meddelande
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user");
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);

    // Scrolla ner automatiskt
    chatBox.scrollTop = chatBox.scrollHeight;

    chatInput.value = "";

    // Simulera AI-svar efter 500ms
    setTimeout(() => {
        const botDiv = document.createElement("div");
        botDiv.classList.add("message", "bot");
        botDiv.textContent = "AI: " + text.split("").reverse().join(""); // exempel-svar, reverserar text
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
}

// Klick på skicka-knappen
sendBtn.addEventListener("click", sendMessage);

// Enter-tangent skickar meddelande
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});
