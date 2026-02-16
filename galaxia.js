const dedications = [
  "Como Virgo, siempre busqué el orden, hasta que tu fuego de Aries me enseñó la belleza del caos.",
  "Eres mi carnero valiente, la que se lanza al universo sin miedo y me lleva de la mano.",
  "Mi mente de Virgo analiza todo, pero mi corazón solo sabe que te ama sin medidas.",
  "Tú pones la chispa de Aries y yo pongo el refugio eterno.",
  "En mi mapa estelar, tú eres la estrella más brillante y audaz.",
  "Eres el impulso que mi alma de Virgo necesitaba para aprender a volar.",
  "Aries y Virgo: el fuego que ilumina la tierra, la tierra que sostiene el fuego.",
  "Gracias por ser esa Aries impetuosa que rompió todas mis estructuras con un beso.",
  "Tu energía es el motor de mi galaxia; sin tu fuerza, mi mundo se detendría.",
  "Me enamoré de tu brillo de Aries... y mi lado Virgo decidió que eres mi lugar seguro.",
  "Eres la pasión que equilibra mi lógica.",
  "Cada luz en el cielo cuenta cómo el carnero y la virgen crearon su propio universo.",
  "Eres mi estrella polar, la que guía mi instinto.",
  "Un universo entero no bastaría para entender la magia que haces en mí.",
  "Virgo brilla más fuerte cuando siente el calor de tu constelación.",
  "Aries arde con la fuerza de nuestro amor infinito.",
  "Tus ojos son nebulosas donde mi mente por fin encuentra paz.",
  "Eres el Big Bang que le dio sentido a mi existencia.",
  "En este mapa estelar, tú eres el destino que siempre quise encontrar.",
  "Nuestra luz Aries-Virgo viajará por el tiempo mucho después que nosotros.",
  "Eres el eclipse que detiene mis pensamientos y acelera mi pulso.",
  "Más allá del horizonte, mi lealtad de Virgo siempre te pertenecerá.",
  "Contigo, mi Aries favorita, el infinito es solo el principio de nuestra aventura."
];

const whispersArr = [
  "Tú eres mi centro galáctico", "Nuestro amor brilla entre las estrellas", "Por siempre juntos",
  "Eres mi todo", "Mi estrella favorita", "Luz de mi vida", "Siempre tuyo", "Destino galáctico"
];

const arms = 3;
const armSpread = Math.PI / arms;
const starsTotal = dedications.length;
let galaxyRotation = 0;
let currentFilter = 'all'; // Variable para el filtro

// MAPA DE CONEXIONES: Virgo (0-12) y Aries (14-19)
const constellation = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7], [7, 8], [8, 9], [3, 10], [10, 11], [1, 12],
  [14, 15], [15, 16], [16, 17], [17, 18], [18, 19]
];

const galaxy = document.getElementById("galaxy");
const dedicationBox = document.getElementById("dedication");
const dedicationText = document.querySelector(".dedication-text");
const canvas = document.getElementById("galaxyCanvas");
let stars = [];
let zoom = 1;
let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function spiralGalaxyPos(i, zoom, rotation) {
  const baseAngle = (i * arms / starsTotal) * 2 * Math.PI;
  const armAngle = ((i % arms) * armSpread);
  const theta = baseAngle + armAngle + rotation;
  const r = 160 + (i * 15) * zoom + Math.cos(i * 0.7 + rotation) * 15;
  const x = center.x + Math.cos(theta) * r;
  const y = center.y + Math.sin(theta) * (r * 0.85);
  return [x, y];
}

function createStars() {
  galaxy.innerHTML = ''; stars = [];
  for (let i = 0; i < starsTotal; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.dataset.star = i;
    galaxy.appendChild(star); stars.push(star);
    star.addEventListener('click', e => {
      e.stopPropagation();
      zoom = 2.2; 
      dedicationBox.style.display = 'block';
      dedicationText.textContent = dedications[i];
      let x = parseFloat(star.style.left) + 30;
      let y = parseFloat(star.style.top) - 20;
      dedicationBox.style.left = x + 'px';
      dedicationBox.style.top = y + 'px';
      spawnHeart(x, y);
    });
  }
}

