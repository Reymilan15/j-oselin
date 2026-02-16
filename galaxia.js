
// Ampliamos las dedicatorias para cubrir los puntos de las constelaciones (23 estrellas en total)
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

// Parámetros galaxia
const arms = 3;
const armSpread = Math.PI / arms;
const starsTotal = dedications.length;
let galaxyRotation = 0;

// MAPA DE CONEXIONES ESPECÍFICO: 
// Virgo (puntos 0 al 13) y Aries (puntos 14 al 20)
const constellation = [
  // Silueta de Virgo
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7], [7, 8], [8, 9], [3, 10], [10, 11], [1, 12],
  // Silueta de Aries
  [14, 15], [15, 16], [16, 17], [17, 18], [18, 19]
];

const galaxy = document.getElementById("galaxy");
const dedicationBox = document.getElementById("dedication");
const dedicationText = document.querySelector(".dedication-text");
const canvas = document.getElementById("galaxyCanvas");
let stars = [];
let zoom = 1;
let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// Distribución mejorada para que las constelaciones no se encimen
function spiralGalaxyPos(i, zoom, rotation) {
  const baseAngle = (i * arms / starsTotal) * 2 * Math.PI;
  const armAngle = ((i % arms) * armSpread);
  const theta = baseAngle + armAngle + rotation;
  // Ajustamos el radio para que se vean más dispersas y nítidas
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
      // Zoom automático a la estrella para ver mejor la dedicatoria
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

// Dibujar constelaciones con líneas estéticas punteadas
function drawConstellations(positions) {
  document.querySelectorAll('.const-line').forEach(l => l.remove());
  constellation.forEach(([idxA, idxB]) => {
    if (positions[idxA] && positions[idxB]) {
      const [ax, ay] = positions[idxA];
      const [bx, by] = positions[idxB];
      const line = document.createElement('div');
      line.className = 'const-line';
      const w = Math.abs(ax - bx);
      const h = Math.abs(ay - by);
      // SVG con líneas punteadas para que se vea más "Aesthetic"
      line.innerHTML = `<svg width="${w + 100}" height="${h + 100}" style="position:absolute;left:${Math.min(ax, bx)}px;top:${Math.min(ay, by)}px;pointer-events:none;">
        <line x1="${ax > bx ? w : 0}" y1="${ay > by ? h : 0}" x2="${ax < bx ? w : 0}" y2="${ay < by ? h : 0}" 
        stroke="rgba(255, 240, 250, 0.3)" stroke-width="1.5" stroke-dasharray="5,5" />
      </svg>`;
      galaxy.appendChild(line);
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
    
    // Mejoramos el brillo individual según el zoom
    const starSize = 14 + (zoom * 2);
    stars[i].style.width = starSize + 'px';
    stars[i].style.height = starSize + 'px';

    stars[i].style.background = i % 2 == 0
      ? "radial-gradient(circle at 40% 30%, #fff9de 0%, #dfc7ff 70%, #a146fa10 100%)"
      : "radial-gradient(circle at 50% 50%, #ffe1f1 0%, #b2b0ff 60%, #a146fa10 100%)";
  }
  drawConstellations(positions);
  return positions;
}

// Fondo de galaxia con mayor calidad (Nebulosas)
function drawGalaxyBackground(rot) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // Núcleo brillante
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

let animFrame;
function animate() {
  galaxyRotation += 0.0015; // Rotación más lenta para mejor calidad visual
  animateStars();
  drawGalaxyBackground(galaxyRotation);
  animFrame = requestAnimationFrame(animate);
}

// Los listeners de música, zoom y bienvenida se mantienen exactamente iguales
// [Manteniendo tus funciones de música, zoomMessage, spawnHeart y spawnWhispers intactas...]

window.addEventListener('resize', () => {
  center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
});

function checkZoomMsg() {
  const msg = document.getElementById('zoomMessage');
  if (zoom > 4.3) {
    msg.textContent = "Sin ti todo sería una galaxia fría y oscura, tú eres mi estrella eterna ⭐";
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3600);
  }
}

galaxy.addEventListener('wheel', e => {
  zoom += e.deltaY * -0.001;
  zoom = Math.max(0.6, Math.min(4.7, zoom));
  checkZoomMsg();
});

// Pinch Zoom (Móviles)
let initialDist = null;
galaxy.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    if (initialDist !== null) {
      zoom += (dist > initialDist ? 0.04 : -0.04);
      zoom = Math.max(0.6, Math.min(4.7, zoom));
      checkZoomMsg();
    }
    initialDist = dist;
  }
}, { passive: false });
galaxy.addEventListener('touchend', () => initialDist = null);

