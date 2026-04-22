// ======================= STORAGE KEYS =======================
const LS_USERS = "ji_users";
const LS_SESSION = "ji_session";

// ======================= HELPERS =======================
function $(id) { return document.getElementById(id); }

// ======================= PASSWORD VALIDATION =======================
function validatePassword(pw) {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&*]/.test(pw);
}

function generateStrongPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let pass = "";
  for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

// ======================= PASSWORD STRENGTH (Register) =======================
function updateStrength() {
  const pass = $("regPassword")?.value || "";
  const bar = $("strengthBar");
  const text = $("strengthText");
  if (!bar) return;
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[!@#$%^&*]/.test(pass)) score++;
  let width = "20%", bg = "red", msg = "Әлсіз";
  if (score >= 4) { width = "100%"; bg = "green"; msg = "Күшті ✅"; }
  else if (score >= 2) { width = "66%"; bg = "orange"; msg = "Орташа ⚠️"; }
  bar.style.width = width;
  bar.style.background = bg;
  if (text) text.textContent = msg;
}

// ======================= REGISTER =======================
function register() {
  const name = $("regName")?.value.trim();
  const email = $("regEmail")?.value.trim();
  const pass = $("regPassword")?.value;
  const pass2 = $("regPassword2")?.value;
  if (!name || !email || !pass) { alert("Барлық өрістерді толтырыңыз!"); return; }
  if (!validatePassword(pass)) { alert("Пароль талапқа сай емес!"); return; }
  if (pass !== pass2) { alert("Парольдер сәйкес емес!"); return; }
  let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  if (users.find(u => u.email === email)) { alert("Бұл email тіркелген!"); return; }
  users.push({ name, email, password: pass });
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_SESSION, JSON.stringify({ email }));
  const seconds = ((Date.now() - (window.registerStartTime || Date.now())) / 1000).toFixed(2);
  alert(`Сіз тіркелу формасын толтыруға ${seconds} секунд жұмсадыңыз!`);
  window.location.href = "home.html";
}

// ======================= LOGIN =======================
function login() {
  const email = $("loginEmail")?.value.trim();
  const password = $("loginPassword")?.value;
  if (!email || !password) { alert("Email мен парольді енгізіңіз!"); return; }
  let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(LS_SESSION, JSON.stringify({ email }));
    const seconds = ((Date.now() - (window.loginStartTime || Date.now())) / 1000).toFixed(2);
    alert(`Сіз кіру формасын толтыруға ${seconds} секунд жұмсадыңыз!`);
    window.location.href = "home.html";
  } else {
    alert("Email немесе пароль қате!");
  }
}

function logout() { localStorage.removeItem(LS_SESSION); window.location.href = "index.html"; }

// ======================= SESSION PROTECTION =======================
function protectPages() {
  const session = JSON.parse(localStorage.getItem(LS_SESSION) || "null");
  const page = location.pathname.split("/").pop();
  if (!session && (page === "home.html" || page === "guide.html" || page === "payment-check.html" || page === "training.html" || page === "strategy.html" || page === "assistant.html" || page === "about.html")) {
    window.location.href = "index.html";
  }
  if (session && (page === "index.html" || page === "register.html")) {
    window.location.href = "home.html";
  }
}

// ======================= UI HELPERS (Theme, Accent, BG) =======================
function initTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  const toggle = $("themeToggle");
  if (toggle) toggle.onclick = () => {
    const curr = document.documentElement.getAttribute("data-theme");
    const next = curr === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };
  const accent = $("accentSelect");
  if (accent) {
    accent.value = localStorage.getItem("accent") || "blue";
    accent.onchange = () => { localStorage.setItem("accent", accent.value); applyAccent(accent.value); };
    applyAccent(accent.value);
  }
  const bg = $("bgSelect");
  if (bg) {
    bg.value = localStorage.getItem("bg") || "grad";
    bg.onchange = () => { localStorage.setItem("bg", bg.value); applyBg(bg.value); };
    applyBg(bg.value);
  }
}
function applyAccent(color) {
  let val = "#2563eb";
  if (color === "green") val = "#16a34a";
  if (color === "purple") val = "#9333ea";
  if (color === "orange") val = "#ea580c";
  document.documentElement.style.setProperty("--accent", val);
  document.documentElement.style.setProperty("--accent-hover", val + "cc");
}
function applyBg(type) {
  let bg = "#0f172a";
  if (type === "dots") bg = "radial-gradient(circle at 2px 2px, #334155 1px, transparent 1px)";
  if (type === "grid") bg = "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)";
  if (type === "plain") bg = "#0f172a";
  if (type === "grad") bg = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
  document.body.style.background = bg;
  if (type === "dots") document.body.style.backgroundSize = "20px 20px";
  if (type === "grid") document.body.style.backgroundSize = "40px 40px";
}

