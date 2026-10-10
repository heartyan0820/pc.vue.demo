<template>
  <div class="ecmbody">
    <div class="ecmbody-top">个人中心</div>
    <div class="ecmbody-content">
      <div class="ecmbody-content-left">
        <div class="ecmbody-content-left-avatar">
          <div class="ecmbody-content-left-avatar1">
            <el-avatar :size="60" :src="userStore.userInfo.avatar" />
          </div>
          <div
            class="ecmbody-content-left-avatar2"
            :title="userData.name + '：' + userData.orgName"
          >
            {{ userData.name }}
            <span>{{ userData.orgName }}</span>
          </div>
        </div>
        <div class="ecmbody-content-left-menu">
          <!-- <div
            v-for="(it, index) in menuList"
            :key="index"
            :class="it.isSelected ? 'ecmbody-content-left-menu1' : 'ecmbody-content-left-menu2'"
            @click="onClickMenu(it)"
          >
            {{ it.name }}
          </div> -->
          <div
            v-for="(it, index) in menuLists"
            :key="index"
            :class="it.isSelected ? 'ecmbody-content-left-menu1' : 'ecmbody-content-left-menu2'"
            @click="onClickMenus(it)"
          >
            {{ it.meta.title }}
          </div>
        </div>
      </div>
      <div class="ecmbody-content-right">
        <AccountVerify v-if="index == 0" :key="i" :userData="userData" @setUser="Query" />
        <SecuritySettings v-if="index == 1" :userData="userData" />
        <QualificationVerify v-if="index == 2" :userData="userData" />
        <DoctorVerify v-if="index == 3" :userData="userData" />
        <MedicalInstitution v-if="index == 7" :userData="userData" />
        <BusinessRelations v-if="index == 4" :userData="userData" />
        <Business v-if="index == 5 && cate == 1002" :userData="userData" />
        <SystemMess v-if="index == 6" :userData="userData" />
        <Orderstat v-if="index == 8" :userData="userData" />
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
  </div>
</template>

