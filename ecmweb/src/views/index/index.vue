<template>
  <div class="ecmbody">
    <div class="ecmbody-order">在线下单</div>
    <div class="ecmbody-orders">
      <div
        v-for="(item, index) in classList"
        :key="index"
        class="ecmbody-orders1"
        :style="{ backgroundColor: item.color }"
        @click="openOrder('/order', item.label, item.value)"
      >
        <div v-if="item.label == '泰利斯液态打印氧化锆'" class="orders1-hot">
          <img src="/images/hot.gif" height="70px" />
        </div>
        <div :class="item.label == '泰利斯液态打印氧化锆' ? 'orders1-hot-txt' : 'orders1-txt'">
          <div v-if="item.label == '泰利斯液态打印氧化锆'">
            泰利斯
            <br />
            液态打印氧化锆
          </div>
          <div v-else>{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div class="ecmbody-banner">
      <swiper
        :modules="modules"
        :autoplay="{
          delay: 3000, //鼠标置于swiper时，停止自动播放，鼠标离开时恢复自动切换
          pauseOnMouseEnter: true, //用户操作swiper之后，是否禁止autoplay
          disableOnInteraction: false,
        }"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <swiper-slide v-for="(item, index) in bannerPic" :key="index">
          <img :style="{ display: 'block', height: '260px' }" :src="item.imgUrl" alt="advert" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="ecmbody-kjnav" @click="openkjnav">快捷导航</div>
    <div class="ecmbody-kjnav-content">
      <div class="ecmbody-kjnav-contents11">
        <div class="ecmbody-kjnav-contents1" @click="to('teleconsultation')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k1.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">远程会诊</div>
            <div class="ecmbody-kjnav-contents1-txt2">Teleconsultation</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents2" @click="to('online')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k2.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">在线沟通</div>
            <div class="ecmbody-kjnav-contents1-txt2">Online communication</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents3" @click="to('aidrawer')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k3.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">AI下单</div>
            <div class="ecmbody-kjnav-contents1-txt2">AI order placement</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents4" @click="to('orders')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k4.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">订单管理</div>
            <div class="ecmbody-kjnav-contents1-txt2">Order Management</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents5" @click="to('ecmshop')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k5.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">e齿盟商城</div>
            <div class="ecmbody-kjnav-contents1-txt2">E-tooth Alliance Mall</div>
          </div>
        </div>
      </div>
      <div class="ecmbody-kjnav-contents22">
        <div class="ecmbody-kjnav-contents6">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k6.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">案例展示</div>
            <div class="ecmbody-kjnav-contents1-txt2">Case Showcase</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents1" @click="to('softwarecenter')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k7.png" height="40px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">软件中心</div>
            <div class="ecmbody-kjnav-contents1-txt2">Software Center</div>
          </div>
        </div>
        <div class="ecmbody-kjnav-contents2" @click="to('contact')">
          <div class="ecmbody-kjnav-contents1-img">
            <img src="/images/k8.png" height="34px" />
          </div>
          <div class="ecmbody-kjnav-contents1-txt">
            <div class="ecmbody-kjnav-contents1-txt1">联系我们</div>
            <div class="ecmbody-kjnav-contents1-txt2">Contact Us</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ecmbody-introduce">
      <div class="ecmbody-introduce-left">
        <div class="ecmbody-introduce-left-title">平台介绍</div>
        <div class="ecmbody-introduce-left-txt">
          成都众硕慧通科技有限公司，成立于2023年，是一家专业从事齿科控制系统设计、数字化管理、服务、开发、销售的高科技公司。
          <br />
          公司继承了齿科临床服务、义齿工艺制作、义齿工厂管理领域的经验，融入先进的工业计算机技术，在定制定单及排产，智能型生产管理及AI生成CAM文件等领域取得了骄人的业绩，成为在该领域具有较强影响力的公司。
          <br />
          公司设有软件开发部、快速服务反应中心、业务部、数据处理中心，有较强的设计、研发和生产管理能力，目前拥有在线技师人员100人及以上。
          <br />
          服务对象：口腔门诊、义齿工厂、义齿技师、医疗器械供应商、数控厂商、科研单位
          <br />
          覆盖范围：已覆盖全国，成为多家医院，口腔门诊，医疗器械设备商，齿加工厂的指定服务商及供应商。
        </div>
      </div>
      <div class="ecmbody-introduce-right">
        <div class="ecmbody-introduce-right1">
          <div class="ecmbody-introduce-right1-title">医生/诊所</div>
          <div class="ecmbody-introduce-right1-content">
            <ul>
              <li @click="to('/about')">e齿盟服务</li>
              <li @click="to('/help')">下单操作流程</li>
              <li @click="to('/softwarecenter')">软件下载</li>
              <li @click="opendialog('远程会诊说明')">远程会诊说明</li>
              <li @click="to('/help')">AI下单说明</li>
              <li @click="to('/contact')">投诉与反馈</li>
            </ul>
          </div>
        </div>
        <div class="ecmbody-introduce-right2">
          <div class="ecmbody-introduce-right2-title">设计师</div>
          <div class="ecmbody-introduce-right2-content">
            <ul>
              <li @click="to('/contact')">加入平台</li>
              <li @click="opendialog('设计规范')">设计规范</li>
              <li @click="opendialog('接单规则')">如何接单</li>
              <li @click="opendialog('抢单规则')">抢单规则</li>
              <li @click="opendialog('罚单规则')">罚单规则</li>
            </ul>
          </div>
        </div>
        <div class="ecmbody-introduce-right3">
          <div class="ecmbody-introduce-right3-title">工厂</div>
          <div class="ecmbody-introduce-right3-content">
            <ul>
              <li @click="to('/contact')">加入平台</li>
              <li @click="opendialog('生产规范')">生产规范</li>
              <li @click="opendialog('分单规则')">分单规则</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="ecmbody-hr"></div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="39%" draggable>
      <div
        style="
          min-height: 200px;
          max-height: 500px;
          overflow-y: auto;
          scrollbar-width: thin;
          padding: 0px 10px;
          font-size: 15px;
        "
        v-html="vhtml"
      ></div>
    </el-dialog>
  </div>