// Función para enfocar constelaciones (Mueve la cámara y resalta)
function focusOn(type) {
  currentFilter = type;
  const W = window.innerWidth;
  const H = window.innerHeight;

  // Ajuste de Cámara y Zoom
  if (type === 'all') {
    zoom = 1.1;
    center = { x: W / 2, y: H / 2 };
  } else if (type === 'virgo') {
    zoom = 1.9;
    const [vx, vy] = spiralGalaxyPos(5, zoom, galaxyRotation);
    center.x = W / 2 - (vx - center.x);
    center.y = H / 2 - (vy - center.y);
  } else if (type === 'aries') {
    zoom = 2.1;
    const [ax, ay] = spiralGalaxyPos(16, zoom, galaxyRotation);
    center.x = W / 2 - (ax - center.x);
    center.y = H / 2 - (ay - center.y);
  }

  // Brillo de Estrellas
  stars.forEach((star, i) => {
    star.style.transition = "all 0.8s ease-in-out";
    let isVirgoStar = (i <= 13);
    let isAriesStar = (i >= 14 && i <= 22);

    if (type === 'all') {
      star.style.opacity = "1";
      star.style.filter = "brightness(1)";
      star.style.transform = "scale(1)";
    } else if (type === 'virgo') {
      if (isVirgoStar) {
        star.style.opacity = "1";
        star.style.filter = "brightness(2) drop-shadow(0 0 10px white)";
        star.style.transform = "scale(1.5)";
      } else {
        star.style.opacity = "0.1"; // Se apagan las demás
        star.style.filter = "grayscale(1) brightness(0.5)";
        star.style.transform = "scale(0.7)";
      }
    } else if (type === 'aries') {
      if (isAriesStar) {
        star.style.opacity = "1";
        star.style.filter = "brightness(2) drop-shadow(0 0 10px #ff8aae)";
        star.style.transform = "scale(1.5)";
      } else {
        star.style.opacity = "0.1"; // Se apagan las demás
        star.style.filter = "grayscale(1) brightness(0.5)";
        star.style.transform = "scale(0.7)";
      }
    }
  });
}

