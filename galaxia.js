
// --- VARIABLES DE CONTROL (Manteniendo tus datos) ---
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

const whispersArr = ["Tú eres mi centro galáctico", "Nuestro amor brilla entre las estrellas", "Por siempre juntos", "Eres mi todo", "Mi estrella favorita", "Luz de mi vida", "Siempre tuyo", "Destino galáctico"];

const arms = 3;
const armSpread = Math.PI / arms;
const starsTotal = dedications.length;
let galaxyRotation = 0;
let currentFilter = 'all'; 

let zoom = window.innerWidth < 600 ? 1.6 : 1.1;
let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let isZooming = false; // Bandera para optimización de fluidez

const constellation = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7], [7, 8], [8, 9], [3, 10], [10, 11], [1, 12],
  [14, 15], [15, 16], [16, 17], [17, 18], [18, 19]
];

const galaxy = document.getElementById("galaxy");
const dedicationBox = document.getElementById("dedication");
const dedicationText = document.querySelector(".dedication-text");
const canvas = document.getElementById("galaxyCanvas");
let stars = [];

// --- SISTEMA DE ZOOM OPTIMIZADO ---
window.addEventListener('wheel', (e) => {
    zoom += e.deltaY * -0.0008;
    zoom = Math.min(Math.max(0.5, zoom), 4);
}, { passive: true });

let initialDist = null;
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault(); 
        isZooming = true; // Pausamos dibujos pesados
        let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        if (initialDist !== null) {
            let factor = dist / initialDist;
            zoom = Math.min(Math.max(0.5, zoom * factor), 4);
        }
        initialDist = dist;
    }
}, { passive: false });

window.addEventListener('touchend', () => { 
    initialDist = null; 
    setTimeout(() => { isZooming = false; }, 150); // Reactivamos líneas tras el zoom
});

// --- FUNCIONES CORE ---

function spiralGalaxyPos(i, z, rotation) {
  const baseAngle = (i * arms / starsTotal) * 2 * Math.PI;
  const armAngle = ((i % arms) * armSpread);
  const theta = baseAngle + armAngle + rotation;
  const r = 160 + (i * 15) * z + Math.cos(i * 0.7 + rotation) * 15;
  const x = center.x + Math.cos(theta) * r;
  const y = center.y + Math.sin(theta) * (r * 0.85);
  return [x, y];
}

function createStars() {
  galaxy.innerHTML = ''; stars = [];
  for (let i = 0; i < starsTotal; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.willChange = "transform, opacity"; // Prepara al móvil para mover capas
    star.style.background = "radial-gradient(circle, #fff 20%, rgba(255,255,255,0.7) 40%, transparent 80%)";
    star.style.borderRadius = "50%";
    star.style.boxShadow = "0 0 8px #fff";
    galaxy.appendChild(star); stars.push(star);
    star.addEventListener('click', e => {
      e.stopPropagation();
      dedicationBox.style.display = 'block';
      dedicationText.textContent = dedications[i];
      // Usamos el transform para calcular la posición de la caja de texto
      const rect = star.getBoundingClientRect();
      dedicationBox.style.left = (rect.left + 20) + 'px';
      dedicationBox.style.top = (rect.top - 20) + 'px';
      spawnHeart(rect.left, rect.top);
    });
  }
}

window.focusOn = function(type) {
  currentFilter = type;
  stars.forEach((star, i) => {
    let isVirgoStar = (i <= 13);
    let isAriesStar = (i >= 14 && i <= 22);
    star.style.transition = "opacity 0.6s ease-in-out, filter 0.6s ease-in-out";

    if (type === 'all') {
      star.style.opacity = (isVirgoStar || isAriesStar) ? "1" : "0.4";
      star.style.filter = (isVirgoStar || isAriesStar) ? "brightness(2) drop-shadow(0 0 12px #fff)" : "brightness(1)";
    } else if (type === 'virgo') {
      star.style.opacity = isVirgoStar ? "1" : "0.05";
      star.style.filter = isVirgoStar ? "brightness(2.5) drop-shadow(0 0 15px #fff)" : "grayscale(1) brightness(0.3)";
    } else if (type === 'aries') {
      star.style.opacity = isAriesStar ? "1" : "0.05";
      star.style.filter = isAriesStar ? "brightness(2.5) drop-shadow(0 0 15px #ff8aae)" : "grayscale(1) brightness(0.3)";
    }
  });
};

