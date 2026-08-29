// 用户 store：全局共享的个人信息和字体大小设置
import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'pc-vue-demo-user'

// 字体大小可选档位（个人中心的选项列表）
export const FONT_SIZES = [
  { label: '小', value: 12 },
  { label: '中', value: 14 }, // 14px 是最常见的正文大小
  { label: '大', value: 16 },
]

// 从 localStorage 读取上次保存的用户信息（刷新页面数据不丢失）
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {} // 解析失败就当作没有存过
  }
}

// defineStore 定义一个全局"仓库"，任何组件里都能 useUserStore() 拿到同一份数据
export const useUserStore = defineStore('user', () => {
  const saved = loadSaved()

  // ---------- 个人信息 ----------
  const nickname = ref(saved.nickname || '张三') // 昵称
  const email = ref(saved.email || 'zhangsan@example.com')
  const phone = ref(saved.phone || '13800138000')
  const intro = ref(saved.intro || '一名正在学习 Vue 的开发者')

  // 把当前所有用户信息写进 localStorage
  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        nickname: nickname.value,
        email: email.value,
        phone: phone.value,
        intro: intro.value,
        fontSize: fontSize.value,
      })
    )
  }

  // 保存个人信息（个人中心表单提交时调用）
  function updateProfile(profile) {
    nickname.value = profile.nickname
    email.value = profile.email
    phone.value = profile.phone
    intro.value = profile.intro
    save()
  }

  // ---------- 字体大小 ----------
  const fontSize = ref(saved.fontSize || 14) // 默认 14px

  function setFontSize(size) {
    fontSize.value = size
    save()
  }

  return { nickname, email, phone, intro, updateProfile, fontSize, setFontSize }
})
