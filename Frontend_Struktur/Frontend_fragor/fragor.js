const questions = [
  {type:"number", key:"age", label:"Ålder", placeholder:"Skriv din ålder"},
  {type:"number", key:"weight", label:"Vikt (kg)", placeholder:"t.ex. 72"},
  {type:"radio", key:"gender", label:"Kön", options:["Man","Kvinna","Annat","Vill inte uppge"]},
  {type:"select", key:"lifestyle", label:"Livsstil", options:["Mycket aktiv","Måttligt aktiv","Stillasittande","Växlande"]},
  {type:"checkbox", key:"availability", label:"Tillgänglighet / utrustning", options:["Gym med maskiner","Fria vikter","Hantlar","Bara kroppsvikt","Minibands","Konditionsmaskiner"]},
  {type:"alert", key:"ai_alert", message:"AI vill nu ha mer detaljerad information. Svara noggrant på följande frågor."},
  {type:"radio", key:"experience_level", label:"Träningserfarenhet", options:["Ingen erfarenhet","< 6 månader","6 månader – 2 år","2–5 år","5+ år"]},
  {type:"text", key:"experience_details", label:"Beskriv erfaranheter mer detaljerat (valfritt)", placeholder:"Ex: Jag har tränat styrketräning 3 gånger/vecka i 2 år...", optional:true},
  {type:"radio", key:"health_status", label:"Hälsa", options:["Nej","Ja, mindre skada","Ja, större skada","Medicinskt tillstånd som påverkar träning"]},
  {type:"text", key:"health_details", label:"Beskriv häsla mer detaljerat (valfritt)", placeholder:"Ex: Jag har ont i vänster knä vid löpning...", optional:true},
  {type:"checkbox", key:"main_goal", label:"Träningsmål (välj flera)", options:["Bygga muskler","Förbättra kondition","Bli starkare","Förbättra rörlighet"]},
  {type:"text", key:"goal_details", label:"Beskriv målet mer i detalj (valfritt)", placeholder:"Ex: Jag vill bygga mer överkroppsmuskler...", optional:true}
];

let current = 0;
const answers = {};

const container = document.getElementById("question-container");
const output = document.getElementById("output");
const answersOut = document.getElementById("answersOut");

// AI-notis container
let aiNotice = document.createElement("div");
aiNotice.id = "ai-notice";
aiNotice.className = "ai-notice hidden";
document.body.appendChild(aiNotice);

function showQuestion() {
  if(current >= questions.length){
    finishQuestions();
    return;
  }

  const q = questions[current];

  if(q.type === "alert"){
    aiNotice.innerHTML = `<span>AI vill ha lite mer detaljerade svar, försök att svara så detaljerat som möjligt.</span> <button id="aiOkBtn">Jag förstår</button>`;
    aiNotice.classList.remove("hidden");

    document.getElementById("aiOkBtn").addEventListener("click", ()=>{
      aiNotice.classList.add("hidden");
      current++;
      showQuestion();
    });
    return;
  }

  container.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.style.opacity = 0;
  panel.style.transform = "translateY(20px)";

  const label = document.createElement("label");
  label.textContent = q.label;
  panel.appendChild(label);

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert hidden";
  alertDiv.textContent = "Vänligen fyll i eller välj något!";
  panel.appendChild(alertDiv);

  let input;

  if(q.type === "text" || q.type === "number"){
    input = document.createElement("input");
    input.type = q.type;
    input.placeholder = q.placeholder || "";
    panel.appendChild(input);
  } else if(q.type === "select"){
    input = document.createElement("select");
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "-- Välj --";
    input.appendChild(empty);
    q.options.forEach(opt=>{
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      input.appendChild(o);
    });
    panel.appendChild(input);
  } else if(q.type === "radio" || q.type === "checkbox"){
    input = document.createElement("div");
    input.className = q.type === "radio" ? "radios" : "checkboxes";
    q.options.forEach(opt=>{
      const wrapper = document.createElement("label");
      const el = document.createElement("input");
      el.type = q.type;
      el.name = q.key;
      el.value = opt;
      wrapper.appendChild(el);
      wrapper.appendChild(document.createTextNode(opt));
      input.appendChild(wrapper);
    });
    panel.appendChild(input);
  }

  const btn = document.createElement("button");
  btn.textContent = "Nästa";
  btn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(!validateAnswer(q,input)){
      alertDiv.classList.remove("hidden");
      return;
    } else {
      alertDiv.classList.add("hidden");
    }

    saveAnswer(q,input);
    panel.style.opacity = 0;
    panel.style.transform = "translateY(-20px)";
    setTimeout(()=>{
      current++;
      showQuestion();
    },300);
  });
  panel.appendChild(btn);

  container.appendChild(panel);

  setTimeout(()=>{
    panel.style.opacity = 1;
    panel.style.transform = "translateY(0)";
  },50);
}

// Validering
function validateAnswer(q,input){
  if(q.type==="text"){
    if(q.optional) return true;
    return input.value.trim() !== "";
  } else if(q.type==="number" || q.type==="select"){
    return input.value.trim() !== "";
  } else if(q.type==="radio"){
    return input.querySelector('input[type="radio"]:checked') !== null;
  } else if(q.type==="checkbox"){
    return input.querySelectorAll('input[type="checkbox"]:checked').length > 0;
  }
  return true;
}

// Spara svar
function saveAnswer(q,input){
  if(q.type==="text" || q.type==="number" || q.type==="select"){
    answers[q.key] = input.value;
  } else if(q.type==="radio"){
    const selected = input.querySelector('input[type="radio"]:checked');
    answers[q.key] = selected ? selected.value : null;
  } else if(q.type==="checkbox"){
    const selected = Array.from(input.querySelectorAll('input[type="checkbox"]:checked')).map(c=>c.value);
    answers[q.key] = selected;
  }
}

// Visa alla svar och skicka till PHP med vanlig POST
function finishQuestions(){
  container.classList.add("hidden");
  output.classList.remove("hidden");

  answersOut.innerHTML = "";
  for(const key in answers){
    const div = document.createElement("div");
    div.textContent = `${key}: ${Array.isArray(answers[key]) ? answers[key].join(", ") : answers[key]}`;
    answersOut.appendChild(div);
  }

  // Skicka data till PHP med FormData
  const formData = new FormData();
  for(const key in answers){
    if(Array.isArray(answers[key])){
      answers[key].forEach(val => formData.append(key+'[]', val));
    } else {
      formData.append(key, answers[key]);
    }
  }

  fetch('fragor.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if(data.status === "success"){
      console.log("Svar sparade i DB!");
    } else {
      console.error("Fel vid sparande: ", data.message);
      alert("Kunde inte spara svaren: " + data.message);
    }
  })
  .catch(err => {
    console.error("Fetch error:", err);
    alert("Något gick fel vid sparande!");
  });
}

showQuestion();