function drawConstellations(positions) {
  if (isZooming) return; // Si estamos haciendo zoom, no redibujamos líneas (es lo que causa lentitud)
  
  document.querySelectorAll('.const-line').forEach(l => l.remove());
  constellation.forEach(([idxA, idxB]) => {
    if (positions[idxA] && positions[idxB]) {
      let isVirgo = (idxA <= 12 && idxB <= 12);
      let isAries = (idxA >= 14 && idxB <= 19);
      let showLine = (currentFilter === 'all') || (currentFilter === 'virgo' && isVirgo) || (currentFilter === 'aries' && isAries);
      if (showLine) {
        const [ax, ay] = positions[idxA];
        const [bx, by] = positions[idxB];
        const minX = Math.min(ax, bx);
        const minY = Math.min(ay, by);
        const w = Math.abs(ax - bx);
        const h = Math.abs(ay - by);
        const lineContainer = document.createElement('div');
        lineContainer.className = 'const-line';
        lineContainer.innerHTML = `
          <svg width="${w + 40}" height="${h + 40}" style="position:absolute; left:${minX}px; top:${minY}px; overflow:visible; pointer-events:none;">
            <line x1="${ax - minX}" y1="${ay - minY}" x2="${bx - minX}" y2="${by - minY}" 
                  stroke="${currentFilter === 'aries' ? 'rgba(255,138,174,0.7)' : 'rgba(255,255,255,0.4)'}" 
                  stroke-width="1.2" />
          </svg>`;
        galaxy.appendChild(lineContainer);
      }
    }
  });
}

function animateStars() {
  const positions = [];
  const starScale = zoom * 0.8;
  for (let i = 0; i < starsTotal; i++) {
    const [cx, cy] = spiralGalaxyPos(i, zoom, galaxyRotation);
    positions.push([cx, cy]);
    const isMainStar = (i <= 13 || (i >= 14 && i <= 22));
    const starSize = (isMainStar ? 8 : 4) * starScale;
    
    stars[i].style.width = starSize + 'px';
    stars[i].style.height = starSize + 'px';
    // ACELERACIÓN GPU: Usamos translate3d en lugar de left/top
    stars[i].style.transform = `translate3d(${cx - starSize / 2}px, ${cy - starSize / 2}px, 0)`;
    
    if (Math.random() > 0.99) { stars[i].style.opacity = Math.random(); }
  }
  drawConstellations(positions);
  return positions;
}

function drawGalaxyBackground(rot) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  if (canvas.width !== W) { canvas.width = W; canvas.height = H; }
  ctx.clearRect(0, 0, W, H);
  ctx.save(); ctx.translate(center.x, center.y);
  // Bajamos un poco la densidad de nubes de fondo solo para móviles
  const cloudCount = window.innerWidth < 600 ? 40 : 70;
  for (let arm = 0; arm < arms; arm++) {
    let theta0 = rot + arm * armSpread;
    for (let i = 0; i < cloudCount; i++) {
      let t = theta0 + i * 0.13;
      let r = (80 + i * 6) * zoom;
      ctx.beginPath();
      ctx.arc(Math.cos(t) * r, Math.sin(t) * r * 0.9, (38 + Math.random() * 20) * zoom, 0, 2 * Math.PI);
      ctx.globalAlpha = 0.06 - (i / 600);
      ctx.fillStyle = arm % 2 == 0 ? '#9644fd' : '#ff8aae';
      ctx.fill();
    }
  }
  ctx.restore();
}

function animate() {
  galaxyRotation += 0.0012;
  animateStars();
  drawGalaxyBackground(galaxyRotation);
  requestAnimationFrame(animate);
}

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

window.addEventListener('resize', () => {
  center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
});

const bgmusic = document.getElementById('bgmusic');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false;

musicBtn.onclick = function() {
  if (musicOn) { bgmusic.pause(); musicOn = false; musicBtn.textContent = '🎵 Encender música'; }
  else { bgmusic.play().then(() => { musicOn = true; musicBtn.textContent = '🎶 Apagar música'; }).catch(e => console.log(e)); }
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
  const count = W < 600 ? 3 : 5;
  for(let i=0;i<count;i++) {
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












