// 订单 store：全局共享的订单数据，以及增、删、改方法
// "查"（搜索/筛选）在 OrderList.vue 里通过 computed 实现
import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'pc-vue-demo-orders'

// 订单状态选项：表格标签和表单下拉框共用这一份配置
export const ORDER_STATUS = [
  { label: '待付款', value: 'pending', type: 'warning' },
  { label: '已付款', value: 'paid', type: 'primary' },
  { label: '已完成', value: 'done', type: 'success' },
  { label: '已取消', value: 'canceled', type: 'info' },
]

// 根据 value 找到对应的状态配置（表格里渲染彩色标签时用）
export function statusOf(value) {
  return ORDER_STATUS.find((s) => s.value === value) || ORDER_STATUS[0]
}

// 首次打开时的示例订单；之后的数据保存在 localStorage
function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // 解析失败则使用下面的默认数据
  }
  return [
    {
      id: 1,
      orderNo: 'SO20260820001',
      customer: '王芳',
      product: '机械键盘',
      amount: 329,
      status: 'paid',
      createdAt: '2026-08-20',
    },
    {
      id: 2,
      orderNo: 'SO20260821002',
      customer: '李雷',
      product: '显示器 27 英寸',
      amount: 1299,
      status: 'pending',
      createdAt: '2026-08-21',
    },
    {
      id: 3,
      orderNo: 'SO20260822003',
      customer: '韩梅梅',
      product: '无线鼠标',
      amount: 99,
      status: 'done',
      createdAt: '2026-08-22',
    },
  ]
}

export const useOrdersStore = defineStore('orders', () => {
  // 订单列表（响应式数组，数据变化时页面自动更新）
  const list = ref(loadOrders())

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value))
  }

  // 增：把新订单插到列表最前面（新数据显眼）
  function addOrder(order) {
    list.value.unshift({ ...order, id: Date.now() }) // 用时间戳当作唯一 id
    save()
  }

  // 改：按 id 找到对应订单，整条替换
  function updateOrder(order) {
    const index = list.value.findIndex((o) => o.id === order.id)
    if (index !== -1) {
      list.value[index] = { ...order }
      save()
    }
  }

  // 删：过滤掉指定 id 的订单
  function removeOrder(id) {
    list.value = list.value.filter((o) => o.id !== id)
    save()
  }

  return { list, addOrder, updateOrder, removeOrder }
})
