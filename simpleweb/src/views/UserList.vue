<template>
  <el-card>
    <div class="list-toolbar">
      <div class="filters">
        <el-input v-model="query.name" class="filter-name" placeholder="按姓名搜索" clearable />
        <!--开始结束时间-->
        <el-date-picker v-model="query.startDate" class="filter-date" type="date" placeholder="开始时间" />
        <el-date-picker v-model="query.endDate" class="filter-date" type="date" placeholder="结束时间" />

        <el-button type="primary" @click="loadData">查询</el-button>
      </div>
      <div>
        <el-button type="success" @click="openDialog()">新增用户</el-button>
      </div>
    </div>

    <div class="table-wrap">
      <el-table :data="list" class="users-table" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ row.created_at || '2024-01-01 10:00:00' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Pagination v-model:current-page="page" v-model:page-size="size" :total="total" @current-change="loadData"
      @size-change="loadData" />

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'" width="min(400px, calc(100vw - 24px))">
      <el-form :model="form" label-width="60px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '../components/pagination/pagination.vue'

const list = ref([])
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
const query = ref({ name: '', startDate: null, endDate: null })

const dialogVisible = ref(false)
const form = reactive({ id: null, name: '', phone: '', email: '', created_at: null })

function loadData() {
  loading.value = true
  setTimeout(() => {
    // 真实项目：const data = await request.get('/api/users', { params: { page: page.value, name: query.value.name, startDate: query.value.startDate, endDate: query.value.endDate } })
    list.value = [
      { id: 1, name: '张三', phone: '13800000001', email: 'zs@qq.com', created_at: '2024-01-01 10:00:00' },
      { id: 2, name: '李四', phone: '13800000002', email: 'ls@qq.com', created_at: '2024-01-02 11:00:00' }
    ]
    total.value = 100
    loading.value = false
  }, 300)
}

function openDialog(row) {
  if (row) {
    Object.assign(form, row)        // 编辑：回填
  } else {
    Object.assign(form, { id: null, name: '', phone: '', email: '', created_at: null })  // 新增：清空
  }
  dialogVisible.value = true
}

function save() {
  // 真实项目：await request.post('/api/users', form)
  ElMessage.success(form.id ? '修改成功' : '新增成功')
  dialogVisible.value = false
  loadData()
}

function del(row) {
  ElMessageBox.confirm(`确定删除 ${row.name} 吗？`, '提示', { type: 'warning' })
    .then(() => {
      // 真实项目：await request.delete(`/api/users/${row.id}`)
      ElMessage.success('已删除')
      loadData()
    })
    .catch(() => { })
}

onMounted(loadData)
</script>

<style scoped>
.list-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
}

.filter-name {
  width: 200px;
}

.filter-date {
  width: 220px;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  min-width: 720px;
}

@media (max-width: 767px) {
  .list-toolbar {
    flex-direction: column;
  }

  .filters,
  .filter-name,
  .filter-date {
    width: 100%;
  }
}
</style>