function drawConstellations(positions) {
  document.querySelectorAll('.const-line').forEach(l => l.remove());
  constellation.forEach(([idxA, idxB]) => {
    if (positions[idxA] function drawConstellations(positions) {
  document.querySelectorAll('.const-line').forEach(l => l.remove());
  
  constellation.forEach(([idxA, idxB]) => {
    if (positions[idxA] && positions[idxB]) {
      let isVirgo = (idxA <= 12 && idxB <= 12);
      let isAries = (idxA >= 14 && idxB <= 19);
      
      // Lógica de visibilidad
      let showLine = false;
      let opacity = "0.3";
      let strokeColor = "rgba(255, 255, 255, ";

      if (currentFilter === 'all') {
        showLine = true;
        opacity = "0.4"; // Brillo medio para ambos en modo galaxia
      } else if (currentFilter === 'virgo' && isVirgo) {
        showLine = true;
        opacity = "1"; // Brillo máximo para Virgo
        strokeColor = "rgba(200, 230, 255, "; // Tono azulado sutil
      } else if (currentFilter === 'aries' && isAries) {
        showLine = true;
        opacity = "1"; // Brillo máximo para Aries
        strokeColor = "rgba(255, 200, 220, "; // Tono rosado sutil
      }

      if (showLine) {
        const [ax, ay] = positions[idxA];
        const [bx, by] = positions[idxB];
        const line = document.createElement('div');
        line.className = 'const-line';
        const w = Math.abs(ax - bx);
        const h = Math.abs(ay - by);
        
        line.innerHTML = `<svg width="${w + 100}" height="${h + 100}" style="position:absolute;left:${Math.min(ax, bx)}px;top:${Math.min(ay, by)}px;pointer-events:none; filter: drop-shadow(0 0 5px white);">
          <line x1="${ax > bx ? w : 0}" y1="${ay > by ? h : 0}" x2="${ax < bx ? w : 0}" y2="${ay < by ? h : 0}" 
          stroke="${strokeColor}${opacity})" stroke-width="${currentFilter === 'all' ? '1.5' : '2.5'}" stroke-dasharray="${currentFilter === 'all' ? '5,5' : '0'}" />
        </svg>`;
        galaxy.appendChild(line);
      }
    }
  });
}

function animateStars() {
  const positions = [];
  for (let i = 0; i < starsTotal; i++) {
    const [cx, cy] = spiralGalaxyPos(i, zoom, galaxyRotation);
    positions.push([cx, cy]);
    stars[i].style.left = (cx - 11) + 'px';
    stars[i].style.top = (cy - 11) + 'px';
    const starSize = 14 + (zoom * 2);
    stars[i].style.width = starSize + 'px';
    stars[i].style.height = starSize + 'px';
  }
  drawConstellations(positions);
  return positions;
}

function drawGalaxyBackground(rot) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 400 * zoom);
  glow.addColorStop(0, 'rgba(80, 20, 120, 0.2)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0,0,W,H);
  ctx.save(); ctx.translate(center.x, center.y);
  for (let arm = 0; arm < arms; arm++) {
    let theta0 = rot + arm * armSpread;
    for (let i = 0; i < 70; i++) {
      let t = theta0 + i * 0.13;
      let r = (80 + i * 6) * zoom;
      ctx.beginPath();
      ctx.arc(Math.cos(t) * r, Math.sin(t) * r * 0.9, (38 + Math.random() * 20) * zoom, 0, 2 * Math.PI);
      ctx.globalAlpha = 0.08 - (i / 500);
      ctx.fillStyle = arm % 2 == 0 ? '#9644fd' : '#ff8aae';
      ctx.fill();
    }
  }
  ctx.restore();
}

function animate() {
  galaxyRotation += 0.0015;
  animateStars();
  drawGalaxyBackground(galaxyRotation);
  requestAnimationFrame(animate);
}

// --- Soporte para botones y entrada ---
document.getElementById('enterBtn').onclick = function() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('galaxy').style.display = 'block';
  document.getElementById('musicControl').style.display = 'block';
  document.getElementById('constellationControls').style.display = 'flex'; 
  canvas.style.display = 'block';
  document.getElementById('whispers').style.display = 'block';
  createStars();
  animate();
};

// --- Mantenimiento de tus funciones originales ---
window.addEventListener('resize', () => {
  center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
});

const bgmusic = document.getElementById('bgmusic');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false;

musicBtn.onclick = function() {
  if (musicOn) {
    bgmusic.pause();
    musicOn = false;
    musicBtn.textContent = '🎵 Encender música';
  } else {
    bgmusic.play().then(() => {
      musicOn = true;
      musicBtn.textContent = '🎶 Apagar música';
    });
  }
};

function spawnHeart(x, y){
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = `<svg viewBox="0 0 32 29" style="width:30px;height:28px;"><path d="M16 29s-13-8.2-13-17C3 3.6 13 1.6 16 9c3-7.4 13-5.4 13 3C29 20.8 16 29 16 29z" fill="#ff8aae" stroke="#fff6f9" stroke-width="1"/></svg>`;
  heart.style.left = x+'px'; heart.style.top = y+'px';
  galaxy.appendChild(heart); setTimeout(()=>heart.remove(),7000);
}

function spawnWhispers() {
  const layer = document.getElementById('whispers');
  layer.innerHTML = '';
  const W = window.innerWidth;
  for(let i=0;i<5;i++) {
    setTimeout(()=>{
      let el = document.createElement('div'); el.className='whisper';
      el.textContent = whispersArr[Math.floor(Math.random()*whispersArr.length)];
      el.style.left = (50+Math.random()*(W-180))+'px';
      el.style.top = (window.innerHeight - 100) + 'px';
      layer.appendChild(el);
      setTimeout(()=>el.remove(),22000);
    }, 8000 + i*3000);
  }
}

setInterval(spawnWhispers, 12000);




