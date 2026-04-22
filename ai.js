const chat = document.getElementById("chat");
const input = document.getElementById("input");

// ===== БАЗА =====
const QA = [
  { q:["университет"], a:"Университет — жоғары білім беретін оқу орны." },
  { q:["грант"], a:"Грант алу үшін ҰБТ жоғары балл жинау керек." },
  { q:["мамандық"], a:"Мамандық таңдауда қызығушылық пен сұранысты қара." },
  { q:["it"], a:"IT — программирование, AI, киберқауіпсіздік." },
  { q:["студент"], a:"Студент өмірі — еркіндік және жауапкершілік." }
];

// ===== жауап =====
function getAnswer(text){
  text = text.toLowerCase();

  for(let item of QA){
    for(let q of item.q){
      if(text.includes(q)){
        return item.a;
      }
    }
  }

  return "🤖 Мен бұл сұрақты әлі білмеймін...";
}

// ===== UI =====
function addMsg(text, me){
  const div = document.createElement("div");

  div.style.margin = "10px";
  div.style.padding = "10px";
  div.style.borderRadius = "10px";

  if(me){
    div.style.background = "#2b7cff";
    div.style.textAlign = "right";
    div.innerText = text;
  }else{
    div.style.background = "#1f2937";
    div.innerText = text;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ===== send =====
function send(){
  const text = input.value.trim();
  if(!text) return;

  addMsg(text, true);

  input.value = "";

  setTimeout(()=>{
    const answer = getAnswer(text);
    addMsg(answer, false);
  },400);
}

// Enter
input.addEventListener("keypress", e=>{
  if(e.key === "Enter") send();
});