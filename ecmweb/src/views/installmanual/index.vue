<template>
  <div class="section-container">
    <!-- 左侧导航栏 -->
    <div class="nav-sidebar">
      <h3 class="nav-title">操作手册 - 安装手册</h3>
      <ul class="nav-list">
        <li v-for="section in sections" :key="section.id" class="nav-item">
          <button
            class="nav-btn"
            :class="{ active: activeSectionId === section.id }"
            @click="scrollToSection(section.id)"
          >
            {{ section.id }} . {{ section.title }}
          </button>
        </li>
      </ul>
    </div>

    <!-- 右侧内容区域（滚动容器） -->
    <div ref="contentContainerRef" class="content-container" @scroll="handleContentScroll">
      <div
        v-for="section in sections"
        :key="section.id"
        ref="sectionRefs"
        :data-section-id="section.id"
        class="section-item"
      >
        <h1 class="section-title">
          <span style="color: #3d7eff">{{ section.id }}.</span>
          &nbsp;{{ section.title }}
        </h1>
        <div class="section-content" v-html="section.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted } from "vue";
const mockSections = [
  {
    id: "1",
    title: "下载",
    content: "打开浏览器访问软件中心：<a href='https://www.epdent.cn/#/softwarecenter' style='color: #3d7eff' target='_blank'>https://www.epdent.cn/#/softwarecenter</a><br>或访问易齿盟网站：<a href='https://www.epdent.cn' style='color: #3d7eff' target='_blank'>https://www.epdent.cn</a>，再从顶部导航栏访问“软件中心”。<br /><br /><img src='/images/help/azsc1.png' width='100%'><br>点击【Win直接安装版】下载安装包<br><br /><img src='/images/help/azsc2.png' width='100%'><br>在安装了360杀毒软件的机器上，可能出现:<br /><br /><img src='/images/help/azsc3.png'><br>这时需信任恢复文件(360杀毒软件会将自定义安装的应用误判)<br><br><img src='/images/help/azsc4.png' ><br><img src='/images/help/azsc5.png' >"
  },
  {
    id: "2",
    title: "安装",
    content: "右击安装文件，在弹出菜单上选择【以管理员身份运行】；或双击安装文件【ecm.exe】，建议采用第一种方式安装，以确保安装权限足够<br /><br /><img src='/images/help/azsc6.png' ><br /><br />平台需要一定的环境，如果操作系统无需要的运行环境，则会首先安装运行环境<br /><br /><img src='/images/help/azsc7.png' ><br />有些电脑系统会直接弹出如下安装提示界面，点击【安装】即可；有些电脑不会直接弹出，但在最下面一行的任务栏里闪烁，需要用鼠标点击一下，才会显示：<br /><br /><img src='/images/help/azsc8.png' ><br>有些系统则弹出这样的界面<br /><br /><img src='/images/help/azsc9.png' ><br>点击【是】系统会自动安装运行环境<br /><br /><img src='/images/help/azsc10.png' ><br>运行环境安装完毕后，进入平台的安装界面点击【浏览】可指定安装位置，不建议安装在系统C盘<br /><br /><img src='/images/help/azsc11.png' ><br>点击【下一步】，确认勾选【创建桌面快捷方式】<br /><br /><img src='/images/help/azsc12.png' ><br>点击【下一步】<br /><br /><img src='/images/help/azsc13.png' ><br>点击【安装】<br /><br /><img src='/images/help/azsc14.png' ><br>点击【完成】运行平台"
  },
  {
    id: "3",
    title: "登录",
    content: "双击桌面【易齿盟口腔数字化平台】<br /><br /><img src='/images/help/azsc15.png' width='100%'><br />或在Windows菜单找到并双击【易齿盟口腔数字化平台】<br /><br /><img src='/images/help/azsc16.png' width='100%'><br />如果收到版本更新提示，点击【是】<br /><br /><img src='/images/help/azsc17.png' width='100%'>输入账号密码，或手机号验证码登录平台<br /><br /><img src='/images/help/azsc18.png' width='100%'>"
  },
  {
    id: "4",
    title: "卸载",
    content: "在Windows菜单找到【易齿盟口腔数字化平台】，单击右键，点击【卸载】<br /><br /><img src='/images/help/azsc19.png' width='100%'><br>"
  }
];
const sections = ref(mockSections);
const activeSectionId = ref(sections.value[0].id);
const contentContainerRef = ref(null);
const sectionRefs = ref([]);
const scrollToSection = (id) => {
  if (!contentContainerRef.value) return;
  const targetSection = sectionRefs.value.find((el) => el.dataset.sectionId === id);
  if (!targetSection) return;
  const targetTop = targetSection.offsetTop;
  contentContainerRef.value.scrollTo({
    top: targetTop,
    behavior: "smooth"
    // 平滑动画
  });
  activeSectionId.value = id;
};
const handleContentScroll = () => {
  if (!contentContainerRef.value) return;
  const scrollTop = contentContainerRef.value.scrollTop;
  const containerHeight = contentContainerRef.value.clientHeight;
  const threshold = scrollTop + containerHeight / 2;
  for (const sectionEl of sectionRefs.value) {
    const sectionId = sectionEl.dataset.sectionId;
    if (!sectionId) continue;
    const sectionTop = sectionEl.offsetTop;
    const sectionBottom = sectionTop + sectionEl.offsetHeight;
    if (threshold >= sectionTop && threshold < sectionBottom) {
      activeSectionId.value = sectionId;
      break;
    }
  }
};
onMounted(() => {
  activeSectionId.value = sections.value[0].id;
  const hash = window.location.hash.slice(1);
  if (hash && sections.value.some((s) => s.id === hash)) {
    scrollToSection(hash);
  }
});
</script>

<style lang="scss" scoped>
.section-container {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  padding-top: 10px;
  height: 806px;
  font-family: Noto Sans SC;
}

/* 左侧导航样式 */
.nav-sidebar {
  width: 230px;
  padding: 15px;
  position: sticky;
  top: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: #f5f5f5;
  font-family: Noto Sans SC;
  border-radius: 8px;
}

.nav-title {
  font-size: 19px;
  margin: 0 0 20px 0;
  color: #333;
  font-family: Noto Sans SC;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 15px;
}

.nav-btn {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: #f9fafb;
  color: #646a73;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
  transition: all 0.2s ease;
  font-family: Noto Sans SC;
  font-weight: 500;
}

.nav-btn.active {
  background: #2563eb;
  color: white;
}

.nav-btn:hover:not(.active) {
  background: #f3f4f6;
}

/* 右侧内容容器样式 */
.content-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto; /* 开启垂直滚动 */
  box-sizing: border-box;
  font-family: Noto Sans SC;
}

/* Section 内容样式 */
.section-item {
  margin-bottom: 40px;
  padding: 24px;
  border-radius: 8px;
  font-family: Noto Sans SC;
}

.section-title {
  font-size: 26px;
  margin: 0 0 16px 0;
  color: #111;
  font-family: Noto Sans SC;
}

.section-content {
  line-height: 1.8;
  color: #1f2329;
  white-space: pre-line; /* 保留换行（模拟大量文本排版） */
  font-family: Noto Sans SC;
}
</style>
