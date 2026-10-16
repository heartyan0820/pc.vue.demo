<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import Pagination from '../components/pagination/pagination.vue'
import request from '../utils/request'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const list = ref([])
const columns = ref([])
const statuses = ref([])
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
const updatedAt = ref('')
const queryParams = reactive({
  keywords: '',
  day: 'no',
  createTime: null,
  pageIndex: 1,
  pageSize: 10,
  state: '',
  substituteType: -1,
})

const quickDateOptions = [
  { label: '不限', value: 'no' },
  { label: '今天', value: 'oneDay' },
  { label: '3天', value: 'threeDay' },
  { label: '7天', value: 'sevenDay' },
  { label: '30天', value: 'thirtyDay' },
]

const fallbackColumns = [
  { label: '订单号', value: 'orderNo', width: 150 },
  { label: '患者', value: 'patientName', width: 120 },
  { label: '医生', value: 'doctorName', width: 120 },
  { label: '状态', value: 'state', width: 120 },
  { label: '创建时间', value: 'createTime', width: 180 },
]

const displayColumns = computed(() => {
  const source = columns.value.length ? columns.value : fallbackColumns

  return source.map((column) => {
    const widthMatch = String(column.width ?? '').trim().match(/^(\d+(?:\.\d+)?)(?:px)?$/i)
    const width = widthMatch ? Number(widthMatch[1]) : undefined
    const labelWidth = Array.from(String(column.label || '')).reduce(
      (total, character) => total + (character.charCodeAt(0) > 255 ? 16 : 9),
      16,
    )
    const requiredWidth = Math.max(width || 0, labelWidth)

    return {
      ...column,
      tableWidth: width === undefined ? undefined : requiredWidth,
      tableMinWidth: width === undefined ? Math.max(100, requiredWidth) : undefined,
    }
  })
})

function getToday() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function getDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function handleQuickDate(value) {
  const daysByOption = { oneDay: 0, threeDay: 3, sevenDay: 7, thirtyDay: 30 }
  queryParams.createTime = value === 'no' ? null : [getDaysAgo(daysByOption[value]), getToday()]
}

function handleDateRangeChange(value) {
  queryParams.createTime = value || null
  queryParams.day = 'no'
}

