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

window.onload = () => {
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
    const container = document.getElementById('main-container');
    const input = document.getElementById('user-ans');
    const btn = document.getElementById('next-btn');
    const questionTitle = document.getElementById('question-title');

    // Contador
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

    // Guardar y Siguiente
    btn.onclick = async () => {
        const val = input.value.trim();
        if(!val) return;

        // Guardar en Firebase
        const qKey = `pregunta_${idx + 1}`;
        await set(ref(db, `respuestas/${sessionRef.key}/${qKey}`), {
            pregunta: questions[idx],
            respuesta: val,
            hora: new Date().toLocaleTimeString()
        });

        // Animación de puertas
        container.classList.add('split');
        setTimeout(() => {
            if(idx < questions.length - 1) {
                idx++;
                questionTitle.innerText = questions[idx];
                input.value = "";
                container.classList.remove('split');
                input.focus();
            } else {
                document.getElementById('screen-quiz').classList.remove('active');
                document.getElementById('screen-end').classList.add('active');
                container.classList.remove('split');
            }
        }, 1000);
    };

    // Código de adorno en puertas
    const codeLeft = document.getElementById('door-code-left');
    const codeRight = document.getElementById('door-code-right');
    const ops = ["if", "else", "void", "int", "{ }", "=>", "push", "set"];
    setInterval(() => {
        codeLeft.innerText = ops[Math.floor(Math.random()*ops.length)] + " " + Math.random().toString(16);
        codeRight.innerText = ops[Math.floor(Math.random()*ops.length)] + " " + Math.random().toString(16);
    }, 100);
};