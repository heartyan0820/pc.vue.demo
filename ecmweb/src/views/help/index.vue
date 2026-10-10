<template>
  <div class="section-container">
    <!-- 左侧导航栏 -->
    <div class="nav-sidebar">
      <h3 class="nav-title">操作手册 - 门诊端</h3>
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
        <div
          :ref="(el) => el && bindContentClick(el)"
          class="section-content"
          v-html="section.content"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>import { ref, onMounted } from "vue";
const mockSections = [
  {
    id: "1",
    title: "首页",
    content: "易齿盟网页版首页有以下5个重要区域：<br /><span style='color: #3d7eff'>1.</span> 头部导航栏： 访问网站主要页面， 包括游客可访问的【 首页】、【 软件中心】、【 关于我们】， 以及登录后才能访问的【 订单管理】，【 成员管理】 等 <br /><span style='color: #3d7eff'>2.</span> 在线下单： 选择项目类型在线下单 <br /><span style='color: #3d7eff'>3.</span> 快捷导航： 快捷跳转到平台常用功能页面 <br /><span style='color: #3d7eff'>4.</span> AI机器人： 易齿盟AI助手， 可帮助用户进行下单， 未来会继续推出查单、 改单等高级功能 <br /><span style='color: #3d7eff'>5.</span> 登录管理 / 个人中心 <br /><br /><img src='/images/help/sy1.png' width='100%'>"
  },
  {
    id: "2",
    title: "登录",
    content: "点击右上角图标进行登录，或点击下单、订单管理等用户专有功能后自动跳转到登录页面<br /><br /><img src='/images/help/dl1.png' width='100%'><br /><br />填写用户名/手机号和密码后，点击【立即登录】，也可切换登录方式使用手机号验证码登录<br /><br /><img src='/images/help/dl2.png' width='100%'><br />验证通过后，如果账号关联了多个机构，选择想要登入的机构<br /><br /><img src='/images/help/xd1.png' width='100%'>"
  },
  {
    id: "3",
    title: "在线下单",
    content: "在首页的在线下单区选择想要下单的项目类型，进入下单流程<br /><br /><img src='/images/help/xd01.png' width='100%'><span style='color: #000000;font-weight:bold;font-size: 22px;'>3.1 基本信息</span> <br />填写病例信息，上传数据资料（也可选择在最后一步上传资料，此处上传资料后可立即进行下一步，资料会继续在后台进行上传处理），点击【下一步】<br /><br /><img src='/images/help/xd2.png' width='100%'><br /><span style='color: #000000;font-weight:bold;font-size: 22px;'>3.2 项目详情</span> <br />根据所选项目，填写项目详情<br />左侧牙位图选择牙位/孔位，以及单/连冠型号；右侧选择材质，并填写颜色、型号等附加信息。如同一个订单包含多个项目，可在最上方点击【新增项目】<br />全部信息填写完成后，点击【下一步】<br /><img src='/images/help/xd3.png' width='100%'><span style='color: #000000;font-weight:bold;font-size: 22px;'>3.3 确认订单</span><br />确认全部订单信息，可直接在表单内进行编辑或返回上一步编辑<br />确认完成后，点击【提交订单】<br /><img src='/images/help/xd4.png' width='100%'><br>如有重要信息确认弹窗，勾选“我确认...”并点击【确认】<br><img src='/images/help/xd5.png' style='margin: 0 auto;display: flex;justify-content: center;align-items: center;' width='396px'>订单创建成功，可等待页面自动跳转，或点击【订单列表】/【订单详情】直接进行跳转<br><img src='/images/help/xd6.png'  width='100%'>"
  },
  {
    id: "4",
    title: "订单管理",
    content: "订单管理主页面分为三个区域：<br /><span style='color: #3d7eff'>1.</span> 订单统计<br /><span style='color: #3d7eff'>2.</span> 订单列表<br /><span style='color: #3d7eff'>3.</span> 消息列表<br>右上方有最近刷新时间戳，点击可进行页面刷新获取最新订单数据<br><br><span style='color: #000000;font-weight:bold;font-size: 22px;'>4.1 订单统计</span> <br />订单统计区展示了四种状态订单的数量总计，包括“全部订单”、“审核中”、“生产中”、“已完成”<br>点击任意色块可对下方订单列表进行状态筛选<br><img src='/images/help/tj1.png' width='100%'><br><br><span style='color: #000000;font-weight:bold;font-size: 22px;'>4.2 订单列表</span> <br />订单列表分为上半部的筛选区和下半部的订单展示区，可用时间范围/患者姓名/医生姓名/订单号对订单进行筛选<br /><img src='/images/help/tj2.png' width='100%'><br>状态列展示订单状态信息，序号列展示订单序号以及下列特殊标记：<br><img src='/images/help/tj3.png' ><br />单击选中任意订单后，右侧消息栏会联动展示该订单相关消息。<br><br><span style='color: #000000;font-weight:bold;font-size: 22px;'>4.3 消息列表</span> <br />消息列表置顶的“ECM AI”会话是易齿盟AI助手，可辅助用户进行智能下单，详见手册<span style='color: #3d7eff;cursor: pointer;' id='content-anchor'>6. 易齿盟AI</span><br>AI助手下方是订单相关的会话，会话名称为“【患者名字】|【诊所名字】”<br><img src='/images/help/tj4.png'><br>单击任意会话进入聊天房间，查看历史消息或发送新消息<br><img src='/images/help/tj5.png'><br>也可在左侧订单列表单击选中订单，右侧消息栏会自动进入该订单相关的聊天房间，点击右侧上方的导航栏切换查看订单的数据资料和日志<br>再次点击选中的订单或点击筛选区【重置】键取消选中，回到消息主列表<br><img src='/images/help/tj6.png' width='100%'><br><span style='color: #000000;font-weight:bold;font-size: 22px;'>4.4 订单详情</span> <br />在订单列表区域点击右方的详情键，可进入订单详情页<br />订单详情页左侧展示病历信息、订单的项目详情和医生要求，右侧栏展示订单相关的对话窗口，切换可查看订单的数据资料和日志<br><img src='/images/help/tj7.png' width='100%'><br>平台审核员接单前，用户可以点击【编辑订单】对订单做修改，在数据资料区也可删除已有资料以及上传新的资料；审核员接单后，【编辑订单】会被禁用，如果有任何改动，需在消息窗口联系审核员进行处理<img src='/images/help/tj8.png' width='100%'><br>"
  },
  {
    id: "5",
    title: "个人中心",
    content: "点击右上角头像，点击【个人中心】进入“个人中心”页面；也可点击页头导航栏的【成员管理】快速访问“成员管理”页面<br /><img src='/images/help/gr1.png' width='100%'><br /><span style='color: #000000;font-weight:bold;font-size: 22px;'>5.1 账户设置</span> <br />点击编辑可修改用户昵称和姓名<br /><img src='/images/help/gr2.png' width='100%'><br /><span style='color: #000000;font-weight:bold;font-size: 22px;'>5.2 安全设置</span> <br />账号安全相关设置<br /><img src='/images/help/gr3.png' width='100%'><br /><span style='color: #000000;font-weight:bold;font-size: 22px;'>5.3 资质认证</span> <br />此页面只有诊所管理员可以访问<br /><img src='/images/help/gr4.png' width='100%'><span style='color: #000000;font-weight:bold;font-size: 22px;'>5.4 成员管理</span> <br />此页面只有诊所管理员可以访问<br /><img src='/images/help/gr5.png' width='100%'><br><br>点击【新增】创建新的诊所成员<br><span style='color:red'>手机号码为必填项，填写后系统如果检测到此号码没有关联账号，会默认以此手机号创建新的账号</span><br>机构角色可选“管理员”、“医生”、“护士”，管理员和护士可以给诊所所有医生下单，可以管理诊所全部的订单；医生只能以自己的名字下单，在订单管理内只会看到自己下的订单<br><img src='/images/help/gr6.png'  width='100%'><br /><span style='color: #000000;font-weight:bold;font-size: 22px;'>5.5 业务关系</span> <br />此页面只有诊所管理员可以访问<br /><img src='/images/help/gr7.png'  width='100%'><br />点击【绑定业务员】，输入业务员提供的邀请码后，点击【确定】创建新的业务关系<br><img src='/images/help/gr8.png'  width='100%'>"
  },
  {
    id: "6",
    title: "易齿盟AI",
    content: "<span style='color: red'>易齿盟AI助手下线运维中，将在后续版本回归，敬请期待!</span><br>易齿盟AI助手当前开放了#下订单功能，更多功能还在开发中，敬请期待<br />点击右下角+号，选择#下订单，对话框内会出现推荐的下订单信息模板，可选择一个点击复制后进行编辑，或者直接在下方消息框自行输入<br /><img src='/images/help/ai1.png' width='100%'><br>发送#下订单消息后，AI助手会提示需要补充的信息，点击【补充】键继续补充信息<br>如果信息完整，AI助手回复的信息里会有【提交】键，点此创建订单<img src='/images/help/ai2.png' width='100%'>"
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
const bindContentClick = (el) => {
  const anchors = el.querySelectorAll("#content-anchor");
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      scrollToSections();
    });
  });
};
function scrollToSections() {
  scrollToSection("6");
}
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
