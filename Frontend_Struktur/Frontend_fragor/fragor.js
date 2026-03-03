const questions = [
  {type:"number", key:"age", label:"Ålder", placeholder:"Skriv din ålder"},
  {type:"number", key:"weight", label:"Vikt (kg)", placeholder:"t.ex. 72"},
  {type:"radio", key:"gender", label:"Kön", options:["Man","Kvinna","Annat","Vill inte uppge"]},
  {type:"select", key:"lifestyle", label:"Livsstil", options:["Mycket aktiv","Måttligt aktiv","Stillasittande","Växlande"]},
  {type:"checkbox", key:"availability", label:"Tillgänglighet / utrustning", options:["Gym med maskiner","Fria vikter","Hantlar","Bara kroppsvikt","Minibands","Konditionsmaskiner"]},
  {type:"alert", key:"ai_alert", message:"AI vill nu ha mer detaljerad information. Svara noggrant på följande frågor."},
  {type:"radio", key:"experience_level", label:"Träningserfarenhet", options:["Ingen erfarenhet","< 6 månader","6 månader – 2 år","2–5 år","5+ år"]},
  {type:"text", key:"experience_details", label:"Beskriv erfarenheter mer detaljerat (valfritt)", placeholder:"Ex: Jag har tränat styrketräning 3 gånger/vecka i 2 år...", optional:true},
  {type:"radio", key:"health_status", label:"Skador?", options:["Nej","Ja, mindre skada","Ja, större skada","Medicinskt tillstånd som påverkar träning"]},
  {type:"text", key:"health_details", label:"Beskriv hälsa mer detaljerat (valfritt)", placeholder:"Ex: Jag har ont i vänster knä vid löpning...", optional:true},
  {type:"checkbox", key:"main_goal", label:"Träningsmål (välj flera)", options:["Bygga muskler","Förbättra kondition","Bli starkare","Förbättra rörlighet"]},
  {type:"text", key:"goal_details", label:"Beskriv målet mer i detalj (valfritt)", placeholder:"Ex: Jag vill bygga mer överkroppsmuskler...", optional:true}
];

let current = 0;
const answers = {};
const container = document.getElementById("question-container");

function showQuestion() {
  if (current >= questions.length) {
    finishQuestions();
    return;
  }

  const q = questions[current];

  if (q.type === "alert") {
    container.innerHTML = `
      <div class="panel" style="text-align:center;">
        <div style="font-size: 2rem; margin-bottom: 10px;">🤖</div>
        <p style="margin-bottom: 20px;">${q.message}</p>
        <button id="aiOkBtn">Jag förstår</button>
      </div>
    `;
    document.getElementById("aiOkBtn").addEventListener("click", () => {
      current++;
      showQuestion();
    });
    return;
  }

  container.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "panel";

  const label = document.createElement("label");
  label.textContent = q.label;
  panel.appendChild(label);

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert hidden";
  alertDiv.textContent = "Vänligen fyll i ett giltigt värde (måste vara över 0)!";
  panel.appendChild(alertDiv);

  let input;

  if (q.type === "text" || q.type === "number") {
    input = document.createElement("input");
    input.type = q.type;
    input.placeholder = q.placeholder || "";
    
    // --- FIX FÖR NEGATIV ÅLDER/VIKT ---
    if (q.type === "number") {
      input.min = "1";
      // Denna rad rensar fältet om användaren skriver in "-" eller "0"
      input.oninput = function() {
        if (this.value !== "" && parseInt(this.value) <= 0) {
          this.value = "";
        }
      };
    }
    // ----------------------------------
    
    panel.appendChild(input);
  } else if (q.type === "select") {
    input = document.createElement("select");
    const empty = document.createElement("option");
    empty.value = ""; empty.textContent = "-- Välj --";
    input.appendChild(empty);
    q.options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt; o.textContent = opt;
      input.appendChild(o);
    });
    panel.appendChild(input);
  } else if (q.type === "radio" || q.type === "checkbox") {
    input = document.createElement("div");
    input.className = q.type + "es";
    q.options.forEach(opt => {
      const wrapper = document.createElement("label");
      const el = document.createElement("input");
      el.type = q.type; el.name = q.key; el.value = opt;
      wrapper.appendChild(el);
      wrapper.appendChild(document.createTextNode(" " + opt));
      input.appendChild(wrapper);
    });
    panel.appendChild(input);
  }

  const btn = document.createElement("button");
  btn.textContent = "Nästa";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateAnswer(q, input)) {
      alertDiv.classList.remove("hidden");
      return;
    }
    saveAnswer(q, input);
    current++;
    showQuestion();
  });

  panel.appendChild(btn);
  container.appendChild(panel);
}

function validateAnswer(q, input) {
  if (q.type === "text" && q.optional) return true;
  
  // --- FIX FÖR VALIDERING ---
  // Om det är ett nummer, se till att det inte är tomt OCH över 0
  if (q.type === "number") {
    const val = parseInt(input.value);
    return !isNaN(val) && val > 0;
  }
  // ---------------------------

  if (q.type === "text" || q.type === "select") return input.value.trim() !== "";
  if (q.type === "radio") return input.querySelector('input[type="radio"]:checked') !== null;
  if (q.type === "checkbox") return input.querySelectorAll('input[type="checkbox"]:checked').length > 0;
  return true;
}

function saveAnswer(q, input) {
  if (q.type === "text" || q.type === "number" || q.type === "select") {
    answers[q.key] = input.value;
  } else if (q.type === "radio") {
    const s = input.querySelector('input[type="radio"]:checked');
    answers[q.key] = s ? s.value : null;
  } else if (q.type === "checkbox") {
    answers[q.key] = Array.from(input.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value);
  }
}

function finishQuestions() {
  container.innerHTML = `
    <div class="panel" style="text-align:center; padding: 40px;">
      <div class="ai-loader" style="font-size: 3rem; margin-bottom: 20px;">🤖</div>
      <h2>Tack för dina svar!</h2>
      <p style="margin: 15px 0; color: #94a3b8;">Vänta en sekund, AI håller på att kolla igenom dina svar för att skapa ditt schema...</p>
      <div class="spinner" style="border: 4px solid rgba(255,255,255,0.1); border-left-color: #22c55e; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto;"></div>
    </div>
  `;

  const style = document.createElement('style');
  style.innerHTML = ` @keyframes spin { to { transform: rotate(360deg); } } `;
  document.head.appendChild(style);

  const formData = new FormData();
  for (const key in answers) {
    if (Array.isArray(answers[key])) {
      answers[key].forEach(val => formData.append(key + '[]', val));
    } else {
      formData.append(key, answers[key]);
    }
  }

  fetch('../../Backend_Struktur/fragor.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(text => {
    setTimeout(() => {
      window.location.href = "http://localhost/GA-SMARTGYM//Frontend_Struktur/Webbsidan/struktur/struktur.php";
    }, 2500);
  })
  .catch(err => {
    window.location.href = "http://localhost/GA-SMARTGYM//Frontend_Struktur/Webbsidan/struktur/struktur.php";
  });
}

showQuestion();