import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDK6dSkVHRZ_BWqboSBlcTV_MyUZAxV6xI",
    authDomain: "encuesta--maestra--arianna.firebaseapp.com",
    databaseURL: "https://encuesta--maestra--arianna-default-rtdb.firebaseio.com",
    projectId: "encuesta--maestra--arianna",
    storageBucket: "encuesta--maestra--arianna.firebasestorage.app",
    messagingSenderId: "1074844690438",
    appId: "1:1074844690438:web:ba695905600d21f1063b87"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const sessionRef = push(ref(db, 'respuestas'));

const questions = [
    "1. ¿Qué hizo la profesora este semestre que realmente te ayudó a entender mejor la materia?",
    "2. ¿En qué momento de las clases sentiste que te perdías o dejabas de entender?",
    "3. Si tuvieras que describir con 3 palabras cómo da clase la profesora ¿cuáles serían?",
    "4. ¿Consideras que deberían haber más dinámicas en clase?",
    "5. ¿La profesora logró que te interesara más la materia o menos?",
    "6. ¿Cómo maneja la profesora las preguntas “tontas” o cuando alguien se equivoca?",
    "7. ¿Qué diferencia notas entre esta profesora y el mejor maestro/maestra que consideras tener?",
    "8. ¿Qué propones que se podría hacer en clase para mejorar la forma de aprender?",
    "9. ¿Qué cosa concreta debería dejar de hacer, seguir haciendo, y empezar a hacer?",
    "10. Si pudieras cambiar UNA sola cosa para que todos aprendieran más ¿qué sería?",
    "11. Del 1 al 10 ¿Cómo calificas a la maestra?"
];

let idx = 0;
const canvas = document.getElementById('entityCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('main-container');
const input = document.getElementById('user-ans');
const btn = document.getElementById('next-btn');
const questionTitle = document.getElementById('question-title');

let entities = [];
let isTransitioning = false;
class Entity {
    constructor(w, h) { this.w = w; this.h = h; this.reset(); }
    reset() { this.x = this.w/2; this.y = this.h/2; this.vx = (Math.random()-0.5)*15; this.vy = (Math.random()-0.5)*15; this.size = Math.random()*4+2; this.alpha = 1; }
    update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.96; this.vy *= 0.96; this.alpha -= 0.02; }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fillStyle = `rgba(153, 222, 255, ${this.alpha})`; ctx.fill(); }
}

function particleLoop() {
    if (isTransitioning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        entities.forEach(e => { e.update(); e.draw(); });
        if(entities.every(e => e.alpha <= 0)) isTransitioning = false;
    }
    requestAnimationFrame(particleLoop);
}

window.addEventListener('load', () => {
    let t = 5;
    const cd = setInterval(() => {
        t--;
        document.getElementById('timer').innerText = t;
        if(t <= 0) {
            clearInterval(cd);
            document.getElementById('screen-intro').classList.remove('active');
            document.getElementById('screen-quiz').classList.add('active');
            questionTitle.innerText = questions[idx];
            input.focus();
        }
    }, 1000);
});

btn.onclick = async () => {
    const val = input.value.trim();
    if(!val) return;
    btn.disabled = true;

    await set(ref(db, `respuestas/${sessionRef.key}/pregunta_${idx + 1}`), {
        pregunta: questions[idx], respuesta: val, hora: new Date().toLocaleTimeString()
    });

    canvas.width = container.offsetWidth; canvas.height = container.offsetHeight;
    canvas.style.display = "block";
    entities = Array.from({length: 30}, () => new Entity(canvas.width, canvas.height));
    isTransitioning = true;
    particleLoop();

    setTimeout(() => {
        if(idx < questions.length - 1) {
            idx++;
            questionTitle.innerText = questions[idx];
            input.value = "";
            canvas.style.display = "none";
            input.focus();
        } else {
            document.getElementById('screen-quiz').classList.remove('active');
            document.getElementById('screen-end').classList.add('active');
            canvas.style.display = "none";
        }
        btn.disabled = false;
    }, 800);
};