</template>

<script setup>defineOptions({
  name: "index",
  inheritAttrs: false
});
import PcAPI from "@/api/nav";
import router from "@/router";
import DocAPI from "@/api/doc";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import img1 from "../../assets/images/banner.png";
const modules = [Autoplay, Pagination];
const imgUrl = "/images/";
const classList = ref([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const vhtml = ref("文档更新中...");
const bannerPic = ref([
  {
    name: "易齿盟",
    imgUrl: img1
  }
  // {
  //   name: "易齿盟2",
  //   imgUrl: img2,
  // },
]);
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  visible: true,
  isRelation: true
});
const queryDocParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  state: 1,
  type: 2,
  keywords: ""
});
function onSwiper() {
}
function onSlideChange() {
}
function openOrder(_url, name, _id) {
  const url = {
    path: _url,
    query: {
      name,
      id: _id
    }
  };
  router.push(url).then(() => {
    window.location.reload();
  }).catch(() => {
    router.go(0);
  });
}
function openkjnav() {
}
function getClass() {
  PcAPI.getClass(queryParams).then((data) => {
    classList.value = data;
  });
}
function to(_url) {
  if (_url == "aidrawer") {
    const charAiElement = document.getElementById("charOnAi");
    if (charAiElement) {
      charAiElement.click();
    }
  } else if (_url == "online") {
    const charOnlineElement = document.getElementById("charOnline");
    if (charOnlineElement) {
      charOnlineElement.click();
    }
  } else if (_url == "teleconsultation") {
    window.open("https://cloud.epdent.cn/portal/webclient/index.html#/", "_blank");
  } else {
    // 防止相对路径被 Vue Router 4 拼到当前路径后（比如 /index + contact = /index/contact，
    // 该路由不存在，push 失败会被 catch reload，导致页面看起来"空白"）。
    // 这里统一归一化为绝对路径。
    const path = _url.startsWith("/") ? _url : `/${_url}`;
    router.push({ path }).catch(() => {
      window.location.reload();
    });
  }
}
function opendialog(v) {
  dialogTitle.value = v;
  queryDocParams.keywords = v;
  DocAPI.getNoticeData(queryDocParams).then((data) => {
    vhtml.value = "文档更新中...";
    if (data.list.length > 0) {
      vhtml.value = data.list[0].content;
    }
    dialogVisible.value = true;
  });
}
onMounted(() => {
  getClass();
});
</script>

