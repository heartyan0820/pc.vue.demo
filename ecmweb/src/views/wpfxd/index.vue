<template>
  <div></div>
</template>
<script setup>defineOptions({
  name: "wpfxd",
  inheritAttrs: false
});
import router from "@/router";
import { getAccessToken } from "@/utils/auth";
const isLogins = getAccessToken();
const route = useRoute();
const count = ref(0);
const projectid = ref(route.query.projectid);
const projectname = ref(route.query.projectname);
const timer = ref();
function wpflogin() {
  if (isLogins) {
    const url = {
      path: "/wpforder",
      query: {
        name: projectname.value,
        id: projectid.value
      }
    };
    router.push(url).then(() => {
      window.location.reload();
    }).catch(() => {
      window.location.reload();
    });
  } else {
    if (count.value < 1) {
      window.location.reload();
    } else {
      ElNotification({
        title: "Error",
        message: `用户信息不存在!`,
        type: "error",
        duration: 3e3
      });
    }
  }
}
onUnmounted(() => {
  clearInterval(timer.value);
});
onMounted(() => {
  timer.value = setInterval(() => {
    wpflogin();
  }, 1e3);
});
</script>
