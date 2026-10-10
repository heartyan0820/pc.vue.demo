<template>
  <div class="ecmbody">
    <div class="ecmbody-nav">
      <a style="width: 40px; cursor: pointer">首页</a>
      /
      <span>关于我们</span>
    </div>
    <div class="ecmbody-about-title">e齿盟 · 关于我们</div>

    <div class="ecmbody-about">
      成都众硕慧通科技有限公司是一家为口腔门诊提供整体数字化解决方案的公司。我们提供简便快捷的电子订单系统，慧通易齿盟平台接收到电子订单后将在：
      <br />
      <br />
      <div class="ecmbody-about-txt">
        <span>5</span>
        &nbsp;分钟内对该订单进行数据审核
      </div>
      <div class="ecmbody-about-txt">
        <span>2</span>
        &nbsp;小时内完成义齿设计
      </div>
      <div class="ecmbody-about-txt">
        <span>标准</span>
        &nbsp;的数字化生产时间及流程为指导， 监督义齿生产企业完成生产
      </div>
    </div>
    <div class="ecmbody-about-img">
      <img src="/images/ab1.png" height="250px" />
      <div class="ecmbody-about-img1">
        我们提供先进的即时3D数字云会诊平台，临床医师、患者、专家后端技师无时延的联通、协作。超时空限制的对病例进行分享、沟通及治疗方案确定。
        <br />
        <br />
        作为一站式服务平台，我们提供口腔义齿整体解决方案，用最先进的技术和最优质的服务，全流程赋能口腔门诊。
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>
<script setup>defineOptions({
  name: "about",
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
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    font-family: Noto Sans SC;
    color: #333f48;
    span {
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
    }
    a:hover {
      color: #3d7eff;
      cursor: pointer;
    }
  }
  .ecmbody-about-title {
    display: flex;
    width: 95%;
    height: 60px;
    line-height: 60px;
    font-family: Noto Sans SC;
    font-weight: 500;
    font-size: 26px;
    color: #333f48;
    justify-content: center;
    margin: 0 auto;
  }
  .ecmbody-about {
    font-family: Noto Sans SC;
    width: 98%;
    font-weight: 400;
    font-size: 19px;
    line-height: 30px;
    height: 380px;
    text-align: justify;
    vertical-align: middle;
    color: #000;
    margin: 0 auto;
    background-image: url(/images/ab.png);
    background-repeat: no-repeat;
    background-position: right bottom;
    padding-top: 2%;
    .ecmbody-about-txt {
      width: 100%;
      display: flex;
      align-items: end;
      margin-bottom: 5px;
    }
    span {
      display: flex;
      font-family: Noto Sans SC;
      font-weight: 700;
      font-size: 32px;
      line-height: 40px;
      text-align: justify;
      vertical-align: middle;
      color: #4e93f5;
      align-items: end;
    }
  }
  .ecmbody-about-img {
    display: flex;
    width: 98%;
    justify-content: space-between;
    background: linear-gradient(90deg, #e8f1fe 0%, #feffff 100%);
    margin: 0 auto;
    margin-top: 25px;
    .ecmbody-about-img1 {
      width: 626px;
      font-family: Noto Sans SC;
      font-weight: 400;
      font-size: 19px;
      line-height: 30px;
      text-align: justify;
      vertical-align: middle;
      color: #000;
      margin-top: 2%;
    }
  }
  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 60px;
  }
}
</style>
