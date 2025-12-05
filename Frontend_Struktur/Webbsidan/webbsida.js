/* ===== SmartGym — App JS (connected, no email) =====
   - Onboarding wizard
   - LocalStorage profile save
   - Plan generation (simple AI-like logic)
   - AI chat (simulated)
   - Export / Reset
   - Small progress chart
*/

/* Utilities */
const qs = (sel, ctx=document) => ctx.querySelector(sel);
const qsa = (sel, ctx=document) => Array.from((ctx||document).querySelectorAll(sel));

/* Panel navigation */
const panels = qsa('.panel');
const navButtons = qsa('.nav-btn');

function showPanel(id) {
  panels.forEach(p => (p.id === id) ? p.classList.add('active') : p.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.focus({preventScroll:true});
  history.replaceState({panel:id}, '', '#'+id);
}

/* Wire nav */
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = (btn.getAttribute('aria-controls') || '').trim();
    if (target) showPanel(target);
    if (btn.id === 'nav-export') exportJSON();
  });
});

/* Handle back/forward */
window.addEventListener('popstate', (ev) => {
  const state = ev.state;
  if (state && state.panel) showPanel(state.panel);
});

/* Start at hash if present */
if (location.hash) {
  const id = location.hash.replace('#','');
  if (document.getElementById(id)) showPanel(id);
}

/* CTA */
qs('#cta-start').addEventListener('click', () => showPanel('onboarding'));
qs('#cta-try').addEventListener('click', () => {
  generateExamplePlan();
  showPanel('dashboard');
});

/* --- Onboarding wizard --- */
const form = qs('#onboard-form');
const steps = qsa('fieldset.step');
const stepsWrap = qs('#steps');

// Build stepper UI
steps.forEach((s, i) => {
  const dot = document.createElement('div');
  dot.className = 'step-dot';
  dot.textContent = (i+1);
  stepsWrap.appendChild(dot);
});

let currentStep = 0;
function showStep(index) {
  steps.forEach((s, i) => s.style.display = (i === index) ? 'block' : 'none');
  currentStep = index;
  qsa('#steps .step-dot').forEach((d, i) => d.style.opacity = (i <= index) ? '1' : '0.45');
}
showStep(0);

/* Step controls (next/prev) */
qsa('.next-btn').forEach(b => b.addEventListener('click', () => {
  if (currentStep < steps.length - 1) showStep(currentStep + 1);
}));
qsa('.prev-btn').forEach(b => b.addEventListener('click', () => {
  const prev = parseInt(b.getAttribute('data-prev'), 10) - 1;
  if (!isNaN(prev)) showStep(prev);
}));

/* Weekday toggle */
qsa('.weekday').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('active')));

/* Form submission -> commit profile and generate plan */
const STORAGE_KEY = 'smartgym_profile_v1';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = collectForm();
  saveProfile(data);
  showPanel('dashboard');
});

/* Collect form data into object */
function collectForm() {
  const data = {};
  const fm = new FormData(form);
  for (const [k, v] of fm.entries()) {
    if (data[k]) {
      if (!Array.isArray(data[k])) data[k] = [data[k]];
      data[k].push(v);
    } else {
      data[k] = v;
    }
  }
  // training days
  const days = qsa('.weekday.active').map(b => b.getAttribute('data-day'));
  data.trainingDays = days;
  return data;
}

/* Save/load profile */
function saveProfile(profile) {
  profile.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  loadProfileToUI(profile);
  generatePlanFromProfile(profile);
  updateStats();
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}

function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* Profile edit handlers */
const profileSave = qs('#profile-save');
const profileCancel = qs('#profile-cancel');

profileSave.addEventListener('click', () => {
  const p = {
    name: qs('#p_name').value || '',
    email: qs('#p_email').value || '',
    age: qs('#p_age').value || '',
    gender: qs('#p_gender').value || '',
    notes: qs('#p_injuries').value || ''
  };
  saveProfile(p);
  showPanel('dashboard');
});
profileCancel.addEventListener('click', () => showPanel('dashboard'));

function loadProfileToUI(profile) {
  if (!profile) return;
  qs('#p_name').value = profile.name || '';
  qs('#p_email').value = profile.email || '';
  qs('#p_age').value = profile.age || '';
  qs('#p_gender').value = profile.gender || '';
  qs('#p_injuries').value = profile.notes || '';
  qs('#dash-title').textContent = (profile.name ? profile.name + "'s workout plan" : 'Your workout plan');
}

/* Edit profile button */
qs('#btn-edit-profile').addEventListener('click', () => {
  const p = loadProfile();
  if (p) showPanel('profile');
  else alert('No profile saved yet. Start onboarding first.');
});