dedicationBox.querySelector('.close').onclick = () => dedicationBox.style.display = 'none';
document.body.addEventListener('click', e => {
  if (!e.target.classList.contains('star') && !e.target.classList.contains('dedication')) {
    dedicationBox.style.display = 'none';
  }
});

const bgmusic = document.getElementById('bgmusic');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false;

document.getElementById('enterBtn').onclick = function() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('galaxy').style.display = 'block';
  document.getElementById('musicControl').style.display = 'block';
  canvas.style.display = 'block';
  document.getElementById('whispers').style.display = 'block';
};

musicBtn.onclick = function() {
  if (musicOn) {
    bgmusic.pause();
    musicOn = false;
    musicBtn.classList.remove('on');
    musicBtn.textContent = '🎵 Encender música';
  } else {
    bgmusic.load(); 
    bgmusic.play().then(() => {
      musicOn = true;
      musicBtn.classList.add('on');
      musicBtn.textContent = '🎶 Apagar música';
    }).catch(e => alert("Haz clic de nuevo ✨"));
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
// Variable para el filtro
let currentFilter = 'all';

// Función para enfocar constelaciones
function focusConstellation(type) {
  currentFilter = type;
  
  // Ajustar zoom automáticamente según la constelación
  if(type === 'all') zoom = 1.1;
  else zoom = 1.8;

  stars.forEach((star, i) => {
    star.style.transition = "opacity 0.8s, transform 0.8s";
    
    if (type === 'all') {
      star.style.opacity = "1";
      star.style.transform = "scale(1)";
    } else if (type === 'virgo' && i <= 12) {
      star.style.opacity = "1";
      star.style.transform = "scale(1.5)";
      star.style.boxShadow = "0 0 20px #fff";
    } else if (type === 'aries' && i >= 14 && i <= 19) {
      star.style.opacity = "1";
      star.style.transform = "scale(1.5)";
      star.style.boxShadow = "0 0 20px #ff8aae";
    } else {
      star.style.opacity = "0.15"; // Opaca las que no pertenecen
      star.style.transform = "scale(0.8)";
    }
  });
}

// Actualiza tu botón de entrar para mostrar los nuevos controles
document.getElementById('enterBtn').onclick = function() {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('galaxy').style.display = 'block';
  document.getElementById('musicControl').style.display = 'block';
  document.getElementById('constellationControls').style.display = 'flex'; // Muestra los botones
  canvas.style.display = 'block';
  document.getElementById('whispers').style.display = 'block';
  createStars();
  animate();
};

// Modifica ligeramente drawConstellations para que respete el filtro
function drawConstellations(positions) {
  document.querySelectorAll('.const-line').forEach(l => l.remove());
  
  constellation.forEach(([idxA, idxB]) => {
    // Solo dibujar si ambas estrellas están en el filtro actual
    let isVirgo = (idxA <= 12 && idxB <= 12);
    let isAries = (idxA >= 14 && idxB >= 19); // Ajustado según tus índices

    if (currentFilter === 'all' || (currentFilter === 'virgo' && isVirgo) || (currentFilter === 'aries' && isAries)) {
        // ... aquí va tu código existente de crear el SVG de la línea ...
        // (No lo pego todo para no saturar, pero mantén tu lógica de línea punteada)
        const line = document.createElement('div');
        line.className = 'const-line';
        line.style.opacity = currentFilter === 'all' ? "0.2" : "1"; // Brilla más si está enfocada
        // ... resto del SVG ...
        galaxy.appendChild(line);
    }
  });
}

createStars();
animate();
setInterval(spawnWhispers, 12000);