<script setup>defineOptions({
  name: "user",
  inheritAttrs: false
});
import { useUserStore } from "@/store";
import OrderAPI from "@/api/order";
const route = useRoute();
const userStore = useUserStore();
const userData = ref({});
const menuLists = ref([]);
const index = ref(-1);
const i = ref(0);
const cate = ref(1002);
const menusParams = reactive({
  source: "PcWeb",
  path: "person"
});
cate.value = userStore.userInfo.members.orgClassifyCode;
const organParams = reactive({
  id: 0
});
function Query() {
  organParams.id = userStore.userInfo.members.id;
  OrderAPI.getData(organParams).then((data) => {
    if (data) {
      data.account = userStore.userInfo.account;
      userData.value = data;
      i.value += 1;
      if (route.path == "/member") {
        index.value = 3;
      } else if (route.path == "/customerorg") {
        index.value = 7;
      } else {
        index.value = 0;
      }
    }
  });
}
async function queryMenus() {
  let data = await OrderAPI.getMenusList(menusParams);
  if (data.length > 0) {
    data[0].children.forEach((a, index2) => {
      a.isSelected = false;
      if (route.path != "/member" && route.path != "/customerorg" && index2 == 0) {
        a.isSelected = true;
      }
      switch (a.path) {
        case "acount":
          a.id = 0;
          break;
        case "safety":
          a.id = 1;
          break;
        case "approve":
          a.id = 2;
          break;
        case "cuorg":
          if (route.path == "/customerorg") {
            a.isSelected = true;
          }
          a.id = 7;
          break;
        case "orgmeb":
          if (route.path == "/member") {
            a.isSelected = true;
          }
          a.id = 3;
          break;
        case "relation":
          a.id = 4;
          break;
        case "relationmeb":
          a.id = 5;
          break;
        case "System":
          a.id = 6;
          break;
        case "orderstat":
          a.id = 8;
          break;
      }
    });
    menuLists.value = data[0].children;
  } else {
    menuLists.value = [];
  }
}
function onClickMenus(itme) {
  const menu = menuLists.value.filter((a) => a.isSelected == true);
  if (menu.length > 0) {
    menu[0].isSelected = false;
  }
  itme.isSelected = true;
  index.value = itme.id;
}
onMounted(() => {
  Query();
  queryMenus();
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
  .ecmbody-top {
    display: flex;
    width: 100%;
    font-weight: 700;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
  .ecmbody-content {
    display: flex;
    width: 100%;
    border-radius: 6px;
    border: 0.5px solid #c5d1dc;
    min-height: 720px;
    background-color: #ffffff;
    .ecmbody-content-left {
      display: flex;
      width: 20%;
      border-bottom-left-radius: 6px;
      border-top-left-radius: 6px;
      background-color: #e9f0f5;
      padding: 18px 10px;
      flex-flow: column;
      .ecmbody-content-left-avatar {
        display: flex;
        width: 100%;
        line-height: 100%;
        letter-spacing: 0%;
        height: 70px;
        line-height: 20px;
        overflow: hidden;
        .ecmbody-content-left-avatar1 {
          display: flex;
          width: 30%;
        }
        .ecmbody-content-left-avatar2 {
          display: flex;
          width: 70%;
          font-family: Noto Sans SC;
          font-weight: 700;
          font-size: 18px;
          vertical-align: middle;
          flex-flow: column;
          padding-left: 5%;
          span {
            font-family: Noto Sans SC;
            font-weight: 400;
            font-size: 18px;
            vertical-align: middle;
            color: #757575;
            padding-top: 10px;
          }
        }
      }
      .ecmbody-content-left-menu {
        display: flex;
        width: 100%;
        flex-flow: column;
        padding: 18px 10px;
        .ecmbody-content-left-menu1 {
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-radius: 6px;
          background-color: #2f80ed;
          color: #ffffff;
          font-weight: 700;
          font-size: 18px;
          text-align: center;
          margin-top: 10px;
          cursor: pointer;
        }
        .ecmbody-content-left-menu2 {
          width: 100%;
          height: 40px;
          line-height: 40px;
          color: #333f48;
          font-weight: 400;
          font-size: 18px;
          text-align: center;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
    .ecmbody-content-right {
      display: flex;
      width: 80%;
      padding: 18px 30px;
      flex-flow: column;
      .ecmbody-content-right-top {
        display: flex;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 24px;
        letter-spacing: 0%;
        color: #333f48;
        height: auto;
      }
      .ecmbody-content-right-top1 {
        display: flex;
        width: 100%;
        .ecmbody-content-right-top1-left {
          display: flex;
          width: 80%;
          .ecmbody-content-right-top1-left1 {
            width: auto;
            display: flex;
          }
          .ecmbody-content-right-top1-left2 {
            display: flex;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 18px;
            flex-flow: column;
            padding-left: 3%;
            justify-content: center;
            span {
              font-family: Noto Sans SC;
              font-weight: 400;
              font-size: 18px;
              vertical-align: middle;
              color: #757575;
              padding-top: 10px;
            }
          }
        }
        .ecmbody-content-right-top1-right {
          display: flex;
          width: 20%;
          span {
            height: 30px;
            border-radius: 6px;
            width: 120px;
            background-color: #4a5a6a;
            text-align: center;
            line-height: 30px;
            color: #ffffff;
            font-family: Noto Sans SC;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
          }
        }
      }
      .ecmbody-content-right-top2 {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-top: 5%;
        :deep(.el-form-item__content) {
          line-height: 32px;
          font-size: 18px;
          font-family: Noto Sans SC;
          font-weight: 400;
          color: #757575;
        }
        :deep(.el-form-item__label) {
          justify-content: flex-start;
          text-align: left;
          font-size: 18px;
          font-family: Noto Sans SC;
          font-weight: 400;
          color: #757575;
        }
      }
    }
  }
  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 25px;
  }
}
</style>
