
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

// Whisper messages, flotan en el fondo
const whispersArr = [
  "Tú eres mi centro galáctico", "Nuestro amor brilla entre las estrellas", "Por siempre juntos",
  "Eres mi todo", "Mi estrella favorita", "Luz de mi vida", "Siempre tuyo", "Destino galáctico"
];

// Parámetros galaxia y constelaciones
const arms = 3;
const armSpread = Math.PI/arms;
const starsTotal = dedications.length;
let galaxyRotation = 0;
const constellation = [[0,2,4,6],[1,3,5,7],[2,8,9]]; // ¿Enlazamos algunas estrellas?

const galaxy = document.getElementById("galaxy");
const dedicationBox = document.getElementById("dedication");
const dedicationText = document.querySelector(".dedication-text");
const canvas = document.getElementById("galaxyCanvas");
let stars = [];
let zoom = 1;
let center = {x: window.innerWidth/2, y: window.innerHeight/2};

// Distribución estilo espiral galáctica
function spiralGalaxyPos(i, zoom, rotation) {
  const baseAngle = (i*arms / starsTotal) * 2 * Math.PI;
  const armAngle = ((i % arms) * armSpread);
  const spiral = 2 + i*1.07*zoom;
  const theta = baseAngle + armAngle + rotation;
  const r = 240 + 55*Math.sqrt(i+1)*zoom + Math.cos(i*0.7+rotation)*24;
  const x = center.x + Math.cos(theta) * r + Math.sin(i*1.31)*10;
  const y = center.y + Math.sin(theta) * (r*0.88) + Math.cos(i*1.16)*9;
  return [x, y];
}

// Crear estrellas DOM
function createStars() {
  galaxy.innerHTML = ''; stars = [];
  for(let i=0;i<starsTotal;i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.dataset.star = i;
    if(i===0) star.title = "Eres mi estrella especial.";
    galaxy.appendChild(star); stars.push(star);
    star.addEventListener('click', e => {
      e.stopPropagation();
      dedicationBox.style.display = 'block';
      dedicationText.textContent = dedications[i];
      let x = parseFloat(star.style.left)+36;
      let y = parseFloat(star.style.top)-18;
      if(x > window.innerWidth * 0.85) x -= 220;
      if(y > window.innerHeight * 0.7) y -= 120;
      dedicationBox.style.left = x+'px';
      dedicationBox.style.top  = y+'px';
      spawnHeart(x,y);
    });
  }
}

// Dibujar y animar constelaciones (SVG lines)
function drawConstellations(positions) {
  // borrar líneas previas
  document.querySelectorAll('.const-line').forEach(l=>l.remove());
  for(let arr of constellation){
    for(let j=0;j<arr.length-1;j++){
      let idxA = arr[j], idxB=arr[j+1];
      let [ax,ay] = positions[idxA], [bx,by] = positions[idxB];
      let line = document.createElement('div');
      line.className = 'const-line';
      line.innerHTML = `<svg width="${Math.abs(ax-bx)}" height="${Math.abs(ay-by)}" style="position:absolute;left:${Math.min(ax,bx)}px;top:${Math.min(ay,by)}px;"><line x1="${ax>bx?Math.abs(ax-bx):0}" y1="${ay>by?Math.abs(ay-by):0}" x2="${ax<bx?Math.abs(ax-bx):0}" y2="${ay<by?Math.abs(ay-by):0}" stroke="#fff0fa" stroke-width="2" stroke-linecap="round" opacity="0.4"/></svg>`;
      galaxy.appendChild(line);
    }
  }
}

// Animar estrellas en brazos y girar galaxia
function animateStars() {
  const positions = [];
  for(let i=0;i<starsTotal;i++) {
    const [cx, cy] = spiralGalaxyPos(i, zoom, galaxyRotation);
    positions.push([cx,cy]);
    stars[i].style.left = (cx-11)+'px';
    stars[i].style.top  = (cy-11)+'px';
    stars[i].style.background = i%2==0
      ? "radial-gradient(circle at 40% 30%, #fff9de 0%, #dfc7ff 70%, #a146fa10 100%)"
      : "radial-gradient(circle at 50% 50%, #ffe1f1 0%, #b2b0ff 60%, #a146fa10 100%)";
    if(i===0) stars[i].style.boxShadow = '0 0 48px 22px #feeafc, 0 0 120px 27px #e8b8fa5c';
  }
  drawConstellations(positions);
  return positions;
}

