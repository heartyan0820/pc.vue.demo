<script setup>
import { ref, onMounted } from 'vue'
import Pagination from '../components/pagination/pagination.vue'

const list = ref([])
const loading = ref(false)

const page = ref(1)
const size = ref(10)
const total = ref(0)

function loadData() {
  loading.value = true
  setTimeout(() => {
    // 真实项目：const data = await request.get('/api/orders', { params: { page: page.value } })
    list.value = [
      { id: 1, user: '张三', amount: 100, status: '已支付', created_at: '2024-01-01 10:00:00' },
      { id: 2, user: '李四', amount: 200, status: '未支付', created_at: '2024-01-02 11:00:00' }
    ]
    list.value = list.value.concat(
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 3,
        user: `用户${i + 3}`,
        amount: (i + 1) * 50,
        status: i % 2 === 0 ? '已支付' : '未支付',
        created_at: `2024-01-${(i + 3).toString().padStart(2, '0')} 12:00:00`
      }))
    )
    total.value = 50
    loading.value = false
  }, 300)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <el-card>
      <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <span>订单列表</span>
        <el-button type="primary" @click="loadData">刷新</el-button>
      </div>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
        <el-table-column prop="user" label="用户" width="150"></el-table-column>
        <el-table-column prop="amount" label="金额" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100"></el-table-column>
        <el-table-column prop="created_at" label="创建时间"></el-table-column>
      </el-table>
      <Pagination v-model:current-page="page" v-model:page-size="size" :total="total" @current-change="loadData"
        @size-change="loadData" />
    </el-card>
  </div>
</template>

<style scoped></style>