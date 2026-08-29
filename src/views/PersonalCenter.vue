<script setup>
// 个人中心：设置个人信息 + 调整字体大小
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore, FONT_SIZES } from '../stores/user'

const userStore = useUserStore()

// ---------- 个人信息表单 ----------
// reactive 把普通对象变成响应式对象，输入框输入时 form 里的值会同步变化
const form = reactive({
  nickname: userStore.nickname,
  email: userStore.email,
  phone: userStore.phone,
  intro: userStore.intro,
})

// 表单校验规则
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

// 通过 ref 拿到 el-form 组件实例，用来触发校验
const formRef = ref()

async function saveProfile() {
  // validate()：校验不通过会抛出异常，代码不会继续往下走
  await formRef.value.validate()
  userStore.updateProfile({ ...form })
  ElMessage.success('个人信息已保存')
}

// ---------- 字体大小调整 ----------
function onFontSizeChange(size) {
  userStore.setFontSize(size) // store 变化 -> App.vue 的 watchEffect 更新 CSS 变量 -> 全站生效
}
</script>

<template>
  <el-row :gutter="16">
    <!-- 左侧：个人信息（xs=手机占满整行，sm 及以上占 14/24） -->
    <el-col :xs="24" :sm="14">
      <el-card header="个人信息" class="mb-card">
        <!-- :model 和 :rules 把表单数据和校验规则交给 el-form 管理 -->
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input
              v-model="form.intro"
              type="textarea"
              :rows="3"
              placeholder="介绍一下自己吧"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveProfile">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <!-- 右侧：字体大小设置 -->
    <el-col :xs="24" :sm="10">
      <el-card header="字体大小">
        <!-- el-radio-button：一组按钮式的单选框 -->
        <el-radio-group :model-value="userStore.fontSize" @change="onFontSizeChange">
          <el-radio-button
            v-for="item in FONT_SIZES"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}（{{ item.value }}px）
          </el-radio-button>
        </el-radio-group>

        <el-divider />

        <!-- 实时预览当前字号的效果 -->
        <p class="preview" :style="{ fontSize: userStore.fontSize + 'px' }">
          预览：你好，{{ userStore.nickname }}！这是当前字号的显示效果。
        </p>
        <p class="tip">选择后立即生效，并自动保存，全站文字都会跟着变化。</p>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
/* 窄屏单列堆叠时，两张卡片之间留出间距 */
.mb-card {
  margin-bottom: 16px;
}

.preview {
  line-height: 1.8;
}

.tip {
  margin-top: 12px;
  color: #909399;
  font-size: 12px;
}
</style>
