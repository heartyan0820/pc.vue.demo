<template>
  <div class="ecmbody">
    <div class="ecmbody-nav"></div>
    <div class="ecmbody-softwarecenter-title">欢迎到来！</div>
    <div class="ecmbody-softwarecenter">
      <div class="ecmbody-softwarecenter-hr"></div>

      <div class="ecmbody-softwarecenter-wyb-2">
        <div class="ecmbody-softwarecenter-wyb1">操作手册</div>
        <div class="ecmbody-softwarecenter-wyb-2">
          <div class="ecmbody-softwarecenter-wyb2" @click="to('installmanual')">安装手册</div>
          <div class="ecmbody-softwarecenter-wyb2" @click="to('help')">网页门诊端</div>
          <div class="ecmbody-softwarecenter-wyb2" @click="to('operating')">运营公司端</div>
          <div class="ecmbody-softwarecenter-wyb2" @click="to('designend')">设计端</div>
          <div class="ecmbody-softwarecenter-wyb2" @click="to('factoryend')">工厂端</div>
        </div>
      </div>
      <div class="ecmbody-softwarecenter-wyb-3">
        <div class="ecmbody-softwarecenter-wyb1">平台版本下载</div>
        <div class="ecmbody-softwarecenter-wyb-2">
          <div class="ecmbody-softwarecenter-wyb2">
            <a href="https://eapi.epdent.cn/api/uploads/ecm.exe" title="口扫软件">Win直接安装版</a>
          </div>
          <div class="ecmbody-softwarecenter-wyb2">
            <a href="https://h5.epdent.cn/" title="口扫软件">H5网页</a>
          </div>
          <div class="ecmbody-softwarecenter-wyb2">
            <a href="https://h5.epdent.cn/ecm.apk" title="口扫软件">安卓</a>
          </div>
        </div>
      </div>
      <div class="ecmbody-softwarecenter-wyb-4">
        <div class="ecmbody-softwarecenter-wyb1">其他软件下载</div>
        <div class="ecmbody-softwarecenter-wyb-2">
          <div class="ecmbody-softwarecenter-wyb2">
            <a href="https://api.epdent.cn/webadv/config/win/WinRAR.exe" title="解压软件">
              解压软件
            </a>
          </div>
          <div class="ecmbody-softwarecenter-wyb2">
            <a href="https://api.epdent.cn/webadv/config/win/WV2.exe" title="网页控件">网控</a>
          </div>
          <div class="ecmbody-softwarecenter-wyb2">
            <a
              href="https://api.epdent.cn/webadv/config/win/QuickInstaller_IntraoralScan3.5.6_DL_L.exe"
              title="口扫软件"
            >
              口扫
            </a>
          </div>
        </div>
      </div>
      <div class="ecmbody-softwarecenter-wyb-5">
        <div class="ecmbody-softwarecenter-wyb1">
          <span style="border-bottom: 2px solid #e9f0f5; width: 260px; height: 20px"></span>
        </div>

        <div class="ecmbody-softwarecenter-wyb-2">
          <div class="ecmbody-softwarecenter-img">
            <div>扫码关注微信公众号</div>
            <div style="padding-top: 28px"><img src="/images/wechat1.png" height="110px" /></div>
          </div>
          <div class="ecmbody-softwarecenter-imgs">
            <div>扫码下载安卓APP</div>
            <div style="padding-top: 28px"><img src="/images/az.png" height="110px" /></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>
