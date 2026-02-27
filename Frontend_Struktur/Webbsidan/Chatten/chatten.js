// ============================
// GA SmartGym - AI Coach
// ============================

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// AI RESPONSES DATABASE
const aiResponses = {
    // TRÄNING
    "träning": {
        keywords: ["träning", "träna", "workout", "övning", "exercise"],
        responses: [
            "💪 Bra att du vill träna! Vilken typ av träning är du intresserad av? Vi erbjuder program för:\n• Styrketräning (Bröst, Rygg, Ben)\n• Cardio och kondition\n• HIIT och intervallträning",
            "🏋️ Träning är nyckeln till resultat! Träna 3-5 gånger per vecka för bäst resultat. Vilket område vill du fokusera på?"
        ]
    },
    "bröst": {
        keywords: ["bröst", "chest", "bänkpress", "press"],
        responses: [
            "💪 Bra övningar för bröst:\n• Bänkpress (4x8 reps)\n• Lutande bänkpress (3x10)\n• Dips (3x8)\n• Fluguppgång (3x10)\nVila 48h innan nästa träning!"
        ]
    },
    "rygg": {
        keywords: ["rygg", "back", "marklyft", "pullup", "row"],
        responses: [
            "🔙 Ryggträning är супер viktig för balans:\n• Marklyft (4x5 reps) - MYCKET TUNG\n• Pullups (4x8)\n• Barbellrow (4x8)\n• Face pulls (3x15)\nStark rygg = bättre postur!"
        ]
    },
    "ben": {
        keywords: ["ben", "legs", "squats", "benpress", "utfall"],
        responses: [
            "🦵 Benträning är den hårdaste men mest effektiva:\n• Squats (4x6 reps) - MYCKET TUNG\n• Benpress (4x8)\n• Utfall (3x10)\n• Leg curls (3x12)\n• Calf raises (3x15)\nStarka ben = högre metabolism!"
        ]
    },
    "axlar": {
        keywords: ["axlar", "shoulders", "militär", "press"],
        responses: [
            "💥 Axelträning för bred skuldra:\n• Militärpress (4x8 reps)\n• Lateral raises (3x12)\n• Plankan (3x60s)\n• Pallid raises (3x12)\n• Ab wheel (3x10)\nRunda axlar ser bra ut!"
        ]
    },

    // KOST & NÄRING
    "kost": {
        keywords: ["kost", "mat", "äta", "mat", "nutrition", "diet"],
        responses: [
            "🥗 Näring är 70% av resultatet!\nGrundregler:\n• Ät tillräckligt protein (1.6-2.2g per kg)\n• Ät i kalorisk överskud för muskelbygge\n• Drick mycket vatten (2-3L per dag)\nVilket är ditt mål?"
        ]
    },
    "protein": {
        keywords: ["protein", "ägg", "kyckling", "fisk"],
        responses: [
            "🍗 Bästa proteinkilllor:\n• Kyckling (27g protein per 100g)\n• Fisk (20-25g per 100g)\n• Ägg (6g per ägg)\n• Mjölk & yogurt (3-8g per 100g)\n• Bönor & linser (10-12g per 100g)\nÄt dessa dagligen!"
        ]
    },
    "vatten": {
        keywords: ["vatten", "hydration", "dricka", "vätskor"],
        responses: [
            "💧 Vatten är SUPER viktigt!\n• Drick minst 2-3 liter per dag\n• Under träning: drick extra\n• Gul urin = du behöver dricka mer\n• Klar urin = bra hydration\nDrick vatten nu! 💪"
        ]
    },

    // ÅTERHÄMTNING
    "återhämtning": {
        keywords: ["återhämtning", "recovery", "vila", "sömn", "rest"],
        responses: [
            "😴 Återhämtning är när musklerna växer!\n• Sov 7-9 timmar per natt\n• Vilodagar är viktiga (1-2 per vecka)\n• Sträck och yoga hjälper\n• Massage eller foam rolling\nInte överträna dig själv!"
        ]
    },
    "sömn": {
        keywords: ["sömn", "sleep", "vila", "trötthet"],
        responses: [
            "😴 Sömn = muskelväxt!\n• 7-9 timmar är optimalt\n• Samma sömnschema varje dag\n• Mörkare sovrum\n• Ingen skärm 30min före sömn\nGod sömn = bättre resultat!"
        ]
    },

    // MOTIVATION & PSYKOLOGI
    "motivation": {
        keywords: ["motivation", "motivera", "inspiration", "ge upp", "svårt"],
        responses: [
            "🔥 Du klarar det! Här är tips:\n• Sätt realistiska mål\n• Fira små framsteg\n• Träna med vänner\n• Se resultaten på foto\n• Kom ihåg varför du började!\nDu är STARKARE än du tror! 💪"
        ]
    },
    "mål": {
        keywords: ["mål", "goal", "resultat", "progress"],
        responses: [
            "🎯 Smart mål:\n• SMART-regel: Specifik, Mätbar, Uppnåelig, Relevant, Tidsbestämd\n• Exempel: 'Lyfta 100kg squats på 3 månader'\n• Mät progress veckovis\n• Justera programmet baserat på resultat\nVad är ditt mål?"
        ]
    },

    // SKADOR & PROBLEM
    "skada": {
        keywords: ["skada", "injury", "ont", "smärta", "vet inte"],
        responses: [
            "⚠️ Skador är allvarliga:\n• Applicera RICE: Rest, Ice, Compression, Elevation\n• Se en fysioterapeut\n• Inte träna igenom skada\n• Prevention > Kur\n\nOm det gör ont - SLUTA träna och se läkare!"
        ]
    },

    // ALLMÄN HJÄLP
    "hjälp": {
        keywords: ["hjälp", "vad kan du", "how", "help", "hur"],
        responses: [
            "🤖 Jag kan hjälpa dig med:\n• 💪 Träningsprogram och övningar\n• 🥗 Kostrådgivning och näring\n• 🔥 Motivering och tips\n• 😴 Återhämtning och skador\n\nFråga något specifikt så hjälper jag!"
        ]
    }
};