// ======================= HOME WELCOME =======================
function updateWelcome() {
  const session = JSON.parse(localStorage.getItem(LS_SESSION) || "null");
  const users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
  const user = users.find(u => u.email === session?.email);
  const welcome = $("welcomeText");
  if (welcome && user) welcome.textContent = `Қош келдіңіз, ${user.name || user.email}!`;
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) logoutBtn.onclick = logout;
}

// ======================= STRATEGY GAME =======================
if (location.pathname.includes("strategy.html")) {
  window.onload = () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let player = { x: 190, y: 190, size: 20 };
    let enemies = [];
    let score = 0, best = localStorage.getItem("bestScore") || 0;
    let gameRunning = false, animId = null;
    const scoreSpan = document.getElementById("score");
    const bestSpan = document.getElementById("bestScore");
    bestSpan.innerText = best;
    function spawnEnemy() {
      let side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = Math.random() * 400; y = 0; }
      else if (side === 2) { x = Math.random() * 400; y = 400; }
      else if (side === 1) { x = 400; y = Math.random() * 400; }
      else { x = 0; y = Math.random() * 400; }
      enemies.push({ x, y, size: 20 });
    }
    function update() {
      if (!gameRunning) return;
      for (let e of enemies) {
        let dx = player.x - e.x, dy = player.y - e.y, dist = Math.hypot(dx, dy);
        if (dist < player.size + e.size) { gameOver(); return; }
      }
      draw();
      animId = requestAnimationFrame(update);
    }
    function draw() {
      ctx.clearRect(0, 0, 400, 400);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size);
      ctx.fillStyle = "#ef4444";
      for (let e of enemies) ctx.fillRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size);
    }
    function move(e) {
      if (!gameRunning) return;
      let step = 15;
      if (e.key === "ArrowUp" || e.key === "w") player.y -= step;
      if (e.key === "ArrowDown" || e.key === "s") player.y += step;
      if (e.key === "ArrowLeft" || e.key === "a") player.x -= step;
      if (e.key === "ArrowRight" || e.key === "d") player.x += step;
      player.x = Math.min(380, Math.max(20, player.x));
      player.y = Math.min(380, Math.max(20, player.y));
    }
    function gameOver() {
      gameRunning = false;
      cancelAnimationFrame(animId);
      alert("Ойын аяқталды! Ұпай: " + score);
      if (score > best) { localStorage.setItem("bestScore", score); bestSpan.innerText = score; }
    }
    document.getElementById("startGame").onclick = () => {
      if (animId) cancelAnimationFrame(animId);
      player = { x: 190, y: 190, size: 20 };
      enemies = [];
      score = 0;
      scoreSpan.innerText = score;
      gameRunning = true;
      spawnEnemy();
      setInterval(() => { if (gameRunning) { spawnEnemy(); score++; scoreSpan.innerText = score; } }, 1500);
      update();
    };
    document.getElementById("resetGame").onclick = () => { gameOver(); };
    window.addEventListener("keydown", move);
  };
}