<script setup>import router from "@/router";
defineOptions({
  name: "softwarecenter",
  inheritAttrs: false
});
function to(url) {
  // 防止相对路径被 Vue Router 4 拼到当前路径后，统一归一化为绝对路径
  const path = url.startsWith("/") ? url : `/${url}`;
  router.push(path).then(() => {
    window.location.reload();
  }).catch(() => {
    window.location.reload();
  });
}
</script>
<style lang="scss" scoped>
.ecmbody {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  .ecmbody-nav {
    display: flex;
    width: 100%;
    font-weight: 500;
    font-size: 15px;
    height: 50px;
    line-height: 50px;
    color: #ffffff;

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

  .ecmbody-softwarecenter-title {
    display: flex;
    width: 95%;
    height: 60px;
    font-family: Noto Sans SC;
    font-weight: 500;
    font-size: 32px;
    color: #ffffff;
    justify-content: center;
    margin: 0 auto;
    letter-spacing: 10px;
  }

  .ecmbody-softwarecenter {
    display: flex;
    font-family: Noto Sans SC;
    width: 95%;
    font-weight: 400;
    font-size: 18px;
    text-align: justify;
    vertical-align: middle;
    margin: 0 auto;
    flex-flow: column;
    color: #e9f0f5;

    .ecmbody-softwarecenter-hr {
      display: flex;
      height: 10px;
      width: 260px;
      border-top: 2px solid #e9f0f5;
      margin: 0 auto;
    }

    .ecmbody-softwarecenter-wyb-1 {
      display: flex;
      width: 100%;
      margin: 0 auto;
      flex-flow: column;
      text-align: center;

      .ecmbody-softwarecenter-wyb1 {
        display: flex;
        width: 100%;
        margin: 0 auto;
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 28px;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-style: Medium;
      }

      .ecmbody-softwarecenter-wyb2 {
        display: flex;
        border-width: 1px;
        padding: 2px 16px;
        border-radius: 16px;
        margin: 0 auto;
        font-size: 19px;
        height: 39px;
        line-height: 30px;
        cursor: pointer;
        transition: all 0.5s;
      }

      .ecmbody-softwarecenter-wyb2:hover {
        background-color: #409eff;
        color: #ffffff;
        border: 1px solid #409eff;
      }
    }

    .ecmbody-softwarecenter-wyb-2 {
      display: flex;
      width: 100%;
      margin: 0 auto;
      flex-flow: column;
      text-align: center;

      .ecmbody-softwarecenter-wyb1 {
        display: flex;
        width: 100%;
        margin: 0 auto;
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 28px;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-style: Medium;
      }

      .ecmbody-softwarecenter-wyb-2 {
        display: flex;
        width: 70%;
        flex-flow: nowrap;

        .ecmbody-softwarecenter-wyb2 {
          display: flex;
          border-width: 1px;
          padding: 2px 16px;
          border-radius: 16px;
          margin: 0 auto;
          font-size: 19px;
          height: 39px;
          line-height: 30px;
          cursor: pointer;
          transition: all 0.5s;
        }

        .ecmbody-softwarecenter-wyb2:hover {
          background-color: #2a363b;
          color: #ffffff;
          border: 1px solid #2a363b;
        }
      }
    }

    .ecmbody-softwarecenter-wyb-3 {
      display: flex;
      width: 100%;
      margin: 0 auto;
      flex-flow: column;
      text-align: center;

      .ecmbody-softwarecenter-wyb1 {
        display: flex;
        width: 100%;
        margin: 0 auto;
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 28px;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-style: Medium;
      }

      .ecmbody-softwarecenter-wyb-2 {
        display: flex;
        width: 50%;
        flex-flow: nowrap;
        gap: 16px;

        .ecmbody-softwarecenter-wyb2 {
          display: flex;
          border-width: 1px;
          padding: 2px 16px;
          border-radius: 16px;
          //margin: 0 auto;
          font-size: 19px;
          height: 39px;
          line-height: 30px;
          cursor: pointer;
          transition: all 0.5s;
        }

        .ecmbody-softwarecenter-wyb2:hover {
          background-color: #2a363b;
          color: #ffffff;
          border: 1px solid #2a363b;
        }
      }
    }

    .ecmbody-softwarecenter-wyb-4 {
      display: flex;
      width: 100%;
      margin: 0 auto;
      flex-flow: column;
      text-align: center;

      .ecmbody-softwarecenter-wyb1 {
        display: flex;
        width: 100%;
        margin: 0 auto;
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 28px;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-style: Medium;
      }

      .ecmbody-softwarecenter-wyb-2 {
        display: flex;
        width: 50%;
        flex-flow: nowrap;
        gap: 16px;

        .ecmbody-softwarecenter-wyb2 {
          display: flex;
          border-width: 1px;
          padding: 2px 16px;
          border-radius: 16px;
          //margin: 0 auto;
          font-size: 19px;
          height: 39px;
          line-height: 30px;
          cursor: pointer;
          transition: all 0.5s;
        }

        .ecmbody-softwarecenter-wyb2:hover {
          background-color: #2a363b;
          color: #ffffff;
          border: 1px solid #2a363b;
        }
      }
    }

    .ecmbody-softwarecenter-wyb-5 {
      display: flex;
      width: 50%;
      margin: 0 auto;
      flex-flow: column;
      text-align: center;

      .ecmbody-softwarecenter-wyb1 {
        display: flex;
        width: 100%;
        margin: 0 auto;
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 28px;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-style: Medium;
      }

      .ecmbody-softwarecenter-wyb-2 {
        display: flex;
        width: 70%;
        flex-flow: nowrap;
        gap: 16px;
        font-size: 19px;
        justify-content: space-between;
        .ecmbody-softwarecenter-img {
          height: 130px;
        }
        .ecmbody-softwarecenter-img:hover img {
          width: 110px;
          height: 110px;
          content: url(/images/wechat1.png);
          //cursor: pointer;
        }
        .ecmbody-softwarecenter-imgs {
          height: 130px;
        }

        .ecmbody-softwarecenter-imgs:hover img {
          width: 110px;
          height: 110px;
          content: url(/images/az.png);
          // cursor: pointer;
        }
      }
    }
  }

  .ecmbody-softwarecenter-foot {
    height: 100px;
  }

  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 60px;
  }
}
</style>
