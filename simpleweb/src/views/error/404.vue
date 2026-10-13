<template>
  <div class="page-container">
    <h2>404 页面</h2>
    <img src="@assets/images/commonImages/404.svg" alt="404" style="width: 300px; margin: 20px 0;" />
    <p>抱歉，您访问的页面不存在。</p>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
}

.page-container {
  min-height: 100vh;
  box-sizing: border-box;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>