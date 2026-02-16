
const dedications = [
  "Sin ti, la galaxia sería fría, oscura y vacía.",
  "Eres mi estrella eterna, la que siempre guía mi corazón.",
  "Tú le das vida y color a mi universo.",
  "Siempre serás la mejor estrella que el mundo podría tener.",
  "A tu lado, cualquier noche brilla más hermoso.",
  "Tus abrazos son mi vía láctea, mi refugio infinito.",
  "No hay constelación más perfecta que tu risa y tu luz.",
  "Gracias a ti, el infinito tiene sentido.",
  "Eres el motivo por el que todas las estrellas quieren brillar.",
  "Me enamoré de tu brillo... y ya no supe vivir sin ti."
];

const whispersArr = [
  "Tú eres mi centro galáctico", "Nuestro amor brilla entre las estrellas", "Por siempre juntos",
  "Eres mi todo", "Mi estrella favorita", "Luz de mi vida", "Siempre tuyo", "Destino galáctico"
];

const arms = 3;
const armSpread = Math.PI / arms;
const starsTotal = dedications.length;
let galaxyRotation = 0;

const galaxy = document.getElementById("galaxy");
const dedicationBox = document.getElementById("dedication");
const dedicationText = document.querySelector(".dedication-text");
const canvas = document.getElementById("galaxyCanvas");
let stars = [];
let zoom = 1;
let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function spiralGalaxyPos(i, z, rotation) {
  const baseAngle = (i * arms / starsTotal) * 2 * Math.PI;
  const armAngle = ((i % arms) * armSpread);
  const theta = baseAngle + armAngle + rotation;
  // Aumentamos el radio para que no estén tan amontonadas
  const r = 180 + 70 * Math.sqrt(i + 1) * z; 
  const x = center.x + Math.cos(theta) * r;
  const y = center.y + Math.sin(theta) * (r * 0.85);
  return [x, y];
}

function createStars() {
  galaxy.innerHTML = ''; stars = [];
  for (let i = 0; i < starsTotal; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    galaxy.appendChild(star);
    stars.push(star);
    
    star.addEventListener('click', e => {
      e.stopPropagation();
      // EFECTO ZOOM AL HACER CLIC
      zoom = 3.5; 
      
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

// HEMOS ELIMINADO DRAWCONSTELLATIONS (LAS RAYAS SIN SENTIDO)

function animateStars() {
  for (let i = 0; i < starsTotal; i++) {
    const [cx, cy] = spiralGalaxyPos(i, zoom, galaxyRotation);
    stars[i].style.left = (cx - 10) + 'px';
    stars[i].style.top = (cy - 10) + 'px';
    
    // Estrellas más brillantes y grandes al hacer zoom
    const size = 15 + (zoom * 2);
    stars[i].style.width = size + 'px';
    stars[i].style.height = size + 'px';
  }
}

function drawGalaxyBackground(rot) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // EFECTO DE NÚCLEO GALÁCTICO (Más calidad)
  const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 400 * zoom);
  gradient.addColorStop(0, 'rgba(60, 20, 100, 0.3)');
  gradient.addColorStop(0.5, 'rgba(20, 0, 40, 0.1)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(rot);

  // Dibujar "polvo galáctico" para mejorar la calidad visual
  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < 50; i++) {
      let t = (arm * armSpread) + (i * 0.1);
      let r = (20 + i * 10) * zoom;
      ctx.beginPath();
      ctx.arc(Math.cos(t) * r, Math.sin(t) * r * 0.8, 40 * zoom, 0, Math.PI * 2);
      ctx.fillStyle = arm % 2 == 0 ? 'rgba(150, 80, 255, 0.03)' : 'rgba(255, 100, 200, 0.03)';
      ctx.fill();
    }
  }
  ctx.restore();

  // Estrellas de fondo infinitas
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  galaxyRotation += 0.002;
  animateStars();
  drawGalaxyBackground(galaxyRotation);
  requestAnimationFrame(animate);
}

// ZOOM CON EL MOUSE (Suave)
galaxy.addEventListener('wheel', e => {
  zoom += e.deltaY * -0.001;
  zoom = Math.max(0.5, Math.min(5, zoom));
});

// Lógica de música y botones (Se mantiene lo funcional anterior)
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
    musicBtn.textContent = '🎵 Encender música';
  } else {
    bgmusic.play().then(() => {
      musicOn = true;
      musicBtn.textContent = '🎶 Apagar música';
    });
  }
};

function spawnHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = '❤️';
  heart.style.left = x + 'px'; heart.style.top = y + 'px';
  galaxy.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}

createStars();
animate();
