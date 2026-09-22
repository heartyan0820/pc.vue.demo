<template>
  <div>
    <p>
      <input type="text" v-model.lazy="message" placeholder="请输入内容"
        style="width: 200px;height:30px;margin-right: 10px;font-size: 15px;" />
      <br />
      <label style="font-size: 15px;">输入的内容：{{ message }}</label>
      <br />
      <br />
      <label>点击的次数：{{ count }}</label>
      <button @click="btnAdd" class="button" :disabled="false">确定</button>
      <button @click="count++">点击了{{ count }}下</button>
      <el-button style="background-color: blueviolet;" type="primary" @click="ElMessage.info('这是一条提示消息')">element弹窗提示
      </el-button>
      <br />
      <hr style="margin:10px 0px;" />
    <p>
      <el-label v-if="count % 2 == 0">v-if演示,count值为偶数时显示</el-label>
      &nbsp;&nbsp;
      <a href="https://cn.vuejs.org/guide/essentials/template-syntax.html#v-if" target="_blank">v-if文档</a>
    </p>
    <br />
    <p>
      <el-button type="primary" @click="awesome = !awesome">Toggle</el-button>
    <h1 v-if="awesome"> vue is awesome </h1>
    <h1 v-else> vue is not awesome </h1>
    </p>
    <br />
    <p>
    <div>
      <el-button type="primary" @click="updUser">修改userInfo</el-button>
      <div :style="styleObject">
        <el-label>当前userInfo：id={{ userInfo.id.count }}, name={{ userInfo.name }}, array={{ userInfo.array }}</el-label>
      </div>
    </div>
    </p>
    <hr style="margin:10px 0px;" />
    <div>
      <div>
        <el-button type="primary" @click="addUser">新增userItems</el-button>
        <el-button type="primary" @click="ElMessageBox.confirm('你确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          ElMessage({
            type: 'success',
            message: '删除成功!',
          });
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          });
        })">弹窗确认</el-button>
        <div :style="styleObject" style="color:blue;padding-left:20px;">
          <el-label>当前userItems：</el-label>
          <ul>
            <li v-for="item in userItems" :key="item.id">
              id={{ item.id }}, name={{ item.name }}, age={{ item.age }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr style="margin:10px 0px;" />
    <p>
    </p>

    </p>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
import { ref } from 'vue'

const message = ref('')
const count = ref(0)
const awesome = ref(true)
const styleObject = ref({
  color: 'red',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0',
  padding: '5px',
  borderRadius: '5px',
});

const btnAdd = () => {
  count.value++;
  // ElMessageBox.alert(`你点击了${count.value}次，输入的内容是：${message.value}`, '提示', {
  //   confirmButtonText: '确定',
  // });
  // ElMessageBox.alert('hello', '温馨提示', {
  //   confirmButtonText: `确定${count.value}`
  // });
  ElMessage.success('操作成功');
}

const userInfo = ref({
  id: { count: 0 },
  name: '张三',
  array: ['foo', 'bar'],
})
const userItems = ref([{
  id: 1,
  name: '张三',
  age: 18,
}, {
  id: 2,
  name: '李四',
  age: 20,
}])
function updUser() {
  userInfo.value.id.count++;
  userInfo.value.name = '李四';
  userInfo.value.array.push(`item${userInfo.value.id.count}`);
  ElMessage.success('userInfo已修改');
}
function addUser() {
  userItems.value.push({
    id: userItems.value.length + 1,
    name: '王五' + userItems.value.length + 1,
    age: 22 + userItems.value.length + 1,
  });
  ElMessage.success('userItems新增成功');
}
</script>

<style scoped>
button {
  min-width: 80px;
  background-color: #3d9fa6;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>