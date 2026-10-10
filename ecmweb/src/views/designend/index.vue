<template>
  <div class="section-container">
    <!-- 左侧导航栏 -->
    <div class="nav-sidebar">
      <h3 class="nav-title">操作手册 - 设计端</h3>
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
    title: "登录",
    content: "请先前往下载桌面端【易齿盟数字化平台】：<a href='#/installmanual' style='color: #3d7eff' >安装手册</a>、双击桌面【易齿盟口腔数字化平台】<br /><br /><img src='/images/help/sjd1.png' width='100%'><br />或在Windows菜单找到并双击【易齿盟口腔数字化平台】<br /><br /><img src='/images/help/sjd2.png' width='100%'><br />如果收到版本更新提示，点击【是】<br /><br /><img src='/images/help/sjd3.png' width='100%'><br />输入账号密码，或手机号验证码登录平台<br /><br /><img src='/images/help/sjd4.png' width='100%'><br />设计师现在开始接单吗？如果准备好开始接新单点击【确认】，如果只是登录平台查看订单或处理之前的订单，点击【取消】<br /><br /><img src='/images/help/sjd5.png' width='100%'>"
  },
  {
    id: "2",
    title: "界面总览",
    content: "登陆后默认显示【设计管理】窗口左边区域展示订单分类和订单列表，右边区域为消息中心，右上角有上班状态、待设计提醒、未读消息提醒等<br /><br /><img src='/images/help/sjd6.png' width='100%'>"
  },
  {
    id: "3",
    title: "待设计",
    content: "点击右上角的【待设计】提醒，或左侧区域的【待设计】分类，查看“待设计”状态的订单列表<br /><br /><img src='/images/help/sjd7.png' width='100%'><br />点击【接单】后，订单会进入“设计中”状态"
  },
  {
    id: "4",
    title: "设计中",
    content: "点击左侧区域的【设计中】分类，查看“设计中”状态的订单列表<br /><br /><img src='/images/help/sjd8.png' width='100%'><br />点击【详情】查看订单详情，右侧区域可发送消息和订单相关人员进行沟通<br /><br /><img src='/images/help/sjd9.png' width='100%'><br />右侧切换到【数据资料】栏，查看订单资料，点击【上传】选择设计资料<br /><br /><img src='/images/help/sjd10.png' width='100%'><br>设计资料上传成功后，点击【设计完成】<br /><br /><img src='/images/help/sjd11.png' width='100%'><br>完成后订单变成“待制作”状态，在加工厂接单前，可点击左下角【取消完成】撤销设计完成操作<br /><br /><img src='/images/help/sjd12.png' width='100%'>"
  },
  {
    id: "5",
    title: "我的订单",
    content: "【我的订单】分类会展示当前设计师名下的所有订单，包括已完成设计的订单可输入订单号、医生/患者姓名进行查询，或指定下单时间区域进行筛选<br /><br /><img src='/images/help/sjd13.png' width='100%'>"
  },
  {
    id: "6",
    title: "设计待问",
    content: "设计中的订单，如果有信息需要等待审核或诊所确认，可点击【设计待问】标记订单<br /><br /><img src='/images/help/sjd14.png' width='100%'><br />标记待问的订单左上角会有？标记，再次点击待问键可【取消待问】<br /><br /><img src='/images/help/sjd15.png' width='100%'><br>在设计管理窗口，点击左侧的【设计待问】分类，可查看所有待问订单<br /><br /><img src='/images/help/sjd16.png' width='100%'>"
  },
  {
    id: "7",
    title: "返工件",
    content: "【返工件】分类会展示当前设计师名下的所有返工订单<br /><br /><img src='/images/help/sjd17.png' width='100%'>"
  },
  {
    id: "8",
    title: "消息中心",
    content: "右侧的消息中心顶部可进行切换，【消息列表】展示所有订单相关的会话，【我的消息】展示当前用户和其他用户（例如平台审核员）单独建立的聊天会话<br /><br /><img src='/images/help/sjd18.png' width='100%'><br>在左侧的订单列表单击选中一个订单后，右侧消息栏会自动打开该订单相关的聊天房间，点击房间抬头可快速打开该订单的详情窗口<br /><br /><img src='/images/help/sjd19.png' width='100%'><br />点击右上方的【未读消息】或刷新键，可快速跳转回设计管理的总消息列表<br /><br /><img src='/images/help/sjd20.png' width='100%'>"
  },
  {
    id: "9",
    title: "个人中心",
    content: "点击右上角头像，点击【个人中心】进入“个人中心”页面<br /><br /><img src='/images/help/sjd21.png' width='100%'><br /><span style='color: #3d7eff'>9.1 账户设置</span><br>点击编辑可修改用户昵称和姓名<br /><br /><img src='/images/help/sjd22.png' width='100%'><br /><span style='color: #3d7eff'>9.2 安全设置</span><br>账号安全相关设置，可以修改密码、修改绑定的手机<br /><br /><img src='/images/help/sjd23.png' width='100%'>"
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
  font-family: Noto Sans SC;
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