/* --- Plan generation (simple AI simulation) --- */
const planCalendar = qs('#plan-calendar');
let currentPlan = null;

function generatePlanFromProfile(profile) {
  const goal = profile.goal || 'general';
  const experience = profile.experience || 'beginner';
  const days = (profile.trainingDays && profile.trainingDays.length > 0) ? profile.trainingDays : ['mon', 'wed', 'fri'];

  const baseExercises = {
    strength: ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Row'],
    muscle: ['Squat', 'Romanian Deadlift', 'Bench Press', 'Pull-ups', 'Lunges'],
    fatloss: ['Circuit: Kettlebell', 'Burpees', 'Rowing', 'Bike Intervals', 'Jump Rope'],
    endurance: ['Run', 'Tempo Run', 'Bike Intervals', 'Swim', 'Rowing'],
    general: ['Full Body: Squat', 'Push', 'Pull', 'Core', 'Mobility']
  };

  const bucket = baseExercises[goal] || baseExercises['general'];

  const plan = days.map((d, i) => {
    const dayName = dayKeyToName(d, i);
    const title = (i % 2 === 0) ? 'Strength Focus' : 'Conditioning';
    const count = 3 + (experience === 'advanced' ? 2 : 0);
    const exercises = bucket.slice(0, count).map((ex, idx) => {
      const reps = experience === 'beginner' ? (8 + idx*2) + ' x 3' : (5 + idx*2) + ' x 4';
      return { name: ex, reps };
    });
    return { dayKey: d, dayName, title, exercises };
  });

  currentPlan = { generatedAt: new Date().toISOString(), plan };
  renderPlan(currentPlan);

  // attach to profile storage
  const prof = loadProfile() || {};
  prof.lastPlan = currentPlan;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prof));
}


function dayKeyToName(key, i) {
  const map = { mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu', fri:'Fri', sat:'Sat', sun:'Sun' };
  return map[key] || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i % 7] || key;
}

function renderPlan(planObj) {
  planCalendar.innerHTML = '';
  if (!planObj || !planObj.plan) return;
  planObj.plan.forEach(block => {
    const d = document.createElement('div');
    d.className = 'plan-day';
    d.innerHTML = `<h4>${capitalize(block.dayName)}</h4><div class="small">${block.title}</div>`;
    const ul = document.createElement('ul'); ul.className = 'plan-list';
    block.exercises.forEach(e => {
      const li = document.createElement('li');
      li.textContent = e.name + ' — ' + e.reps;
      ul.appendChild(li);
    });
    d.appendChild(ul);
    planCalendar.appendChild(d);
  });
}

function generateExamplePlan() {
  const example = {
    generatedAt: new Date().toISOString(),
    plan: [
      { dayKey:'mon', dayName:'Mon', title:'Full Body', exercises:[{name:'Squat',reps:'5 x 5'},{name:'Pushup',reps:'3 x 10'},{name:'Plank',reps:'3 x 60s'}]},
      { dayKey:'wed', dayName:'Wed', title:'Cardio', exercises:[{name:'Run',reps:'30 min'},{name:'Core',reps:'3 sets'}]},
      { dayKey:'fri', dayName:'Fri', title:'Lower Body', exercises:[{name:'Deadlift',reps:'5 x 3'},{name:'Lunge',reps:'3 x 10'}]}
    ]
  };
  currentPlan = example;
  renderPlan(currentPlan);
}

/* helper */
function capitalize(s) { if (!s) return ''; return s.charAt(0).toUpperCase() + s.slice(1); }

/* --- AI Chat (simulated) --- */
const aiInput = qs('#ai-input-text');
const aiSend = qs('#ai-send');
const aiMessages = qs('#ai-messages');
let loggedCount = 0;

aiSend.addEventListener('click', () => handleAiSend());
aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAiSend(); });

function handleAiSend() {
  const text = aiInput.value.trim();
  if (!text) return;
  appendAiMsg(text, 'user');
  aiInput.value = '';
  setTimeout(() => {
    const reply = simpleAiReply(text);
    appendAiMsg(reply, 'ai');
  }, 400 + Math.random()*800);
}

function appendAiMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'ai-msg ' + (who === 'user' ? 'user' : 'ai');
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function simpleAiReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('swap') || lower.includes('instead')) return 'Sure — I can swap exercises. Which one do you prefer as a replacement?';
  if (lower.includes('easier') || lower.includes('reduce')) return 'No problem — we can reduce volume and lower intensity. Try cutting 1 set per exercise.';
  if (lower.includes('hard') || lower.includes('tough')) return 'If it feels too tough, drop the weight, increase rest, or switch to regressions.';
  if (lower.includes('diet') || lower.includes('nutrition')) return 'Aim for a protein-rich meal after workouts. 1.6-2.2 g/kg protein is a good target for many trainees.';
  if (lower.includes('sleep')) return 'Sleep 7-9 hours/night where possible — it aids recovery and strength gains.';
  if (lower.includes('progress') || lower.includes('tracking')) return 'Log workouts consistently. I calculate consistency based on logged sessions vs scheduled sessions.';
  if (lower.includes('hello') || lower.includes('hi')) return 'Hej! Hur kan jag hjälpa dig med ditt träningsschema idag?';
  const fallbacks = [
    'Bra fråga — jag rekommenderar att vi börjar med ditt huvudsakliga mål och anpassar volymen efter erfarenhet.',
    'Vill du ha ett enklare 3-dagars schema eller ett mer detaljerat 5-dagars schema?',
    'Tips: Håll progressiva överbelastningsprinciper i åtanke. Öka antingen reps eller vikt över tid.'
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/* --- Progress chart (simple canvas) --- */
const chart = qs('#progress-chart');
const ctx = chart.getContext('2d');

function drawChart(logged) {
  ctx.clearRect(0, 0, chart.width, chart.height);
  const w = chart.width, h = chart.height;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,w,h);
  // grid lines
  ctx.fillStyle = '#eee';
  for (let i=0;i<5;i++) ctx.fillRect(0, h - (i+1)*(h/5), w, 1);
  // bars
  const data = (logged && logged.length) ? logged : Array.from({length:7}).map(()=> Math.round(Math.random()*2));
  const barW = (w - 20) / data.length;
  data.forEach((v,i) => {
    const barH = (h - 30) * Math.min(1, v / 3);
    ctx.fillStyle = 'rgba(6,182,212,0.9)';
    ctx.fillRect(10 + i*barW, h - barH - 10, barW*0.8, barH);
  });
}

drawChart();

/* Log workout */
qs('#btn-log-session').addEventListener('click', () => {
  loggedCount++;
  qs('#logged-count').textContent = loggedCount;
  qs('#consistency').textContent = Math.min(100, Math.round((loggedCount / 3) * 100)) + '%';
  const prof = loadProfile() || {};
  prof.loggedCount = loggedCount;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prof));
  drawChart();
});

/* Regenerate */
qs('#btn-regenerate').addEventListener('click', () => {
  const prof = loadProfile();
  if (!prof) return alert('No profile — complete onboarding first.');
  generatePlanFromProfile(prof);
  alert('Plan regenerated using your saved profile.');
});

/* Export / Reset */
function exportJSON() {
  const prof = loadProfile();
  const blob = new Blob([JSON.stringify(prof || {generatedAt:new Date().toISOString()}, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'smartgym_profile.json';
  a.click();
  setTimeout(()=> URL.revokeObjectURL(url), 2000);
}
qs('#btn-export-json').addEventListener('click', exportJSON);
qs('#btn-clear').addEventListener('click', ()=> {
  if (confirm('Reset demo and clear saved profile?')) clearProfile();
});

/* Update small stats & load initial */
function updateStats() {
  const p = loadProfile();
  if (p && p.lastPlan) renderPlan(p.lastPlan);
  if (p && p.loggedCount) qs('#logged-count').textContent = p.loggedCount;
  qs('#stat-users').textContent = 'Demo';
  qs('#stat-plans').textContent = (p && p.lastPlan) ? 1 : '—';
  qs('#stat-exercises').textContent = 120;
}

(function init() {
  const p = loadProfile();
  if (p) {
    loadProfileToUI(p);
    if (p.lastPlan) renderPlan(p.lastPlan);
  } else {
    qs('#stat-users').textContent = 'Demo';
    qs('#stat-plans').textContent = '—';
    qs('#stat-exercises').textContent = '—';
  }
})();

/* Live-save draft when onboarding changes */
qs('#onboard-form').addEventListener('change', () => {
  const draft = collectForm();
  localStorage.setItem('smartgym_draft', JSON.stringify(draft));
});

/* Keyboard shortcuts for demo */
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '1') showPanel('home');
  if (e.ctrlKey && e.key === '2') showPanel('onboarding');
  if (e.ctrlKey && e.key === '3') showPanel('dashboard');
});

/* Sync nav font weight with active panel */
function syncNav() {
  panels.forEach(p => {
    const id = p.id;
    const btn = qsa('.nav-btn').find(b => b.getAttribute('aria-controls') === id);
    if (btn) btn.style.fontWeight = p.classList.contains('active') ? '800' : '600';
  });
}
new MutationObserver(syncNav).observe(document.body, {attributes:true, subtree:true, attributeFilter:['class']});