// FALLBACK RESPONSES
const fallbackResponses = [
    "Intressant! Kan du förklara mer? Jag är här för att hjälpa med träning, kost och motivation! 💪",
    "Bra fråga! Relaterar detta till träning eller kost? 🤔",
    "Jag är specialiserad på träning och nutrition. Kan du omformulera din fråga? 📝",
    "Säg mig mer! Vad exakt vill du veta om träning eller diet? 🏋️"
];

// FIND AI RESPONSE
function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    for (const key in aiResponses) {
        const response = aiResponses[key];
        const hasKeyword = response.keywords.some(keyword => 
            lowerMessage.includes(keyword)
        );

        if (hasKeyword) {
            return response.responses[Math.floor(Math.random() * response.responses.length)];
        }
    }

    // Fallback if no match
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// SEND MESSAGE
function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    // USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.classList.add("message", "user");
    userDiv.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
    chatBox.appendChild(userDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = "";
    chatInput.focus();

    // TYPING INDICATOR
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot");
    typingDiv.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">
            <div class="typing">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // AI RESPONSE (after delay)
    setTimeout(() => {
        typingDiv.remove();

        const botDiv = document.createElement("div");
        botDiv.classList.add("message", "bot");
        const response = getAIResponse(text);
        
        botDiv.innerHTML = `
            <div class="bot-avatar">🤖</div>
            <div class="message-content">${escapeHtml(response)}</div>
        `;
        
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000 + Math.random() * 500); // Random delay 1-1.5s
}

// ESCAPE HTML (for security)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// EVENT LISTENERS
sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Focus on load
window.addEventListener("DOMContentLoaded", () => {
    chatInput.focus();
});