<style lang="scss" scoped>
.ecmbody {
  position: relative;
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  line-height: 100%;
  letter-spacing: 0%;
  .login__particles {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.9;
    position: fixed;
    pointer-events: none;
  }
  .ecmbody-notification {
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    color: #ff8d28;
    height: 40px;
    line-height: 40px;
    span {
      display: flex;
      height: 27px;
      width: 28px;
      align-items: end;
    }
  }
  .ecmbody-order {
    width: 100%;
    display: flex;
    height: 30px;
    color: #333333;
    font-family: MicrosoftYaHei-Bold;
    font-weight: 500;
    font-size: 28px;
    text-align: center;
    line-height: 100%;
    justify-content: center;
    vertical-align: middle;
    margin-top: 25px;
  }
  .ecmbody-orders {
    width: 1220px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    row-gap: 15px;
    flex-wrap: wrap;
    cursor: pointer;
    margin-top: 45px;
    .ecmbody-orders1 {
      display: flex;
      width: 32.5%;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      height: 138px;
      opacity: 1;
      gap: 10px;
      padding-top: 18px;
      padding-bottom: 18px;
      border-radius: 10px;
      .orders1-img {
        display: flex;
        height: 120px;
        align-items: center;
      }
      .orders1-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 32px;
        text-align: center;
        color: #ffffff;
        height: 55px;
        font-family: Noto Sans SC;
      }
      .orders1-hot-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 32px;
        line-height: 35px;
        text-align: center;
        color: #ffffff;
        height: 55px;
        font-family: Noto Sans SC;
        margin-top: -10px;
      }
      .orders1-hot {
        display: flex;
        position: relative;
        top: -45px;
        left: -150px;
        width: 68px;
        height: 0px;
        img {
          display: flex;
          position: relative;
          top: -8px;
          left: -8px;
        }
      }
    }
    .ecmbody-orders1:hover {
      background: radial-gradient(50% 50% at 50% 50%, #22c8b4 0%, #438ef7 100%) !important;
      position: relative;
      top: -10px;
      .orders1-img {
        display: flex;
        height: 120px;
        align-items: center;
        img {
          filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.9));
        }
      }
    }
    .ecmbody-orders1-1 {
      display: flex;
      width: 19.4%;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      height: 155px;
      opacity: 1;
      gap: 10px;
      padding-top: 18px;
      padding-bottom: 18px;
      border-radius: 10px;
      .orders1-img {
        display: flex;
        height: 120px;
        align-items: center;
      }
      .orders1-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 30px;
        text-align: center;
        color: #ffffff;
        height: 55px;
        font-family: Noto Sans SC;
      }
      .orders1-hot-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 30px;
        line-height: 35px;
        text-align: center;
        color: #ffffff;
        height: 55px;
        font-family: Noto Sans SC;
        margin-top: -10px;
      }
      .orders1-hot {
        display: flex;
        position: relative;
        top: -52px;
        left: -97px;
        width: 68px;
        height: 0px;
        img {
          display: flex;
          position: relative;
          top: -8px;
          left: -8px;
        }
      }
    }
    .ecmbody-orders1-1:hover {
      background: radial-gradient(50% 50% at 50% 50%, #22c8b4 0%, #438ef7 100%) !important;
      position: relative;
      top: -10px;
      .orders1-img {
        display: flex;
        height: 120px;
        align-items: center;
        img {
          filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.9));
        }
      }
    }
  }
  .ecmbody-kjnav {
    align-items: center;
    width: 100%;
    display: flex;
    height: 50px;
    color: #333333;
    font-family: MicrosoftYaHei-Bold;
    font-weight: 500;
    font-size: 28px;
    text-align: center;
    justify-content: center;
    vertical-align: middle;
    margin-top: 65px;
  }
  .ecmbody-kjnav-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    flex-wrap: wrap;
    margin-top: 47px;
    .ecmbody-kjnav-contents {
      display: flex;
      width: 12%;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      height: 105px;
      opacity: 1;
      gap: 10px;
      padding-top: 18px;
      padding-bottom: 18px;
      border-radius: 10px;
      cursor: pointer;
      .ecmbody-kjnav-contents-img {
        display: flex;
        height: 70px;
        align-items: center;
      }
      .ecmbody-kjnav-contents-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        color: #3d9fa6;
        height: 65px;
        font-family: MicrosoftYaHei-Bold;
      }
    }
    .ecmbody-kjnav-contents:hover {
      display: flex;
      width: 12%;
      flex-flow: column;
      align-items: center;
      justify-content: center;
      height: 105px;
      opacity: 1;
      gap: 10px;
      padding-top: 18px;
      padding-bottom: 18px;
      border-radius: 10px;
      .ecmbody-kjnav-contents-img {
        display: flex;
        height: 70px;
        align-items: center;
        img {
          height: 60px;
        }
      }
      .ecmbody-kjnav-contents-txt {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 18px;
        text-align: center;
        color: #3d9fa6;
        height: 65px;
        font-family: MicrosoftYaHei-Bold;
      }
    }
    .ecmbody-kjnav-contents11 {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .ecmbody-kjnav-contents1 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents1:hover img {
        display: flex;
        cursor: pointer;
        content: url(/images/k1hove.png);
      }
      .ecmbody-kjnav-contents1:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents2 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents2:hover img {
        content: url(/images/k2hove.png);
      }
      .ecmbody-kjnav-contents2:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents3 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents3:hover img {
        content: url(/images/k3hove.png);
      }
      .ecmbody-kjnav-contents3:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents4 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents4:hover img {
        content: url(/images/k4hove.png);
      }
      .ecmbody-kjnav-contents4:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents5 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents5:hover img {
        content: url(/images/k5hove.png);
      }
      .ecmbody-kjnav-contents5:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
    }
    .ecmbody-kjnav-contents22 {
      display: flex;
      width: 100%;
      margin-top: 39px;
      .ecmbody-kjnav-contents6 {
        display: flex;
        cursor: pointer;
        margin-left: 3px;
        width: 235px;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents6:hover img {
        content: url(/images/k6hove.png);
      }
      .ecmbody-kjnav-contents6:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents1 {
        display: flex;
        cursor: pointer;
        width: 280px;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
      }
      .ecmbody-kjnav-contents1-txt:hover {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents1:hover img {
        content: url(/images/k7hove.png);
      }
      .ecmbody-kjnav-contents1:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
      .ecmbody-kjnav-contents2 {
        display: flex;
        cursor: pointer;
        .ecmbody-kjnav-contents1-img {
          display: flex;
          width: 43px;
        }
        .ecmbody-kjnav-contents1-txt {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          margin-top: 2px;
          height: 38px;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #000000;
            font-size: 19px;
            font-family: Noto Sans SC;
            font-weight: 400;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #757575;
            font-size: 16px;
          }
        }
        .ecmbody-kjnav-contents1-txt:hover {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          .ecmbody-kjnav-contents1-txt1 {
            display: flex;
            color: #3d7eff;
          }
          .ecmbody-kjnav-contents1-txt2 {
            display: flex;
            color: #3d7eff;
          }
        }
      }
      .ecmbody-kjnav-contents2:hover img {
        content: url(/images/k8hove.png);
      }
      .ecmbody-kjnav-contents2:hover .ecmbody-kjnav-contents1-txt {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .ecmbody-kjnav-contents1-txt1 {
          display: flex;
          color: #3d7eff;
        }
        .ecmbody-kjnav-contents1-txt2 {
          display: flex;
          color: #3d7eff;
        }
      }
    }
  }
  .ecmbody-banner {
    width: 100%;
    display: flex;
    height: 260px;
    justify-content: center;
    margin-top: 60px;
  }
  .ecmbody-introduce {
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: center;
    margin-top: 40px;
    .ecmbody-introduce-left {
      width: 55%;
      display: flex;
      flex-flow: column;
      .ecmbody-introduce-left-title {
        width: 100%;
        display: flex;
        font-weight: 500;
        font-size: 28px;
        line-height: 60px;
        height: 60px;
        color: #333333;
        font-family: MicrosoftYaHei-Bold;
      }
      .ecmbody-introduce-left-txt {
        font-weight: 400;
        font-size: 18px;
        line-height: 26px;
        letter-spacing: 1px;
        color: #000000;
        padding-top: 24px;
        font-family: Noto Sans SC;
      }
    }
    .ecmbody-introduce-right {
      width: 45%;
      display: flex;
      justify-content: end;
      .ecmbody-introduce-right1 {
        display: flex;
        width: 26%;
        flex-flow: column;
        .ecmbody-introduce-right1-title {
          font-weight: 500;
          font-size: 24px;
          line-height: 100%;
          color: #333333;
          line-height: 60px;
          height: 60px;
          font-family: MicrosoftYaHei-Bold;
        }
        .ecmbody-introduce-right1-content {
          display: flex;
          margin-top: 16px;
          ul li {
            font-size: 18px;
            line-height: 30px;
            color: #4e93f5;
            font-family: MicrosoftYaHei-Bold;
            cursor: pointer;
          }
          ul li:hover {
            text-decoration: underline;
          }
        }
      }
      .ecmbody-introduce-right2 {
        display: flex;
        width: 23%;
        flex-flow: column;
        .ecmbody-introduce-right2-title {
          font-weight: 500;
          font-size: 24px;
          line-height: 100%;
          color: #333333;
          line-height: 60px;
          height: 60px;
          font-family: MicrosoftYaHei-Bold;
        }
        .ecmbody-introduce-right2-content {
          display: flex;
          margin-top: 16px;
          ul li {
            font-size: 18px;
            font-family: MicrosoftYaHei-Bold;
            line-height: 30px;
            color: #4e93f5;
            cursor: pointer;
          }
          ul li:hover {
            text-decoration: underline;
          }
        }
      }
      .ecmbody-introduce-right3 {
        display: flex;
        width: 16%;
        flex-flow: column;
        .ecmbody-introduce-right3-title {
          font-weight: 500;
          font-size: 24px;
          font-family: MicrosoftYaHei-Bold;
          line-height: 100%;
          color: #333333;
          line-height: 60px;
          height: 60px;
          font-family: MicrosoftYaHei-Bold;
        }
        .ecmbody-introduce-right3-content {
          display: flex;
          margin-top: 16px;
          ul li {
            font-size: 18px;
            line-height: 30px;
            color: #4e93f5;
            cursor: pointer;
            font-family: MicrosoftYaHei-Bold;
          }
          ul li:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .ecmbody-hr {
    display: flex;
    width: 100%;
    margin-top: 20px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
