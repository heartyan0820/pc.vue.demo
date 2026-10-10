<template>
  <div class="ecmMess">
    <div class="ecmMess-mess-btn">
      <div v-if="messClass.length == 1" class="ecmMess-mess-btn-mess">消息列表</div>
      <div v-else class="ecmMess-mess-btns">
        <div
          v-for="(item, index) in messClass"
          :key="index"
          :class="oneClass == index ? 'ecmMess-mess-btn1' : 'ecmMess-mess-btn2'"
          @click="onClassChange(index, item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="ecmMess-mess-content">
      <div class="ecmMess-mess-content-information">
        <div
          v-if="oneClass == 0 || messClass.length == 1"
          class="ecmMess-mess-content-information0"
        >
          <div class="ecmMess-mess-content-information0-platform">
            <el-collapse v-model="activeNames" expand-icon-position="left" style="width: 100%">
              <el-collapse-item
                :title="title1"
                name="1"
                @click="title1 = title1 == '收起' ? '展开' : '收起'"
              >
                <div class="ecmMess-mess-content-information0-platform-content">
                  <div class="ecmMess-mess-content-information0-platform-content1">
                    <img src="@/assets/images/kefu.png" width="50px" height="50px" />
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-content2">
                    <div class="title">e齿盟客服</div>
                    <div class="content2">最新消息预览</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-content3">23:56</div>
                </div>
                <div class="ecmMess-mess-content-information0-platform-content">
                  <div class="ecmMess-mess-content-information0-platform-content1">
                    <img src="@/assets/images/kefu.png" width="50px" height="50px" />
                    <span v-if="aiMess.number > 0" class="circle">{{ aiMess.number }}</span>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-content2">
                    <div class="title">{{ aiMess.roomName }}</div>
                    <div class="content2">{{ aiMess.content }}</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-content3">
                    {{ formatDate(aiMess.contentTime) }}
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item
                :title="title2"
                name="2"
                @click="title2 = title2 == '收起' ? '展开' : '收起'"
              >
                <div
                  v-for="(item, index) in friendMess"
                  :key="index"
                  class="ecmMess-mess-content-information0-platform-contents"
                >
                  <div class="ecmMess-mess-content-information0-platform-contents1">
                    <img src="@/assets/images/mes.png" />
                    <span v-if="item.number > 0" class="circle">{{ item.number }}</span>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents2">
                    <div class="title">{{ item.roomName }}</div>
                    <div class="content2">{{ item.content }}</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents3">
                    {{ formatDate(aiMess.contentTime) }}
                  </div>
                </div>

                <div
                  v-for="(item, index) in friendMess"
                  :key="index"
                  class="ecmMess-mess-content-information0-platform-contents"
                >
                  <div class="ecmMess-mess-content-information0-platform-contents1">
                    <img src="@/assets/images/mes.png" />
                    <span v-if="item.number > 0" class="circle">{{ item.number }}</span>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents2">
                    <div class="title">{{ item.roomName }}</div>
                    <div class="content2">{{ item.content }}</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents3">
                    {{ formatDate(aiMess.contentTime) }}
                  </div>
                </div>

                <div
                  v-for="(item, index) in friendMess"
                  :key="index"
                  class="ecmMess-mess-content-information0-platform-contents"
                >
                  <div class="ecmMess-mess-content-information0-platform-contents1">
                    <img src="@/assets/images/mes.png" />
                    <span v-if="item.number > 0" class="circle">{{ item.number }}</span>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents2">
                    <div class="title">{{ item.roomName }}</div>
                    <div class="content2">{{ item.content }}</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents3">
                    {{ formatDate(aiMess.contentTime) }}
                  </div>
                </div>

                <div
                  v-for="(item, index) in friendMess"
                  :key="index"
                  class="ecmMess-mess-content-information0-platform-contents"
                >
                  <div class="ecmMess-mess-content-information0-platform-contents1">
                    <img src="@/assets/images/mes.png" />
                    <span v-if="item.number > 0" class="circle">{{ item.number }}</span>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents2">
                    <div class="title">{{ item.roomName }}</div>
                    <div class="content2">{{ item.content }}</div>
                  </div>
                  <div class="ecmMess-mess-content-information0-platform-contents3">
                    {{ formatDate(aiMess.contentTime) }}
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div v-if="oneClass == 1 && messClass.length > 1" class="ecmMess-mess-content-information2">
          <el-form
            size="small"
            style="width: 100%; flex: 1"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="CBCT：">
              <template #default>
                <ul style="display: flex; flex-wrap: wrap">
                  <li
                    v-for="(item, index) in cbctFileUrls"
                    :key="index"
                    style="display: flex; align-items: center; padding-right: 8px; min-width: 50px"
                  >
                    <el-icon>
                      <Link />
                    </el-icon>
                    &nbsp;
                    <a :href="settings.fileurl + item.url" target="_blank">{{ item.fileName }}</a>
                  </li>
                </ul>
              </template>
            </el-form-item>
            <el-form-item label="口扫数据：">
              <template #default>
                <ul style="display: flex; flex-wrap: wrap">
                  <li
                    v-for="(item, index) in kouSaoFileUrls"
                    :key="index"
                    style="display: flex; align-items: center; padding-right: 8px; min-width: 50px"
                  >
                    <el-icon>
                      <Link />
                    </el-icon>
                    &nbsp;
                    <a :href="settings.fileurl + item.url" target="_blank">{{ item.fileName }}</a>
                  </li>
                </ul>
              </template>
            </el-form-item>
            <el-form-item label="比色照片：">
              <template #default>
                <div
                  v-for="(item, index) in biSeimgUrls"
                  :key="index"
                  v-viewer.static="{ inline: false }"
                  class="upfiles"
                >
                  <div class="upfile-txts">
                    <img :src="settings.fileurl + item.url" width="30px" height="30px" />
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item label="制作照片：">
              <template #default>
                <div
                  v-for="(item, index) in zhiZhaoimgUrls"
                  :key="index"
                  v-viewer.static="{ inline: false }"
                  class="upfiles"
                >
                  <div class="upfile-txts">
                    <img :src="settings.fileurl + item.url" width="30px" height="30px" />
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="oneClass == 2 && messClass.length > 1" class="ecmMess-mess-content-information1">
          <el-steps direction="vertical" :active="2">
            <el-step title="订单创建" />
            <el-step title="制作中" />
            <el-step title="已制作完成" />
            <el-step title="已发货" />
          </el-steps>
        </div>

        <div v-if="oneClass == 3 && messClass.length > 1" class="ecmMess-mess-content-information3">
          设计资料
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import settings from "@/settings";
defineOptions({
  name: "Message",
  inheritAttrs: false
});
import ChatAPI from "@/api/mess";
import { getMessData } from "@/utils/auth";
const props = defineProps({
  // messClass: {
  //   type: Array,
  //   default: null,
  // },
});
const title1 = ref("收起");
const title2 = ref("收起");
const activeNames = ref(["1", "2"]);
const emit = defineEmits(["setIndex"]);
const messClass = ref();
const oneClass = ref();
const orderId = ref();
const makeId = ref();
const isMess = ref(false);
const cbctFileUrls = ref([]);
const kouSaoFileUrls = ref([]);
const biSeimgUrls = ref([]);
const zhiZhaoimgUrls = ref([]);
const messData = getMessData();
if (messData) {
  const data = JSON.parse(messData);
  oneClass.value = data.oneClass;
  orderId.value = data.orderId;
  makeId.value = data.makeId;
  messClass.value = data.messClass;
}
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 50
});
const queryFileParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  orderId: orderId.value == 0 ? 0 : orderId.value
});
const queryMakeParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  makeId: makeId.value == 0 ? 0 : makeId.value
});
const friendMess = ref([
  {
    content: "",
    contentTime: "",
    roomName: "",
    number: 0
  }
]);
const aiMess = ref({
  content: "",
  contentTime: "",
  roomName: "",
  number: 0
});
function onClassChange(v, item) {
  oneClass.value = v;
  emit("setIndex", item.value);
  getDate();
}
function getDate() {
  switch (oneClass.value) {
    case 0:
      isMess.value = true;
      getMess();
      break;
    case 1:
      if (messClass.value.length > 1) {
        ChatAPI.getOrderFilePage(queryFileParams).then((data) => {
          if (data.list.length > 0) {
            let filedata = data.list;
            let cbct = filedata.filter((a) => {
              return a.type == 0;
            });
            cbctFileUrls.value = cbct;
            let kousao = filedata.filter((a) => {
              return a.type == 1;
            });
            kouSaoFileUrls.value = kousao;
            let bise = filedata.filter((a) => {
              return a.type == 2;
            });
            biSeimgUrls.value = bise;
            let zhizuo = filedata.filter((a) => {
              return a.type == 3;
            });
            zhiZhaoimgUrls.value = zhizuo;
          }
        });
      }
      break;
    case 2:
      ChatAPI.getOrderStatePage(queryMakeParams).then((data) => {
        if (data.list.length > 0) {
          let messdata = data.list;
        }
      });
      break;
    case 3:
      break;
  }
  if (messClass.value.length == 1 && isMess.value == false) {
    getMess();
  }
}
function formatDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (diffDays === 0) {
      return `${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return "昨天";
    } else if (diffDays === 2) {
      return "前天";
    } else if (diffDays < 7) {
      return "一周内";
    } else {
      return `${diffDays}天前`;
    }
  } else {
    return "";
  }
}
function getMess() {
  ChatAPI.getList(queryParams).then((data) => {
    if (data.data.list.length > 0) {
      let messdata = data.data.list;
      let ai = messdata.filter((a) => {
        return a.roomType == 3;
      });
      let friend = messdata.filter((a) => {
        return a.roomType == 1;
      });
      friendMess.value = friend;
      aiMess.value = ai[0];
    }
  });
}
onMounted(() => {
  getDate();
});
</script>
<style lang="scss" scoped>
.ecmMess {
  display: flex;
  width: 100%;
  flex-flow: column;

  .ecmMess-mess-btn {
    width: 100%;
    display: flex;
    background-color: #333f48;
    height: 41px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-width: 0.5px;
    justify-content: space-around;

    .ecmMess-mess-btns {
      width: 100%;
      display: flex;
      background-color: #333f48;
      height: 40px;
      justify-content: space-around;
      align-items: center;

      .ecmMess-mess-btn1 {
        display: flex;
        width: auto;
        height: 32px;
        justify-content: center;
        color: #100f0f;
        background-color: #ffffff;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        padding: 0px 8px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        margin-top: 8px;
        cursor: pointer;
      }

      .ecmMess-mess-btn2 {
        cursor: pointer;
        display: flex;
        width: auto;
        height: 32px;
        justify-content: center;
        color: #ffffff;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        margin-top: 7px;
        padding: 0px 8px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }

      .ecmMess-mess-btn2:hover {
        display: flex;
        background-color: #ffffff;
        justify-content: center;
        color: #100f0f;
        cursor: pointer;
      }
    }

    .ecmMess-mess-btn-mess {
      width: 100%;
      display: flex;
      background-color: #333f48;
      height: 40px;
      justify-content: space-around;
      align-items: center;
      color: #ffffff;
    }
  }

  .ecmMess-mess-content {
    display: flex;
    border: 0.5px solid #c5d1dc;
    width: 100%;
    height: 720px;
    background-color: #ffffff;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;

    .ecmMess-mess-content-information {
      display: flex;
      height: auto;
      width: 100%;

      .ecmMess-mess-content-information0 {
        display: flex;
        height: auto;
        width: 100%;
        flex-flow: column;

        .ecmMess-mess-content-information0-platform {
          display: flex;
          height: auto;
          width: 100%;
          padding: 30rpx;
          justify-content: flex-start;
          border-bottom: 2rpx solid #f5f5f5;
          position: relative;

          .ecmMess-mess-content-information0-platform-content {
            display: flex;
            height: 80px;
            width: 100%;
            background-color: #e6eef5;
            margin-top: 10px;
            padding: 10px 20px 10px 20px;
            cursor: pointer;

            .ecmMess-mess-content-information0-platform-content1 {
              display: flex;
              height: auto;
              width: 20%;
              align-items: center;

              .circle {
                width: 23px;
                height: 23px;
                border-radius: 50%;
                background-color: #eb5757;
                text-align: center;
                line-height: 23px;
                position: absolute;
                color: #fff;
                font-size: 12px;
                left: 59px;
                margin-top: -48px;
              }
            }

            .ecmMess-mess-content-information0-platform-content2 {
              display: flex;
              height: auto;
              width: 70%;
              flex-flow: column;
              line-height: 100%;
              padding-left: 10px;

              .title {
                font-family: Noto Sans SC;
                font-weight: 700;
                font-size: 16px;
                height: 33px;
                line-height: 33px;
              }

              .content2 {
                font-family: Noto Sans SC;
                font-weight: 400;
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                width: 86%;
                overflow: hidden;
              }
            }

            .ecmMess-mess-content-information0-platform-content3 {
              display: flex;
              height: 58px;
              width: 12%;
              justify-content: center;
              align-items: end;
              color: #757575;
              font-family: Noto Sans SC;
              font-weight: 400;
              font-size: 12px;
            }
          }

          .ecmMess-mess-content-information0-platform-contents {
            display: flex;
            height: 70px;
            width: 100%;
            background-color: #ffffff;
            margin-top: 10px;
            padding: 10px 20px 10px 20px;
            cursor: pointer;

            .ecmMess-mess-content-information0-platform-contents1 {
              height: auto;
              width: 20%;

              .circle {
                width: 23px;
                height: 23px;
                border-radius: 50%;
                background-color: #eb5757;
                text-align: center;
                line-height: 23px;
                position: absolute;
                color: #fff;
                font-size: 12px;
                left: 58px;
                margin-top: -11px;
              }
            }

            .ecmMess-mess-content-information0-platform-contents2 {
              display: flex;
              height: auto;
              width: 70%;
              flex-flow: column;
              line-height: 100%;
              padding-left: 10px;

              .title {
                font-family: Noto Sans SC;
                font-weight: 700;
                font-size: 16px;
                height: 25px;
                line-height: 25px;
              }

              .content2 {
                font-family: Noto Sans SC;
                font-weight: 400;
                font-size: 14px;
                height: 30px;
                line-height: 30px;
                width: 86%;
                overflow: hidden;
              }
            }

            .ecmMess-mess-content-information0-platform-contents3 {
              display: flex;
              height: auto;
              width: 12%;
              justify-content: center;
              align-items: end;
              color: #757575;
              font-family: Noto Sans SC;
              font-weight: 400;
              font-size: 12px;
            }
          }

          :deep(.el-collapse-icon-position-left .el-collapse-item__header) {
            gap: 8px;
            padding: 20px 10px 10px 7px;
          }

          :deep(.el-collapse-item__title) {
            flex: auto;
            text-align: left;
            font-weight: 350;
            font-size: 15px;
            color: #000000;
          }

          :deep(.el-collapse) {
            --el-collapse-border-color: #ffffff;
            --el-collapse-header-height: 18px;
            --el-collapse-header-bg-color: var(--el-fill-color-blank);
            --el-collapse-header-text-color: var(--el-text-color-primary);
            --el-collapse-header-font-size: 13px;
            --el-collapse-content-bg-color: var(--el-fill-color-blank);
            --el-collapse-content-font-size: 13px;
            --el-collapse-content-text-color: var(--el-text-color-primary);
            border-bottom: none;
            border-top: none;
          }

          :deep(.el-collapse-item__content) {
            color: var(--el-collapse-content-text-color);
            font-size: var(--el-collapse-content-font-size);
            padding-bottom: 5px;
          }
        }

        .ecmMess-mess-content-information0-order {
          display: flex;
          height: auto;
          width: 100%;
        }
      }

      .ecmMess-mess-content-information1 {
        display: flex;
        height: auto;
        width: 100%;
        padding: 10px;
        align-items: center;
        justify-content: center;
      }

      .ecmMess-mess-content-information2 {
        display: flex;
        height: auto;
        width: 100%;
        padding: 10px;

        .ul,
        li {
          padding: 0;
          margin: 0;
          list-style: none;
          display: flex;
          cursor: pointer;
          color: #4a5a6a;
          // margin: 10px 10px 0px 0px;
        }

        .upfiles {
          width: auto;
          margin: 0px 10px 10px 0px;
          display: flex;

          .upfile-txts {
            display: flex;
            max-width: 30px;
            overflow: hidden;
            height: 30px;
            cursor: pointer;
          }
        }
      }

      .ecmMess-mess-content-information3 {
        display: flex;
        height: auto;
        width: 100%;
        padding: 10px;
      }
    }
  }
}
</style>
