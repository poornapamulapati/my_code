/* =====================================================
   HOME.JS — Particle Canvas, Hero Animations
   ===================================================== */

// ---- PARTICLE SYSTEM ----
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(255,215,0,0.6)',
    'rgba(230,168,23,0.4)',
    'rgba(184,134,11,0.3)',
    'rgba(255,200,0,0.5)',
  ];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * (W || window.innerWidth);
      this.y = Math.random() * (H || window.innerHeight);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife) this.reset();
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,215,0,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ---- PARALLAX ON MOUSE MOVE ----
(function () {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  document.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 15;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 10;
    hero.style.transform = `translate(${xRatio * 0.3}px, ${yRatio * 0.3}px)`;
  });
})();

// ---- HERO TEXT TYPING EFFECT for roles ----
// Already handled by CSS animations
