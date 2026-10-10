<template>
  <vue-particles
    v-if="className == 'app-mains' || className == 'app-rzjxmain' || className == 'app-aboutmain'"
    id="tsparticles"
    ref="targetDiv"
    :style="{ height: appMainHeights }"
    :options="particlesOptions"
  />
  <div :class="className">
    <section style="width: 1220px; display: flex; margin: 0 auto">
      <router-view @callheadermethod="handleCallHeaderMethod" @featchMyNotice="featchMyNotice">
        <template #default="{ Component, route }">
          <transition enter-active-class="animate__animated animate__fadeIn" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </template>
      </router-view>
    </section>
  </div>
</template>

<script setup>import { useSettingsStore } from "@/store";
import variables from "@/styles/variables.module.scss";
const route = useRoute();
const className = ref("app-main");
const targetDiv = ref();
const appMainHeights = ref("820px");
watch(
  () => route.path,
  // 监听路由路径变化
  () => {
    if (route.path == "/index") {
      className.value = "app-mains";
      appMainHeights.value = "1500px";
    } else if (route.path == "/softwarecenter") {
      className.value = "app-rzjxmain";
      appMainHeights.value = "820px";
    } else if (route.path == "/about" || route.path == "/contact") {
      className.value = "app-aboutmain";
      appMainHeights.value = "820px";
    } else {
      className.value = "app-main";
    }
  },
  { immediate: true }
  // 初始加载时立即执行
);
const appMainHeight = computed(() => {
  if (useSettingsStore().tagsView) {
    return `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]} - 7px);`;
  } else {
    return `calc(100vh - ${variables["navbar-height"]})`;
  }
});
const particlesOptions = ref({
  background: {
    color: {
      value: "white"
    }
  },
  fullScreen: {
    enable: false
  },
  opacity: {
    value: 1,
    random: true
  },
  fpsLimit: 10,
  interactivity: {
    detect_on: "none",
    events: {
      onClick: {
        enable: false,
        mode: "push"
      },
      onHover: {
        enable: false,
        mode: "attract"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 150,
        // 鼠标吸引范围（越大吸引越远的粒子）
        line_linked: {
          opacity: 10
          // 吸引时连线透明度（变浓，突出效果）
        }
      },
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      //value: "random",
      value: "#D6D6D6",
      animation: {
        enable: true,
        speed: 20,
        sync: true
      }
    },
    links: {
      color: "random",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    move: {
      direction: "random",
      enable: false,
      outModes: "bounce",
      random: false,
      speed: 2,
      straight: false
    },
    number: {
      density: {
        enable: true,
        value_area: 1
        // 密度区域（值越小越密集）
      },
      value: 139
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: "circle"
    },
    size: {
      value: { min: 1, max: 5 },
      anim: {
        enable: true,
        // 大小动画
        speed: 2,
        // 动画速度
        size_min: 0.1
        // 最小大小
      }
    }
  },
  detectRetina: true
});
const emit = defineEmits(["callheadermethods", "featchMyNotice"]);
function handleCallHeaderMethod() {
  emit("callheadermethods");
}
function featchMyNotice() {
  emit("featchMyNotice");
}
</script>

<style lang="scss" scoped>
.app-main {
  display: flex;
  position: relative;
  width: 100%;
  background-color: #fff;
  margin: 0 auto;
}
#tsparticles {
  position: absolute;
  width: 100%;
  z-index: 1;
  height: 60px;
  pointer-events: none;
}
.app-mains {
  width: 100%;
  display: flex;
  position: relative;
  background-color: #fff;
  // background-image: url(/images/bj.png);
  margin: 0 auto;
}
.app-rzjxmain {
  width: 100%;
  display: flex;
  position: relative;
  background-color: #6382a9;
  // background-image: url(/images/bjs.png);
  margin: -9px auto;
}
.app-aboutmain {
  width: 100%;
  display: flex;
  position: relative;
  background-color: #fff;
  // background-image: url(/images/bj.png);
  margin: 0 auto;
}
</style>