async function loadData() {
  loading.value = true
  queryParams.pageIndex = page.value
  queryParams.pageSize = size.value

  try {
    const members = userStore.userInfo?.members
    const activeMember = Array.isArray(members) ? members[0] : members
    const data = await request.post('/admin/order/querypage', {
      ...queryParams,
      cacheTime: new Date().toLocaleDateString('zh-CN'),
      orgRoleCodes: activeMember?.orgRoleCodes,
    })

    list.value = Array.isArray(data?.lists) ? data.lists : []
    columns.value = Array.isArray(data?.fieldData) ? data.fieldData : []
    statuses.value = Array.isArray(data?.xData) ? data.xData : []
    total.value = Number(data?.total) || 0
    updatedAt.value = new Date().toLocaleString('zh-CN', { hour12: false })
  } catch {
    list.value = []
    columns.value = []
    statuses.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function searchOrders() {
  page.value = 1
  queryParams.pageIndex = 1
  loadData()
}

function selectStatus(status) {
  queryParams.state = status.state
  page.value = 1
  queryParams.pageIndex = 1
  loadData()
}

function resetFilters() {
  queryParams.keywords = ''
  queryParams.day = 'no'
  queryParams.createTime = null
  queryParams.state = ''
  queryParams.substituteType = -1
  page.value = 1
  queryParams.pageIndex = 1
  loadData()
}

function refreshOrders() {
  loadData()
}
onMounted(loadData)
</script>

<template>
  <el-card class="orders-card">
    <div class="page-heading">
      <div>
        <h2>订单管理</h2>
        <span v-if="updatedAt" class="updated-at">最近刷新：{{ updatedAt }}</span>
      </div>
      <el-button circle aria-label="刷新订单" @click="refreshOrders">
        <el-icon>
          <Refresh />
        </el-icon>
      </el-button>
    </div>

    <div v-if="statuses.length" class="status-grid">
      <button v-for="status in statuses" :key="status.state" class="status-card" type="button"
        :style="{ backgroundColor: status.bgcolor, borderColor: queryParams.state === status.state ? status.color : 'transparent' }"
        @click="selectStatus(status)">
        <strong :style="{ color: status.color }">{{ status.value }}</strong>
        <span>{{ status.name }}</span>
      </button>
    </div>

    <div class="list-toolbar">
      <el-input v-model="queryParams.keywords" class="filter-keyword" clearable placeholder="患者、医生、订单号、诊所"
        @keyup.enter="searchOrders" />
      <el-select v-model="queryParams.day" class="filter-day" @change="handleQuickDate">
        <el-option v-for="option in quickDateOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-date-picker v-model="queryParams.createTime" class="filter-range" type="daterange" unlink-panels
        range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD"
        @change="handleDateRangeChange" />
      <el-button type="primary" @click="searchOrders">
        <el-icon>
          <Search />
        </el-icon>
        查询
      </el-button>
      <el-button @click="resetFilters">重置</el-button>
    </div>

    <div class="table-wrap">
      <el-table :data="list" v-loading="loading" class="orders-table" height="100%" stripe border>
        <el-table-column v-for="column in displayColumns" :key="column.value || column.prop || column.label"
          :prop="column.value || column.prop" :label="column.label" :width="column.tableWidth"
          :min-width="column.tableMinWidth" show-overflow-tooltip>
          <template #header>
            <el-tooltip :content="column.label" placement="top" :show-after="300">
              <span class="column-header-label">{{ column.label }}</span>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <span v-if="column.label === '状态'" class="status-label"
              :style="{ color: row.fontColor, backgroundColor: row.backColor }">
              {{ row[column.value || column.prop] }}
            </span>
            <span v-else>{{ row[column.value || column.prop] ?? '-' }}</span>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty :description="loading ? '正在加载订单' : '暂无订单数据'" />
        </template>
      </el-table>
    </div>

    <Pagination class="orders-pagination" v-model:current-page="page" v-model:page-size="size" :total="total"
      @current-change="loadData" @size-change="searchOrders" />
  </el-card>
</template>

<style scoped>
.orders-card {
  display: flex;
  height: 100%;
  min-height: 0;
  min-width: 0;
  flex-direction: column;
}

.orders-card :deep(.el-card__body) {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.page-heading {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-heading h2 {
  margin: 0;
  color: #263445;
  font-size: 18px;
}

.updated-at {
  display: inline-block;
  margin-top: 6px;
  color: #8490a0;
  font-size: 12px;
}

.status-grid {
  display: grid;
  flex: 0 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.status-card {
  display: flex;
  min-height: 68px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 4px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.status-card strong {
  font-size: 20px;
}

.status-card span {
  color: #5f6c7b;
  font-size: 12px;
}

.list-toolbar {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  max-width: 60%;
}

.filter-keyword {
  width: 240px;
}

.filter-day {
  width: 100px;
}

.filter-range {
  width: 280px;
}

.table-wrap {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  overflow: hidden;
}

.orders-table {
  width: 100%;
  min-width: 900px;
  height: 100%;
  --el-table-header-bg-color: #5094f5;
  --el-table-header-text-color: #fff;
  --el-table-tr-bg-color: #fff;
  --el-table-bg-color: #fff;
  --el-table-border-color: rgba(255, 255, 255, 0.95);
  --el-table-row-hover-bg-color: #90b3fa;
}

.orders-pagination {
  flex: 0 0 auto;
  margin-top: 0 !important;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.orders-table :deep(.el-table__header th.el-table__cell) {
  height: 40px;
  padding: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.95) !important;
  background-color: #5094f5 !important;
  color: #fff !important;
  text-align: center;
}

.orders-table :deep(.cell) {
  padding: 0 4px;
}

.orders-table :deep(.el-table__header .cell) {
  font-size: 16px;
  line-height: 1.2;
  white-space: nowrap;
  word-break: normal;
  text-align: center;
  font-weight: 600;
}

.column-header-label {
  display: block;
  white-space: nowrap;
}

.orders-table :deep(.el-table__body tr.el-table__row--striped > td.el-table__cell) {
  background-color: #e9f0f5;
}

.orders-table :deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: #90b3fa !important;
}

.orders-table :deep(.el-table__body tr) {
  height: 46px;
}

.status-label {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid currentColor;
  border-radius: 5px;
}

@media (max-width: 767px) {

  .list-toolbar {
    align-items: stretch;
  }

  .filter-keyword,
  .filter-day,
  .filter-range {
    width: 100%;
  }

  .status-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>