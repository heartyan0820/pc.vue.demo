<script setup>
// 订单管理：列表展示 + 增删改查
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrdersStore, ORDER_STATUS, statusOf } from '../stores/orders'
import { useUiStore } from '../stores/ui'

const ordersStore = useOrdersStore()
const ui = useUiStore() // 里面有 isMobile：当前是否窄屏

// ---------- 查：搜索关键词 + 状态筛选 ----------
const keyword = ref('') // 搜索关键词（订单号 / 客户 / 商品）
const statusFilter = ref('') // 状态筛选，空字符串表示"全部"

// computed 计算属性：依赖的数据（keyword、statusFilter、list）变化时自动重新计算
const filteredList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return ordersStore.list.filter((o) => {
    // 关键词：在订单号、客户、商品里模糊匹配
    const matchKeyword =
      !kw ||
      o.orderNo.toLowerCase().includes(kw) ||
      o.customer.includes(kw) ||
      o.product.includes(kw)
    // 状态：没选就全部通过
    const matchStatus = !statusFilter.value || o.status === statusFilter.value
    return matchKeyword && matchStatus
  })
})

// ---------- 增 / 改：共用一个弹窗表单 ----------
const dialogVisible = ref(false) // 弹窗是否显示
const editingId = ref(null) // 正在编辑的订单 id；为 null 表示新增
const formRef = ref()

// 生成一份空表单（新增时用）
function emptyForm() {
  return {
    orderNo: 'SO' + Date.now(), // 简单用时间戳生成订单号
    customer: '',
    product: '',
    amount: 0,
    status: 'pending',
    createdAt: new Date().toISOString().slice(0, 10), // 今天的日期 yyyy-MM-dd
  }
}

// reactive 表单数据
const form = reactive(emptyForm())

const rules = {
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  customer: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  product: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
}

function openAdd() {
  editingId.value = null
  Object.assign(form, emptyForm()) // 用空数据覆盖表单
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, row) // 把这一行数据拷贝进表单
  dialogVisible.value = true
}

async function saveOrder() {
  await formRef.value.validate() // 校验不通过会抛异常，不会继续执行
  if (editingId.value === null) {
    ordersStore.addOrder({ ...form }) // 增
    ElMessage.success('订单已新增')
  } else {
    ordersStore.updateOrder({ ...form, id: editingId.value }) // 改
    ElMessage.success('订单已更新')
  }
  dialogVisible.value = false
}

// ---------- 删：确认后删除 ----------
async function handleDelete(row) {
  // ElMessageBox.confirm：用户点击"确定"才会继续往下执行，点"取消"会抛异常
  await ElMessageBox.confirm(`确定删除订单 ${row.orderNo} 吗？`, '提示', {
    type: 'warning',
  })
  ordersStore.removeOrder(row.id)
  ElMessage.success('订单已删除')
}
</script>

<template>
  <el-card>
    <!-- 工具栏：搜索、状态筛选、新增按钮 -->
    <div class="toolbar" >
      <el-input
        v-model="keyword"
        placeholder="搜索订单号 / 客户 / 商品"
        clearable
        style="width: 240px"
      />
      <el-select
        v-model="statusFilter"
        placeholder="全部状态"
        clearable
        style="width: 140px"
      >
        <el-option
          v-for="s in ORDER_STATUS"
          :key="s.value"
          :label="s.label"
          :value="s.value"
        />
      </el-select>
 
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div>
          <el-button type="primary" style="background-color:#2549E7">查 询</el-button>
          <el-button type="primary" style="background-color:#3D9FA6">重 置</el-button>
        </div>
        <div style="margin-left:1000px">
          <el-button type="primary" @click="openAdd" style="display:right">新增订单</el-button>
        </div> 
      </div>

    </div>

    <!-- 订单表格 -->
    <el-table :data="filteredList" border stripe>
      <el-table-column prop="orderNo" label="订单号" min-width="150" />
      <el-table-column prop="customer" label="客户" min-width="100" />
      <!-- 窄屏时隐藏次要列（商品、下单日期），避免表格过于拥挤 -->
      <el-table-column
        v-if="!ui.isMobile"
        prop="product"
        label="商品"
        min-width="130"
      />
      <el-table-column prop="amount" label="金额（元）" width="110" align="right">
        <!-- #default 是作用域插槽：拿到当前行数据 row 自己渲染内容 -->
        <template #default="{ row }">
          {{ row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusOf(row.status).type">
            {{ statusOf(row.status).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!ui.isMobile"
        prop="createdAt"
        label="下单日期"
        width="120"
      />
      <!-- fixed 固定列在窄屏时取消，否则会遮挡内容 -->
      <el-table-column
        label="操作"
        width="140"
        align="center"
        :fixed="ui.isMobile ? false : 'right'"
      >
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <p class="total">共 {{ filteredList.length }} 条订单</p>
  </el-card>

  <!-- 新增 / 编辑弹窗（窄屏时宽度改为几乎占满屏幕） -->
  <el-dialog
    v-model="dialogVisible"
    :title="editingId === null ? '新增订单' : '编辑订单'"
    :width="ui.isMobile ? '94%' : '480px'"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="form.orderNo" />
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="form.customer" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="商品" prop="product">
        <el-input v-model="form.product" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="form.amount" :min="0" :precision="2" :step="100" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option
            v-for="s in ORDER_STATUS"
            :key="s.value"
            :label="s.label"
            :value="s.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单日期" prop="createdAt">
        <!-- value-format 让日期选择器直接输出 yyyy-MM-dd 字符串 -->
        <el-date-picker
          v-model="form.createdAt"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveOrder">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.toolbar {
  display: flex;  
  border: 1px solid #cbdef1; 
  flex-wrap: wrap; /* 窄屏时放不下会自动换行 */
  gap: 12px;
  margin-bottom: 16px;
}

.total {
  margin-top: 12px;
  color: #909399;
  font-size: 12px;
  text-align: right;
}
</style>
