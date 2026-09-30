<template>
  <div>
    <p>
      <input type="text" v-model.lazy="message" placeholder="请输入内容"
        style="width: 200px;height:30px;margin-right: 10px;font-size: 15px;" />
      <br />
      <el-label style="font-size: 15px;"> 输入的内容：{{ message }}</el-label>
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
            <br />
            <li v-for="(item, key, index) in userItems[0]">
              index={{ index }} key={{ key }} item={{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <hr style="margin:10px 0px;" />
      <el-label style="display: inline-block; font-size: 16px; font-weight: bold;color:chocolate;padding: 10px 0px;">卡片式
        template：v-for
      </el-label>
      <p>
        <template v-for="(item, index) in userItems" :key="item.id">
          <el-card :header="'用户' + (index + 1)" style="margin-bottom: 10px;">
            <p>id={{ item.id }}, name={{ item.name }}, age={{ item.age }}</p>
          </el-card>
        </template>
      </p>
    </div>

    <div>
      <hr style="margin:10px 0px;" />
      <el-label style="display: inline-block; font-size: 16px; font-weight: bold;color:chocolate;padding: 10px 0px;">
        事件修饰符
      </el-label>
      <p>
        <!-- 点击事件最多被触发一次 -->
        <a @click.once="$alert('onceClick')">onceClick</a>
        <br /><br />
        输入框：
        <el-input v-focus type="text" placeholder="请输入内容,按下Enter键触发提示" @keyup.enter="$alert(message)"
          v-model="message"></el-input>
      </p>
    </div>


    <div>
      <hr style="margin:10px 0px;" />
      <el-label style="display: inline-block; font-size: 16px; font-weight: bold;color:chocolate;padding: 10px 0px;">
        表单控件
      </el-label>
      <p>
        <el-label style="font-size: 15px;"> 输入的内容：{{ awesome }}</el-label>
        <br />
        <el-checkbox v-model="awesome">Awesome</el-checkbox>

        <br /><br />

      <div>Checked names: {{ checkedNames }}</div>
      <el-checkbox v-model="checkedNames" value="Jack"> Jack</el-checkbox>
      <el-checkbox v-model="checkedNames" value="John"> John</el-checkbox>
      <el-checkbox v-model="checkedNames" value="Mike"> Mike</el-checkbox>

      <br /><br />
      <div>radio names: {{ radioNames }}</div>
      <el-radio v-model="radioNames" value="Jack"> Jack</el-radio>
      <el-radio v-model="radioNames" value="John"> John</el-radio>
      <el-radio v-model="radioNames" value="Mike"> Mike</el-radio>

      <br /><br />
      <div>下拉框 Selected: {{ selected }}</div>
      <el-label>单选：</el-label>
      <el-select v-model="selected" placeholder="请选择" style="width: 200px;">
        <el-option disabled value="">请选择</el-option>
        <el-option value="选项1">选项1</el-option>
        <el-option value="选项2">选项2</el-option>
        <el-option value="选项3">选项3</el-option>
      </el-select>

      <el-label> 多选：</el-label>
      <el-select v-model="selected" multiple placeholder="请选择" style="width: 200px;">
        <el-option disabled value="">请选择</el-option>
        <el-option value="选项1">选项1</el-option>
        <el-option value="选项2">选项2</el-option>
        <el-option value="选项3">选项3</el-option>
      </el-select>

      <el-label> 循环遍历下拉框：</el-label>
      <el-select v-model="selected" style="width: 200px;">
        <el-option v-for="(item, index) in options" :key="item.value" :label="item.label" :value="item.value">
          {{ item.label }}
        </el-option>
      </el-select>

      <br /><br />
      <div>修饰符：</div>
      <el-label>lazy：</el-label>
      <el-input v-model.lazy="msg" style="width: 200px;" />
      <el-label> trim：</el-label>
      <el-input v-model.trim="msg" style="width: 200px;" />
      <el-label> number：</el-label>
      <el-input v-model.number="msg" style="width: 200px;" />

      <br /><br />
      <div>侦听器watch-> 结果：{{ sum }}</div>
      <el-label>number1:</el-label><el-input v-model.number="number1" style="width: 200px;" />
      <el-label>number2:</el-label><el-input v-model.number="number2" style="width: 200px;" />
      </p>
    </div>

    <div>
      <hr style="margin:10px 0px;" />
      <el-label style="display: inline-block; font-size: 16px; font-weight: bold;color:chocolate;padding: 10px 0px;">
        属性+事件
      </el-label>
      <p>
        <MouseDemo />
      </p>
      <br />

      <p>
        <hr style="margin:10px 0px;" />
        <el-label style="display: inline; font-size: 16px; font-weight: bold;color:chocolate;padding: 10px 0px;">
          img </el-label>
        <br />
        <br />
        <img v-lazy="imgUrl" alt="图片a" />
        <br />
        <br />
        <el-label>start：{{ startIndex }}</el-label>
      </p>

      <p>
        <UseTimer />
      </p>
    </div>

    </p>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
import { ref, watch, defineProps, onMounted } from 'vue'
import Parent from '../PropsDemo/Parent.vue'
import MouseDemo from '../EventComponents/MouseDemo.vue';
import UseTimer from './useTimer.vue';

const props = defineProps(['foo'])
onMounted(() => {
  console.log(props.foo)
  console.log(`prop.foo=${props.foo === undefined ? '空' : props.foo}`)

})
const startIndex = ref(0)
var timer = setInterval(() => {
  startIndex.value++
}, 10)


const number1 = ref(0)
const number2 = ref(0)
const sum = ref(0)
watch(
  () => number1.value + number2.value,
  (newSum) => {
    console.log('number1 + number2 =', newSum)
    sum.value = newSum
  }
)
const watchObj = ref(0)
watch(watchObj, (newValue, oldValue) => {
  console.log('newValue=' + newValue)
  console.log('oldValue=' + oldValue)
})
watchObj.value++

const msg = ref('')
const selected = ref('')
const message = ref('')
const count = ref(0)
const awesome = ref(true)
const checkedNames = ref([])
const radioNames = ref([])
const styleObject = ref({
  color: 'red',
  fontSize: '16px',
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0',
  padding: '5px',
  borderRadius: '5px',
});
const options = ref([
  { value: '', label: '请选择...' },
  { value: '选项1', label: '黄金糕' },
  { value: '选项2', label: '双皮奶' },
  { value: '选项3', label: '蚵仔煎' },
  { value: '选项4', label: '龙须面' },
  { value: '选项5', label: '北京烤鸭' },
])

const imgUrl = ref('https://www.epdent.cn/img/logo.KBL4LQEG.png')

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