// ======================= TRAINING QUIZ =======================
if (location.pathname.includes("training.html")) {
  window.initTraining = () => {
    let time = 30, score = 0, timer = null;
    const qs = [
      "Банк картасының CVV кодын айтуға бола ма?",
      "Ресми банк сайтында https болуы керек пе?",
      "Бейтаныс сілтемені басу қауіпсіз бе?",
      "Құпия сөз кемінде 8 символ болуы керек пе?",
      "Бір парольді барлық жерде қолдануға бола ма?"
    ];
    const ans = [false, true, false, true, false];
    let current = 0;
    function nextQ() { current = Math.floor(Math.random() * qs.length); $("question").innerText = qs[current]; }
    function check(v) { if (v === ans[current]) score++; $("score").innerText = score; nextQ(); }
    $("startBtn").onclick = () => {
      if (timer) clearInterval(timer);
      time = 30; score = 0; $("time").innerText = time; $("score").innerText = score;
      nextQ(); $("yesBtn").disabled = false; $("noBtn").disabled = false;
      timer = setInterval(() => { time--; $("time").innerText = time; if (time <= 0) { clearInterval(timer); alert("Уақыт бітті! Нәтиже: " + score); $("yesBtn").disabled = true; $("noBtn").disabled = true; } }, 1000);
    };
    $("resetBtn").onclick = () => { if (timer) clearInterval(timer); $("yesBtn").disabled = true; $("noBtn").disabled = true; $("time").innerText = "30"; $("score").innerText = "0"; $("question").innerText = "Сұрақ осында шығады"; };
    $("yesBtn").onclick = () => check(true);
    $("noBtn").onclick = () => check(false);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", window.initTraining);
  else window.initTraining();
}

// ======================= PAYMENT CHECK =======================
if (location.pathname.includes("payment-check.html")) {
  window.initPayment = () => {
    $("checkBtn").onclick = () => {
      let risk = 0;
      const amt = parseInt($("amount").value);
      const site = $("website").value.trim();
      if (!$("receiver").value) risk++;
      if (isNaN(amt) || amt <= 0) risk++;
      if (amt > 500000) risk += 2;
      if (site && !site.startsWith("https://")) risk += 2;
      if (site && site.includes(".xyz")) risk += 2;
      let level = "Төмен 🟢", advice = "Төлем қауіпсіз көрінеді.";
      if (risk >= 4) { level = "Жоғары 🔴"; advice = "Бұл төлем қауіпті! Банкке хабарласыңыз."; }
      else if (risk >= 2) { level = "Орташа 🟡"; advice = "Қосымша тексеріңіз."; }
      $("riskLevel").innerHTML = level;
      $("advice").innerHTML = advice;
    };
    $("clearBtn").onclick = () => { $("receiver").value = ""; $("amount").value = ""; $("website").value = ""; $("riskLevel").innerHTML = "—"; $("advice").innerHTML = "Мәлімет енгізіңіз."; };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", window.initPayment);
  else window.initPayment();
}

// ======================= GUIDE (HICK LAW) =======================
if (location.pathname.includes("guide.html")) {
  window.loadQuestion = () => {
    const qId = $("questionSelect").value;
    const answersDiv = $("answers");
    answersDiv.innerHTML = "";
    if (!qId) return;
    const map = {
      1: ["Platonus жүйесі", "Деканат", "Кітапхана", "Instagram"],
      2: ["Қаржы бөлімі", "Студент бөлімі", "Кітапхана", "Асхана"],
      3: ["Platonus", "WhatsApp", "Куратор", "Instagram"],
      4: ["Студенттік билет", "Жеке куәлік", "Ақша төлеу", "Ештеңе"]
    };
    const answers = map[qId];
    const n = answers.length;
    const theory = (0.4 + 0.3 * Math.log2(n + 1)).toFixed(3);
    $("theoryTime").innerText = `Теория: ${theory} сек`;
    window.startTime = Date.now();
    answers.forEach(a => {
      const btn = document.createElement("button");
      btn.innerText = a; btn.style.display = "block"; btn.style.margin = "10px 0";
      btn.onclick = () => { $("realTime").innerText = `Сіздің уақытыңыз: ${((Date.now() - window.startTime)/1000).toFixed(3)} сек`; };
      answersDiv.appendChild(btn);
    });
  };
}

// ======================= ASSISTANT (AI) =======================
if (location.pathname.includes("assistant.html")) {
  window.sendMessage = () => {
    const input = $("userInput");
    const text = input.value.trim();
    if (!text) return;
    const chat = $("chatBox");
    chat.innerHTML += `<div style="background:var(--accent); padding:8px; border-radius:12px; margin:4px 0; align-self:flex-end; color:white;">${text}</div>`;
    let reply = "Сұрағыңызды нақтырақ жазыңыз.";
    const t = text.toLowerCase();
    if (t.includes("алаяқ") || t.includes("мошенник")) reply = "Алаяқтық күдігі болса — банкке хабарласыңыз.";
    else if (t.includes("cvv")) reply = "CVV кодты ешкімге айтпаңыз! Бұл құпия.";
    else if (t.includes("сілтеме")) reply = "Бейтаныс сілтемелерді баспаңыз.";
    else if (t.includes("пароль")) reply = "Құпия сөз күрделі болуы керек: 8 символ, әріп, сан, символ.";
    chat.innerHTML += `<div style="background:var(--card); padding:8px; border-radius:12px; margin:4px 0;">🤖 ${reply}</div>`;
    input.value = "";
    chat.scrollTop = chat.scrollHeight;
  };
  $("sendBtn").onclick = window.sendMessage;
  $("userInput").addEventListener("keypress", (e) => { if (e.key === "Enter") window.sendMessage(); });
}

// ======================= INIT =======================
window.onload = () => {
  protectPages();
  initTheme();
  if ($("regPassword")) { $("regPassword").addEventListener("input", updateStrength); if ($("genPassBtn")) $("genPassBtn").onclick = () => { $("regPassword").value = generateStrongPassword(); updateStrength(); }; }
  if ($("regBtn")) $("regBtn").onclick = register;
  if ($("loginBtn")) $("loginBtn").onclick = login;
  if ($("logoutBtn")) $("logoutBtn").onclick = logout;
  if (location.pathname.includes("home.html")) updateWelcome();
  window.registerStartTime = Date.now();
  window.loginStartTime = Date.now();
};