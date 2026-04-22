// =======================
// STORAGE KEYS
// =======================
const LS_USERS = "ji_users";
const LS_SESSION = "ji_session";

// =======================
// HELPERS
// =======================
function $(id){
  return document.getElementById(id);
}

// =======================
// PASSWORD VALIDATION
// =======================
function validatePassword(pw){
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*]/.test(pw)
  );
}

// =======================
// PASSWORD GENERATOR
// =======================
function generateStrongPassword(length = 12){
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  let pass = "";
  for(let i=0; i<length; i++){
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

// =======================
// PASSWORD STRENGTH UI
// =======================
function initPasswordStrength(){

  const passInput = $("regPassword") || $("loginPassword");
  const bar = $("strengthBar");
  const text = $("strengthText");

  if(!passInput || !bar || !text) return;

  passInput.addEventListener("input", ()=>{

    let score = 0;
    const pw = passInput.value;

    if(pw.length >= 8) score++;
    if(/[A-Z]/.test(pw)) score++;
    if(/[a-z]/.test(pw)) score++;
    if(/[0-9]/.test(pw)) score++;
    if(/[!@#$%^&*]/.test(pw)) score++;

    if(score <= 2){
      bar.style.width = "33%";
      bar.style.background = "red";
      text.textContent = "Әлсіз пароль";
    }
    else if(score <= 4){
      bar.style.width = "66%";
      bar.style.background = "orange";
      text.textContent = "Орташа пароль";
    }
    else{
      bar.style.width = "100%";
      bar.style.background = "green";
      text.textContent = "Күшті пароль";
    }

  });
}

// =======================
// REGISTER
// =======================
function initRegister(){

  const btn = $("regBtn");
  if(!btn) return;

  btn.addEventListener("click", ()=>{

    const login = $("regUsername").value.trim();
    const pass1 = $("regPassword").value.trim();
    const pass2 = $("regPassword2").value.trim();

    if(login.length < 8){
      alert("Логин кемінде 8 символ ❌");
      return;
    }

    if(!validatePassword(pass1)){
      alert("Пароль талапқа сай емес ❌");
      return;
    }

    if(pass1 !== pass2){
      alert("Парольдер сәйкес емес ❌");
      return;
    }

    let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");

    if(users.some(u => u.username === login)){
      alert("Бұл логин бос емес ❌");
      return;
    }

    users.push({ username: login, password: pass1 });

    localStorage.setItem(LS_USERS, JSON.stringify(users));
    localStorage.setItem(LS_SESSION, JSON.stringify({username: login}));

    alert("Тіркелу сәтті ✅");
    window.location.href = "home.html";
  });
}

// =======================
// LOGIN
// =======================
// 🔑 Login
function login(){
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    // Егер тек батырма басқанда өту керек болса (қарапайым нұсқа)
    if(email !== "" && password !== ""){
        window.location.href = "strategy.html";
    } else {
        alert("Email мен парольді енгізіңіз!");
    }
}
// =======================
// LOGOUT
// =======================
function initLogout(){

  const btn = $("logoutBtn");
  if(!btn) return;

  btn.addEventListener("click", ()=>{
    localStorage.removeItem(LS_SESSION);
    window.location.href = "index.html";
  });
}

// =======================
// PAGE PROTECTION
// =======================
function protectPages(){

  const session = JSON.parse(localStorage.getItem(LS_SESSION) || "null");
  const page = location.pathname.split("/").pop();

  if(!session && page === "home.html"){
    window.location.href = "index.html";
  }
}

// =======================
// PASSWORD TOGGLE
// =======================
function togglePassword(id){
  const input = $(id);
  input.type = input.type === "password" ? "text" : "password";
}

// =======================
// INIT
// =======================
initRegister();
initLogin();
initLogout();
initPasswordStrength();
protectPages();














document.addEventListener("DOMContentLoaded", function () {

const LS_USERS = "users";
const LS_SESSION = "session";

function checkPasswordStrength(password) {
  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  if (!bar || !text) return false;

  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  bar.style.width = (strength * 20) + "%";

  if (strength <= 2) {
    bar.style.background = "red";
    text.innerText = "Әлсіз пароль";
  } else if (strength <= 4) {
    bar.style.background = "orange";
    text.innerText = "Орташа пароль";
  } else {
    bar.style.background = "green";
    text.innerText = "Қауіпсіз пароль";
  }

  return strength >= 4;
}

document.getElementById("regPassword")?.addEventListener("input", function () {
  checkPasswordStrength(this.value);
});

});





// =======================
// WAIT PAGE LOAD
// =======================
document.addEventListener("DOMContentLoaded", function () {

const LS_USERS = "users";
const LS_SESSION = "session";

const passwordInput = document.getElementById("regPassword");
const bar = document.getElementById("strengthBar");
const text = document.getElementById("strengthText");

// =======================
// PASSWORD STRENGTH
// =======================
window.checkPasswordStrength = function(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  bar.style.width = (strength * 20) + "%";

  if (strength <= 2) {
    bar.style.background = "red";
    text.innerText = "Әлсіз пароль";
  } else if (strength <= 4) {
    bar.style.background = "orange";
    text.innerText = "Орташа пароль";
  } else {
    bar.style.background = "green";
    text.innerText = "Қауіпсіз пароль";
  }

  return strength >= 4;
};

// LIVE тексеру
passwordInput.addEventListener("input", function () {
  checkPasswordStrength(this.value);
});

// =======================
// SHOW PASSWORD
// =======================
window.togglePassword = function () {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
};

// =======================
// PASSWORD GENERATOR
// =======================
window.generatePassword = function () {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  function r(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  let password =
    r(upper) +
    r(lower) +
    r(numbers) +
    r(symbols);

  const all = upper + lower + numbers + symbols;

  for (let i = 0; i < 4; i++) {
    password += r(all);
  }

  passwordInput.value = password;
  checkPasswordStrength(password);
};

// =======================
// REGISTER
// =======================
window.register = function () {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    alert("Барлық өрістерді толтырыңыз!");
    return;
  }

  if (!checkPasswordStrength(password)) {
    alert("Пароль талапқа сай емес!");
    return;
  }

  let users = JSON.parse(localStorage.getItem(LS_USERS)) || [];

  if (users.find(u => u.email === email)) {
    alert("Бұл email тіркелген!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_SESSION, JSON.stringify({ email }));

  alert("Тіркелу сәтті!");
  window.location.href = "home.html";
};

});







function downloadFiles() {
    const links = {
        guide: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        dataset: "https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv",
        video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
    };

    const selected = document.querySelectorAll('input[name="files"]:checked');

    if (selected.length === 0) {
        alert("Материал таңдаңыз!");
        return;
    }

    selected.forEach(item => {
        const a = document.createElement("a");
        a.href = links[item.value];
        a.download = item.value;
        a.click();
    });
}

function checkQuiz() {
    let score = 0;

    for (let i = 1; i <= 10; i++) {
        const ans = document.querySelector(`input[name="q${i}"]:checked`);
        if (ans && ans.value === "1") {
            score++;
        }
    }

    document.getElementById("result").innerText =
        "Сіздің нәтижеңіз: " + score + " / 10";
}






// =======================
// Білім тесті
// =======================
function checkKnowledge(){
  let score = 0;

  for(let i = 1; i <= 3; i++){
    const ans = document.querySelector('input[name="q'+i+'"]:checked');
    if(ans){
      score += Number(ans.value);
    }
  }

  let resultText = "";

  if(score === 3){
    resultText = "Деңгей: Жоғары ✅";
  }
  else if(score === 2){
    resultText = "Деңгей: Орташа ⚠️";
  }
  else{
    resultText = "Деңгей: Төмен ❌";
  }

  document.getElementById("knowledgeResult").innerText =
    "Сіздің нәтиже: " + score + " / 3. " + resultText;
}

















function register() {

  const registerEndTime = Date.now();
  const seconds = (registerEndTime - registerStartTime) / 1000;

  const timeEl = document.getElementById("registerTime");
  if (timeEl) {
    timeEl.innerText =
      "Тіркелуге кеткен уақыт: " + seconds.toFixed(2) + " секунд";
  }

  // 2 секундтан кейін ғана ауысу
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}



document.addEventListener("DOMContentLoaded", function () {
  registerStartTime = Date.now();
  console.log("Timer started:", registerStartTime);
});












// ===== УАҚЫТ АЙНЫМАЛЫЛАР =====
let loginStartTime = 0;

// Бет жүктелген кезде қай бет екенін тексереміз
document.addEventListener("DOMContentLoaded", function () {

  // Егер тіркелу беті болса
  if (document.getElementById("registerTime")) {
    registerStartTime = Date.now();
  }

  // Егер кіру беті болса
  if (document.getElementById("loginTime")) {
    loginStartTime = Date.now();
  }

});

// ===== ТІРКЕЛУ УАҚЫТЫ =====
let registerStartTime = Date.now();

function register() {

  const seconds = ((Date.now() - registerStartTime) / 1000).toFixed(2);

  document.getElementById("modalText").innerText =
    "Сіз тіркелу формасын толтыруға " + seconds + " секунд жұмсадыңыз!";

  document.getElementById("modalOverlay").style.display = "flex";
}

// Модалды жабу
function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}
window.location.href = "login.html";





function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}











async function sendMessage(){

let input = document.getElementById("user-input").value;
let messages = document.getElementById("messages");

messages.innerHTML += "<p><b>Сіз:</b> " + input + "</p>";

const response = await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer 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"
},

body:JSON.stringify({

model:"gpt-4.1-mini",

messages:[
{role:"system", content:"You are an AI advisor that helps students."},
{role:"user", content:input}
]

})

});

const data = await response.json();

let reply = data.choices[0].message.content;

messages.innerHTML += "<p><b>AI:</b> " + reply + "</p>";

document.getElementById("user-input").value="";

messages.scrollTop = messages.scrollHeight;

}












async function askBot() {
    const input = document.getElementById("user-input");
    const chatWindow = document.getElementById("chat-window");
    const text = input.value;

    if (!text) return;

    chatWindow.innerHTML += `<div class="msg user"><b>Сіз:</b> ${text}</div>`;
    input.value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });

        const data = await response.json();
        
        // Егер Google қате қайтарса, оны консольден көреміз
        console.log("API жауабы:", data);

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botReply = data.candidates[0].content.parts[0].text;
            chatWindow.innerHTML += `<div class="msg bot"><b>Бот:</b> ${botReply}</div>`;
        } else {
            chatWindow.innerHTML += `<div class="msg bot"><b>Бот:</b> Кешіріңіз, жауап ала алмадым.</div>`;
        }
    } catch (error) {
        console.error("Қате орын алды:", error);
        chatWindow.innerHTML += `<div class="msg bot"><b>Бот:</b> Байланыс үзілді немесе API қатесі.</div>`;
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}








function getAdvice() {
    let q = document.getElementById("question").value.toLowerCase();
    let answer = "Нақтырақ сұрақ қойшы 🙂";

    if (q.includes("gpa")) {
        answer = "GPA көтеру үшін тапсырмаларды уақытында орында және жеңіл пәндер таңда.";
    } 
    else if (q.includes("пән")) {
        answer = "Өзіңе қызық және болашаққа пайдалы пәндерді таңда.";
    } 
    else if (q.includes("it")) {
        answer = "IT бастау үшін Python немесе JavaScript үйрен.";
    } 
    else if (q.includes("мотивация")) {
        answer = "Кішкентай мақсат қойып, күн сайын әрекет ет.";
    } 
    else if (q.includes("емтихан")) {
        answer = "Емтиханға алдын ала дайындалып, қайталау жаса.";
    }

    document.getElementById("answer").innerText = answer;
}