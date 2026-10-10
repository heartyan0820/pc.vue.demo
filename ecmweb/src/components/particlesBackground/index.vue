<template>
  <div class="particles-container">
    <canvas ref="canvas" class="particles-canvas"></canvas>
  </div>
</template>

<script setup>
const canvas = ref(null);
let ctx;
let particles = [];
let animationId;

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // 边界检测，让粒子在屏幕内反弹
    if (this.x < 0 || this.x > canvas.value.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.value.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 初始化粒子
function initParticles() {
  particles = [];
  const particleCount = Math.floor((canvas.value.width * canvas.value.height) / 10000);
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.value.width;
    const y = Math.random() * canvas.value.height;
    particles.push(new Particle(x, y));
  }
}

// 绘制连线（距离小于一定值时连线）
function drawConnections() {
  const maxDistance = 100;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.strokeStyle = `rgba(0, 0, 0, ${1 - distance / maxDistance})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// 动画循环
function animate() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawConnections();

  animationId = requestAnimationFrame(animate);
}

// 初始化 Canvas
function initCanvas() {
  canvas.value.width = canvas.value.offsetWidth;
  let x = canvas.value.width;
  canvas.value.height = canvas.value.offsetHeight;
  let y = canvas.value.height;
  ctx = canvas.value.getContext("2d");
  initParticles();
  animate();
}

// 监听窗口大小变化
function handleResize() {
  cancelAnimationFrame(animationId);
  initCanvas();
}

onMounted(() => {
  initCanvas();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: #fff;
}

.particles-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
