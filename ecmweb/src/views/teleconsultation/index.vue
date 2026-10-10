<template>
  <div class="ecmbody">
    <div class="ecmbody-nav">
      <a style="width: 40px">首页</a>
      /
      <span>远程会诊</span>
    </div>
    <div class="ecmbody-teleconsultation">远程会诊 · 智慧口腔新体验</div>
    <div class="ecmbody-teleconsultation-text">
      e齿盟远程会诊平台为牙科诊所搭建了一个高效、协作的数字化交流空间。医生、患者、设计师、工厂及平台审核员可同时在线参与会诊，实现多方实时沟通。设计师可现场运用专业软件进行个性化牙齿设计，医生与患者可同步看到设计过程及烤瓷牙装配的模拟效果，清晰直观。通过这一透明、互动的流程，患者更易理解诊疗方案，医生更高效决策，工厂与设计师更精准执行，让每一次修复设计更科学、更可靠。
    </div>
    <div class="ecmbody-teleconsultation-img">
      <img src="/images/1.png" width="558px" height="200px" />
      <img src="/images/1.png" width="558px" height="200px" />
    </div>
    <div class="ecmbody-zxhz-title">在线远程会诊</div>
    <div class="ecmbody-zxhz-nr">
      您有
      <span>1</span>
      个正在进行的远程会诊会议，请点击下方加入：
    </div>
    <div class="ecmbody-zxhz-img">
      <img src="/images/1.png" height="210px" width="558px" />
    </div>
  </div>
</template>
<script setup>defineOptions({
  name: "teleconsultation",
  inheritAttrs: false
});
</script>
<style lang="scss" scoped>
.ecmbody {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  line-height: 100%;
  letter-spacing: 0%;
  .ecmbody-nav {
    display: flex;
    width: 100%;
    font-weight: 500;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    span {
      font-weight: 700;
      font-style: Bold;
      font-size: 15px;
      padding-left: 10px;
    }
    a:hover {
      color: #3d7eff;
      cursor: pointer;
    }
  }
  .ecmbody-teleconsultation {
    display: flex;
    width: 95%;
    height: 60px;
    line-height: 60px;
    font-family: Noto Sans SC;
    font-weight: 500;
    font-size: 26px;
    color: #3d9fa6;
    justify-content: center;
    margin: 0 auto;
  }
  .ecmbody-teleconsultation-text {
    display: flex;
    font-family: Noto Sans SC;
    width: 95%;
    font-weight: 400;
    font-size: 18px;
    line-height: 30px;
    text-align: justify;
    vertical-align: middle;
    color: #757575;
    margin: 0 auto;
  }
  .ecmbody-teleconsultation-img {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .ecmbody-zxhz-title {
    display: flex;
    width: 100%;
    font-family: Noto Sans SC;
    font-weight: 500;
    font-size: 26px;
    line-height: 100%;
    vertical-align: middle;
    color: #3d9fa6;
    justify-content: center;
    margin: 0 auto;
    margin-top: 20px;
  }
  .ecmbody-zxhz-nr {
    display: flex;
    width: 100%;
    font-family: Noto Sans SC;
    font-weight: 400;
    font-size: 18px;
    justify-content: center;
    margin: 0 auto;
    margin-top: 20px;
    height: 30px;
    line-height: 30px;
    color: #757575;
    span {
      font-family: Noto Sans SC;
      font-weight: 700;
      font-size: 18px;
      line-height: 100%;
      color: #4e93f5;
      width: auto;
      height: 30px;
      line-height: 30px;
      padding: 0px 5px;
    }
  }
  .ecmbody-zxhz-img {
    width: 100%;
    display: flex;
    margin: 0 auto;
    margin-top: 20px;
    justify-content: center;
  }
}
</style>
