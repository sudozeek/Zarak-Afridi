// --- Start at Top ---
window.onbeforeunload = function () { window.scrollTo(0, 0); }

// --- 1. Matrix Background (Restored logic) ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let fontSize = 14;
let columns, drops;

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
window.onresize = initMatrix;

// --- 2. Typewriter (Detailed 5-line Intro) ---
const bio = "System initialized. User: Zarak Afridi. Identity: 18-year-old Cybersecurity Student at PAF-IAST.\n" + 
"I am a security researcher and CTF player specializing in offensive security and system automation.\n" +
"My workflow involves scripting in Python and Bash to simplify complex exploitation tasks.\n" +
"I break code to understand its heartbeat and build more resilient systems through research.\n" +
"Welcome to my root terminal—status is currently online and ready for connection.";

let idx = 0;
function typeWriter() {
    if (idx < bio.length) {
        document.getElementById("typing-text").innerHTML += bio.charAt(idx);
        idx++;
        setTimeout(typeWriter, 35);
    }
}

// --- 3. Modal ---
function openModal(element) {
    const modal = document.getElementById("cert-modal");
    document.getElementById("full-cert-img").src = element.querySelector('img').src;
    document.getElementById("caption").innerHTML = "[DECRYPTED]: " + element.querySelector('h4').innerText;
    modal.style.display = "block";
}
function closeModal() { document.getElementById("cert-modal").style.display = "none"; }
window.onclick = (e) => { if (e.target == document.getElementById("cert-modal")) closeModal(); }

// --- Init ---
window.onload = () => {
    initMatrix();
    setInterval(drawMatrix, 35);
    typeWriter();
    document.getElementById('terminal-content').scrollTop = 0;
};
