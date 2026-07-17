const canvas = document.getElementById('wind-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouse = { x: -1000, y: -1000, active: false };

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener('mouseleave', () => {
  mouse.active = false;
});

class WindParticle {
  constructor() {
    this.reset();
    this.x = Math.random() * width;
  }

  reset() {
    this.x = Math.random() * -200;
    this.y = Math.random() * height;
    this.speed = 0.5 + Math.random() * 1.5;
    this.life = Math.random() * 200 + 150;
    this.maxLife = this.life;
    this.baseAlpha = 0.05 + Math.random() * 0.12;
    this.color = Math.random() > 0.7 ? '223, 177, 91' : '255, 255, 255';
  }

  update(time) {
    let angle = Math.sin(this.x * 0.002) * Math.cos(this.y * 0.003 + time * 0.0003) * 1.5;

    if (mouse.active) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180;
        angle += Math.atan2(dy, dx) * force * 1.2;
        this.speed += 0.05;
      }
    }

    this.x += Math.cos(angle) * this.speed + 0.8;
    this.y += Math.sin(angle) * this.speed * 0.5;

    this.life--;

    if (this.x > width + 200 || this.y < -100 || this.y > height + 100 || this.life <= 0) {
      this.reset();
    }
  }

  draw() {
    let currentAlpha = (this.life / this.maxLife) * this.baseAlpha;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${this.color}, ${currentAlpha})`;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 40, this.y);
    ctx.stroke();
  }
}

const particles = Array.from({ length: 70 }, () => new WindParticle());

function renderLoop(time) {
  ctx.fillStyle = 'rgba(5, 5, 7, 0.12)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update(time);
    p.draw();
  });

  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
