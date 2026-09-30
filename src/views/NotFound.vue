<!-- filepath: e:\Code\TauriDemo\vue.demos\pc.vue.demo\src\views\NotFound.vue -->
<template>
  <main class="not-found">
    <div class="content">
      <div class="illustration" aria-hidden="true">
        <span class="digit">4</span>
        <span class="planet">
          <span class="planet-ring"></span>
          <span class="planet-dot"></span>
        </span>
        <span class="digit">4</span>
      </div>

      <p class="eyebrow">PAGE NOT FOUND</p>
      <h1>哎呀，页面走丢了</h1>
      <p class="description">
        你访问的页面可能已被移动、删除，或者地址输入有误。
      </p>

      <div class="actions">
        <router-link class="button button-primary" to="/">返回首页</router-link>
        <button class="button button-secondary" type="button" @click="goBack">
          返回上一页
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = '/'
  }
}
</script>

<style scoped>
.not-found {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 40px 24px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 50% 42%, #ffffff 0%, #f7f8ff 55%, #eef1ff 100%);
  color: #20243a;
  text-align: center;
}

.content {
  width: min(100%, 560px);
}

.illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 190px;
  margin-bottom: 8px;
}

.digit {
  color: #6c63ff;
  font-size: clamp(112px, 24vw, 176px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -12px;
  text-shadow: 0 12px 30px rgb(108 99 255 / 18%);
}

.planet {
  position: relative;
  display: grid;
  width: 108px;
  height: 108px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(145deg, #ffcf70, #ff8e72);
  box-shadow: 0 16px 36px rgb(255 142 114 / 30%);
}

.planet::before,
.planet::after {
  position: absolute;
  width: 100%;
  height: 18px;
  border: 3px solid #6c63ff;
  border-radius: 50%;
  content: "";
  transform: rotate(-25deg);
}

.planet::after {
  width: 132px;
  height: 34px;
  border-color: rgb(108 99 255 / 35%);
}

.planet-ring {
  z-index: 1;
  width: 38px;
  height: 38px;
  border: 5px solid rgb(255 255 255 / 75%);
  border-radius: 50%;
}

.planet-dot {
  position: absolute;
  top: 22px;
  right: 22px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #fff;
}

.eyebrow {
  margin: 20px 0 10px;
  color: #6c63ff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
}

h1 {
  margin: 0;
  font-size: clamp(26px, 5vw, 36px);
  font-weight: 700;
}

.description {
  margin: 14px 0 30px;
  color: #7b8096;
  font-size: 15px;
  line-height: 1.8;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.button {
  display: inline-flex;
  min-width: 132px;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button-primary {
  background: #6c63ff;
  box-shadow: 0 8px 18px rgb(108 99 255 / 24%);
  color: #fff;
}

.button-secondary {
  border-color: #e1e3ef;
  background: #fff;
  color: #555a70;
}

@media (max-width: 480px) {
  .illustration {
    height: 150px;
    gap: 8px;
  }

  .planet {
    width: 78px;
    height: 78px;
  }

  .planet::after {
    width: 100px;
  }

  .digit {
    letter-spacing: -8px;
  }
}
</style>