// Animación de fondo galaxia visual realista
function drawGalaxyBackground(rot) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.translate(center.x, center.y);
  for(let arm=0; arm<arms; arm++){
    let theta0 = rot + arm*armSpread;
    for(let i=0; i<70; i++){
      let t = theta0 + i*0.13;
      let r = 80+i*6;
      ctx.beginPath();
      ctx.arc(Math.cos(t)*r, Math.sin(t)*r*0.9, 38+Math.random()*27, 0, 2*Math.PI);
      ctx.closePath();
      ctx.globalAlpha = 0.11-(i/420) + Math.random()*0.05;
      ctx.fillStyle = `rgba(${150+arm*36},${135+arm*13},${230-arm*18},${0.52-arm*0.099})`;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1; ctx.restore();
  // Estrellas fondo
  for(let i=0;i<230;i++){
    let x = Math.random()*W, y = Math.random()*H;
    ctx.beginPath(); ctx.arc(x, y, Math.random()*1.8+0.2,0,2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,238,250,${0.18 + Math.random()*0.23})`;
    ctx.fill();
  }
}

let animFrame;
function animate() {
  galaxyRotation += 0.0037;
  animateStars();
  drawGalaxyBackground(galaxyRotation);
  animFrame = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  center = {x: window.innerWidth/2, y: window.innerHeight/2};
  drawGalaxyBackground(galaxyRotation);
});

// --------- Zoom ---------

function checkZoomMsg() {
  const msg = document.getElementById('zoomMessage');
  if (zoom > 4.3) {
    msg.textContent = "Sin ti todo sería una galaxia fría y oscura, tú eres mi estrella eterna ⭐";
    msg.style.display = 'block';
    setTimeout(() => { msg.style.display = 'none'; }, 3600);
  }
}

// Zoom con ratón
galaxy.addEventListener('wheel', e => {
  zoom += e.deltaY * -0.001;
  zoom = Math.max(0.8, Math.min(4.7, zoom));
  checkZoomMsg();
});

// Zoom para móviles (Pinch zoom)
let initialDist = null;
galaxy.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    if (initialDist !== null) {
      if (dist > initialDist) zoom += 0.05;
      else zoom -= 0.05;
      zoom = Math.max(0.8, Math.min(4.7, zoom));
      checkZoomMsg();
    }
    initialDist = dist;
  }
}, { passive: false });

galaxy.addEventListener('touchend', () => {
  initialDist = null;
});

// -------- Dedicatoria y corazones -------
dedicationBox.querySelector('.close').onclick = () => dedicationBox.style.display = 'none';
document.body.addEventListener('click', e => {
  if (!e.target.classList.contains('star') && !e.target.classList.contains('dedication')) {
    dedicationBox.style.display = 'none';
  }
});

// -------- Bienvenida / Música --------
const bgmusic = document.getElementById('bgmusic');
const musicBtn = document.getElementById('musicBtn');
let musicOn = false; // Variable faltante agregada

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
    const playPromise = bgmusic.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicOn = true;
        musicBtn.classList.add('on');
        musicBtn.textContent = '🎶 Apagar música';
      }).catch(error => {
        console.error("Error al reproducir:", error);
        alert("Haz clic una vez más para activar la música ✨");
      });
    }
  }
};

bgmusic.volume = 0.4;

// Corazones flotantes
function spawnHeart(x, y){
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = `<svg viewBox="0 0 32 29" style="width:30px;height:28px;">
  <path d="M16 29s-13-8.2-13-17C3 3.6 13 1.6 16 9c3-7.4 13-5.4 13 3C29 20.8 16 29 16 29z"
    fill="#ff8aae" stroke="#fff6f9" stroke-width="1"/>
  </svg>`;
  heart.style.left = x+'px'; heart.style.top = y+'px';
  galaxy.appendChild(heart); setTimeout(()=>heart.remove(),7000);
}

// Mensajes de susurros flotando
function spawnWhispers() {
  const layer = document.getElementById('whispers');
  layer.innerHTML = '';
  const W = window.innerWidth;
  for(let i=0;i<5;i++) {
    setTimeout(()=>{
      let el = document.createElement('div'); el.className='whisper';
      let txt = whispersArr[Math.floor(Math.random()*whispersArr.length)];
      el.textContent = txt;
      let left = 50+Math.random()*(W-180);
      el.style.left = left+'px';
      el.style.top = (window.innerHeight - 40 - Math.random()*120) + 'px';
      el.style.fontSize = (28+Math.random()*12)+'px';
      layer.appendChild(el);
      setTimeout(()=>{el.remove();},22000);
    },8000+i*3200 + Math.random()*3400);
  }
}

// Opciones iniciales visibles/invisibles:
document.getElementById('musicControl').style.display = 'none';
canvas.style.display = 'none';
document.getElementById('whispers').style.display = 'none';

createStars();
animate();
setInterval(spawnWhispers,10500);

