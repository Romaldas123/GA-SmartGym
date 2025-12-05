/* app.js — SmartGym frontend controller
   - Wizard navigation & validation
   - Plan generation & rendering
   - Simple AI chat (local keyword-based)
   - localStorage persistence
   - Export / Reset / Regenerate
*/

(() => {
  // ---- Elements & state
  const panels = document.querySelectorAll('.panel');
  const navButtons = document.querySelectorAll('.nav-btn[data-target]');
  const form = document.getElementById('onboard-form');
  const steps = Array.from(document.querySelectorAll('fieldset.step'));
  const stepsContainer = document.getElementById('steps');
  const planCalendar = document.getElementById('plan-calendar');
  const aiMessages = document.getElementById('ai-messages');
  const aiInput = document.getElementById('ai-input-text');
  const aiSend = document.getElementById('ai-send');
  const btnRegenerate = document.getElementById('btn-regenerate');
  const btnExport = document.getElementById('btn-export-json');
  const btnClear = document.getElementById('btn-clear');
  const tryDemo = document.getElementById('try-demo');
  const toggleTheme = document.getElementById('toggle-theme');
  const statUsers = document.getElementById('stat-users');
  const statPlans = document.getElementById('stat-plans');
  const statExercises = document.getElementById('stat-exercises');
  const loggedCount = document.getElementById('logged-count');
  const consistencyEl = document.getElementById('consistency');

  // App state
  let wizardStep = 0; // index in steps
  let profile = {};   // saved user data and plan
  let plansGenerated = 0;
  let usersCount = Number(localStorage.getItem('smartgym_users')) || 1;

  // Init
  function init() {
    attachNav();
    buildStepDots();
    bindWizardButtons();
    restoreFromStorage();
    renderStats();
    renderPanelById('home');
    attachWizardSubmission();
    attachAI();
    attachQuickActions();
    attachTryDemo();
    attachThemeToggle();
    renderPlan(); // if any
  }

  // NAVIGATION between panels
  function attachNav() {
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        renderPanelById(target);
      });
    });

    // delegate buttons that have data-target in page
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-target]');
      if (target) {
        const id = target.dataset.target;
        renderPanelById(id);
      }
    });
  }

  function renderPanelById(id) {
    panels.forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(id);
    if (panel) panel.classList.add('active');
    // small accessibility focus
    panel?.querySelector('input,button,select,textarea')?.focus();
  }

  // WIZARD helpers
  function buildStepDots() {
    stepsContainer.innerHTML = '';
    steps.forEach((s, idx) => {
      const d = document.createElement('div');
      d.className = 'step-dot';
      d.textContent = idx + 1;
      if (idx === wizardStep) d.classList.add('active');
      stepsContainer.appendChild(d);
    });
    showStep(wizardStep);
  }

  function showStep(index) {
    steps.forEach((s, i) => {
      s.style.display = i === index ? 'block' : 'none';
    });
    // update dots
    const dots = stepsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('active', i === index);
    }
  }

  function bindWizardButtons() {
    // next buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = Math.min(wizardStep + 1, steps.length - 1);
        if (validateStep(wizardStep)) {
          wizardStep = next;
          showStep(wizardStep);
        }
      });
    });

    // prev buttons
    document.querySelectorAll('.prev-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        wizardStep = Math.max(0, wizardStep - 1);
        showStep(wizardStep);
      });
    });

    // weekday toggles
    document.querySelectorAll('.weekday').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('active'));
    });
  }

  function validateStep(index) {
    const inputs = Array.from(steps[index].querySelectorAll('input,select,textarea')).filter(i => i.required);
    for (let i of inputs) {
      if (!i.value) {
        i.focus();
        i.classList.add('invalid');
        setTimeout(() => i.classList.remove('invalid'), 800);
        return false;
      }
    }
    return true;
  }

  function attachWizardSubmission() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // final validation across all steps
      for (let i = 0; i < steps.length; i++) {
        wizardStep = i;
        showStep(wizardStep);
        if (!validateStep(i)) return;
      }
      // collect data
      const data = new FormData(form);
      profile = formDataToProfile(data);
      profile.trainingDays = Array.from(document.querySelectorAll('.weekday.active')).map(b => b.dataset.day);
      profile.generatedAt = new Date().toISOString();
      profile.plan = generatePlan(profile);
      plansGenerated++;
      localStorage.setItem('smartgym_profile', JSON.stringify(profile));
      localStorage.setItem('smartgym_plans_generated', String(plansGenerated));
      usersCount = Number(localStorage.getItem('smartgym_users')) || usersCount;
      renderStats();
      renderPlan();
      renderPanelById('dashboard');
      flashMessage('Plan generated — good luck!');
    });
  }

  function formDataToProfile(fd) {
    const out = {};
    for (let [k, v] of fd.entries()) {
      if (out[k]) {
        // multiple checkboxes -> array
        out[k] = [].concat(out[k], v);
      } else {
        out[k] = v;
      }
    }
    // collect checkboxes for style & equipment
    out.style = Array.from(form.querySelectorAll('input[name="style"]:checked')).map(i => i.value);
    out.equipment = Array.from(form.querySelectorAll('input[name="equipment"]:checked')).map(i => i.value);
    return out;
  }

  // PLAN generation (simple but adaptive)
  function generatePlan(p) {
    // Basic adaptive rough plan: choose split depending on days & goal
    const days = p.trainingDays && p.trainingDays.length ? p.trainingDays.length : 3;
    const goal = (p.goal || 'general').toLowerCase();
    const experience = (p.experience || 'beginner').toLowerCase();

    const week = [];
    const exercises = sampleExercises();

    // Heuristic: if few days -> full body; more days -> split
    if (days <= 3) {
      for (let i = 0; i < days; i++) {
        week.push({
          name: `Day ${i + 1}`,
          focus: 'Full Body',
          sets: experience === 'beginner' ? '3x8-10' : '4x6-8',
          moves: pickMoves(exercises, 6)
        });
      }
    } else {
      // 4-6 day splits
      const splits = ['Upper Body', 'Lower Body', 'Push', 'Pull', 'Legs', 'Full Body'];
      for (let i = 0; i < days; i++) {
        const focus = splits[i % splits.length];
        week.push({
          name: `Day ${i + 1}`,
          focus,
          sets: experience === 'beginner' ? '3x8-12' : '4x5-8',
          moves: pickMoves(exercises, 5)
        });
      }
    }

    // small adjustments by goal
    if (goal.includes('fat') || goal.includes('loss')) {
      week.forEach(d => d.cardio = '15-25 min moderate');
    } else if (goal.includes('endurance') || goal.includes('cardio')) {
      week.forEach(d => d.cardio = '25-40 min varied');
    } else if (goal.includes('strength')) {
      week.forEach(d => d.warmup = '5-10 min mobility; heavy sets at lower reps');
    }

    return week;
  }

  // sample exercise bank (expandable)
  function sampleExercises() {
    return [
      'Squat', 'Deadlift', 'Bench Press', 'Overhead Press', 'Barbell Row',
      'Pull-up/Chin-up', 'Dumbbell Press', 'Lunge', 'Romanian Deadlift',
      'Hip Thrust', 'Plank', 'Hanging Leg Raise', 'Farmer Carry',
      'Face Pull', 'Banded Pull-apart', 'Kettlebell Swing', 'Burpee'
    ];
  }

  function pickMoves(bank, n) {
    const copy = bank.slice();
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  }

  // Render plan to DOM
  function renderPlan() {
    planCalendar.innerHTML = '';
    const prof = JSON.parse(localStorage.getItem('smartgym_profile') || 'null') || profile;
    const plan = prof && prof.plan ? prof.plan : null;
    if (!plan) {
      planCalendar.innerHTML = '<p class="muted">No plan yet — generate one to see your weekly schedule.</p>';
      return;
    }
    plan.forEach(day => {
      const d = document.createElement('div');
      d.className = 'plan-day';
      d.innerHTML = `<h4>${escapeHtml(day.name)}</h4>
        <div><strong>${escapeHtml(day.focus)}</strong></div>
        <div class="small">Sets: ${escapeHtml(day.sets || '')}</div>
        <ul class="plan-list">${day.moves.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
        ${day.cardio ? `<div class="small">Cardio: ${escapeHtml(day.cardio)}</div>` : ''}
      `;
      planCalendar.appendChild(d);
    });
    // update progress/dash
    const logged = Number(localStorage.getItem('smartgym_logged')) || 0;
    loggedCount.textContent = String(logged);
    const consistency = Math.min(100, Math.round((logged / (plan.length || 1)) * 100));
    consistencyEl.textContent = consistency + '%';
  }

  // AI Chat (simple keyword-based)
  function attachAI() {
    aiSend.addEventListener('click', handleSend);
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
    // welcome message
    pushAiMessage("Hi! I'm your trainer — ask me about workouts, nutrition, recovery, or generating a new plan.");
  }

  function handleSend() {
    const txt = aiInput.value.trim();
    if (!txt) return;
    pushUserMessage(txt);
    aiInput.value = '';
    setTimeout(() => {
      const reply = generateAIReply(txt);
      pushAiMessage(reply);
    }, 500);
  }

  function pushUserMessage(txt) {
    const div = document.createElement('div');
    div.className = 'ai-msg user';
    div.textContent = txt;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function pushAiMessage(txt) {
    const div = document.createElement('div');
    div.className = 'ai-msg ai';
    div.textContent = txt;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function generateAIReply(message) {
    const m = message.toLowerCase();
    const rules = [
      { keys: ['exercise','workout','train','program'], reply: 'Combine compound lifts with accessory work; track progress, and progressively overload.' },
      { keys: ['diet','calorie','eat','nutrition'], reply: 'Aim for a slight calorie surplus for muscle gain, calorie deficit for fat loss; keep protein high (~1.6–2.2 g/kg).' },
      { keys: ['rest','recovery','sleep'], reply: 'Prioritize 7–9h sleep, manage stress, and include at least one rest day per week.' },
      { keys: ['hiit','cardio'], reply: 'HIIT can be efficient for conditioning; combine with strength sessions a few times/week.' },
      { keys: ['plan','generate','regenerate'], reply: 'You can regenerate your plan from the dashboard — I will adapt sets and focus based on your inputs.' },
      { keys: ['hello','hi','hej'], reply: 'Hej! Vad vill du veta om träning idag?' }
    ];
    for (let r of rules) {
      if (r.keys.some(k => m.includes(k))) return r.reply;
    }
    return "Good question — be specific (goal, days/week, equipment) and I'll help.";
  }

  // Quick actions
  function attachQuickActions() {
    btnRegenerate.addEventListener('click', () => {
      const prof = JSON.parse(localStorage.getItem('smartgym_profile') || 'null');
      if (!prof) return flashMessage('No profile to regenerate from.');
      prof.plan = generatePlan(prof);
      localStorage.setItem('smartgym_profile', JSON.stringify(prof));
      plansGenerated++;
      localStorage.setItem('smartgym_plans_generated', String(plansGenerated));
      renderPlan();
      renderStats();
      flashMessage('Plan regenerated.');
    });

    btnExport.addEventListener('click', () => {
      const prof = JSON.parse(localStorage.getItem('smartgym_profile') || 'null') || profile;
      if (!prof) return flashMessage('Nothing to export.');
      const blob = new Blob([JSON.stringify(prof, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smartgym_profile_${(new Date()).toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    btnClear.addEventListener('click', () => {
      if (!confirm('Reset app and clear all local data?')) return;
      localStorage.removeItem('smartgym_profile');
      localStorage.removeItem('smartgym_plans_generated');
      localStorage.removeItem('smartgym_logged');
      localStorage.setItem('smartgym_users', String(Math.max(1, usersCount)));
      profile = {};
      plansGenerated = 0;
      renderPlan();
      renderStats();
      renderPanelById('home');
      flashMessage('App reset.');
    });

    document.getElementById('log-workout')?.addEventListener('click', () => {
      const logged = Number(localStorage.getItem('smartgym_logged')) || 0;
      localStorage.setItem('smartgym_logged', String(logged + 1));
      renderPlan();
      flashMessage('Workout logged ✅');
    });
  }

  function attachTryDemo() {
    tryDemo?.addEventListener('click', () => {
      // simple demo profile
      profile = {
        name: 'Demo User',
        goal: 'general',
        experience: 'beginner',
        trainingDays: ['mon','wed','fri'],
      };
      profile.plan = generatePlan(profile);
      localStorage.setItem('smartgym_profile', JSON.stringify(profile));
      plansGenerated++;
      localStorage.setItem('smartgym_plans_generated', String(plansGenerated));
      renderPlan();
      renderPanelById('dashboard');
      flashMessage('Demo plan generated');
    });
  }

  // Theme toggle
  function attachThemeToggle() {
    toggleTheme?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const pressed = document.documentElement.classList.contains('dark');
      toggleTheme.setAttribute('aria-pressed', String(pressed));
      toggleTheme.textContent = pressed ? 'Light' : 'Dark';
    });
  }

  // Persistence
  function restoreFromStorage() {
    const stored = JSON.parse(localStorage.getItem('smartgym_profile') || 'null');
    if (stored) profile = stored;
    plansGenerated = Number(localStorage.getItem('smartgym_plans_generated')) || plansGenerated;
    usersCount = Number(localStorage.getItem('smartgym_users')) || usersCount;
  }

  function renderStats() {
    statUsers.textContent = String(usersCount);
    statPlans.textContent = String(plansGenerated);
    statExercises.textContent = '80+';
  }

  // Small helpers
  function flashMessage(txt = '', ms = 1800) {
    const el = document.createElement('div');
    el.className = 'flash';
    el.textContent = txt;
    el.style.position = 'fixed';
    el.style.right = '18px';
    el.style.bottom = '18px';
    el.style.background = 'linear-gradient(90deg,#0ea5a5,#06b6d4)';
    el.style.color = '#fff';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '10px';
    el.style.boxShadow = '0 8px 20px rgba(2,6,23,0.2)';
    document.body.appendChild(el);
    setTimeout(() => el.style.opacity = '0', ms - 200);
    setTimeout(() => el.remove(), ms);
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // Simple XSS-safe download utility already provided above

  // Init app
  init();

})();
