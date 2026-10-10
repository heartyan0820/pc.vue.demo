<template>
  <div class="ecmbody">
    <div class="ecmbody-nav">
      <a style="width: 40px">首页</a>
      /
      <span>e齿盟商城</span>
    </div>
    <div class="ecmbody-ecmshop-title">e齿盟 · 商城</div>
    <div class="ecmbody-ecmshop">
      成都众硕慧通科技有限公司，成立于2023年，是一家专业从事齿科控制系统设计、数字化管理、服务、开发、销售的高科技公司。
      公司继承了齿科临床服务、义齿工艺制作、义齿工厂管理领域的经验，融入先进的工业计算机技术，在定制定单及排产，智能型生产管理及AI生成CAM文件等领域取得了骄人的业绩，成为在该领域具有较强影响力的公司。
      公司设有软件开发部、快速服务反应中心、业务部、数据处理中心，有较强的设计、研发和生产管理能力，目前拥有在线技师人员100人及以上。
      服务对象：口腔门诊、义齿工厂、义齿技师、医疗器械供应商、数控厂商、科研单位
      覆盖范围：已覆盖全国，成为多家医院，口腔门诊，医疗器械设备商，齿加工厂的指定服务商及供应商。
    </div>
    <div class="ecmbody-ecmshop-img">
      <img src="/images/ecmshop.png" width="558px" />
      <img src="/images/ecmshop.png" width="558px" />
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>
<script setup>defineOptions({
  name: "ecmshop",
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
  .ecmbody-ecmshop-title {
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
  .ecmbody-ecmshop {
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
  .ecmbody-ecmshop-img {
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 60px;
  }
}
</style>
