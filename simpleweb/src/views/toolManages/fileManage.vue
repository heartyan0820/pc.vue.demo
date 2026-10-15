<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'

const previousComparisonKey = 'simpleweb:previous-folder-comparison'

function readPreviousComparison() {
  try {
    const saved = JSON.parse(localStorage.getItem(previousComparisonKey) || 'null')
    if (!saved?.result || !Array.isArray(saved.result.missingFiles) || !Array.isArray(saved.result.sizeDifferences)) {
      return null
    }
    return saved
  } catch {
    return null
  }
}

const folder1Input = ref(null)
const folder2Input = ref(null)
const folder1Name = ref('')
const folder2Name = ref('')
const folder1Files = ref([])
const folder2Files = ref([])
const result = ref(null)
const lastComparison = ref(readPreviousComparison())

const canCompare = computed(() => folder1Files.value.length > 0 && folder2Files.value.length > 0)

function getRelativePath(file) {
  const path = (file.webkitRelativePath || file.name).replaceAll('\\', '/')
  const segments = path.split('/')
  // 去掉所选目录名，只按目录内部路径匹配两个文件夹。
  return segments.length > 1 ? segments.slice(1).join('/') : segments[0]
}

function selectFolder(event, folderNumber) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  const relativeRoot = files[0].webkitRelativePath || files[0].name
  const folderName = relativeRoot.split(/[\\/]/)[0]
  // 比对只需要相对路径和文件字节数，不读取文件内容。
  const selectedFiles = files.map((file) => ({
    path: getRelativePath(file),
    size: file.size,
  }))

  if (folderNumber === 1) {
    folder1Name.value = folderName
    folder1Files.value = selectedFiles
  } else {
    folder2Name.value = folderName
    folder2Files.value = selectedFiles
  }

  result.value = null
  // 清空原生 input，之后重新选择同一个目录也能触发 change。
  event.target.value = ''
}

function compareFolders() {
  if (!canCompare.value) {
    ElMessage.warning('请先选择两个文件夹')
    return
  }

  // 建立路径索引，避免逐个扫描文件夹 2。
  const folder2ByPath = new Map(folder2Files.value.map((file) => [file.path, file]))
  const missingFiles = []
  const sizeDifferences = []

  for (const file1 of folder1Files.value) {
    const file2 = folder2ByPath.get(file1.path)
    if (!file2) {
      missingFiles.push(file1)
    } else if (file1.size !== file2.size) {
      sizeDifferences.push({
        path: file1.path,
        sizeInFolder1: file1.size,
        sizeInFolder2: file2.size,
      })
    }
  }

  result.value = {
    folder1Count: folder1Files.value.length,
    folder2Count: folder2Files.value.length,
    missingFiles: missingFiles.sort((a, b) => b.size - a.size),
    sizeDifferences,
  }

  // 只保存回显页面需要的信息，避免把整份文件清单写入本地存储。
  lastComparison.value = {
    folder1Name: folder1Name.value,
    folder2Name: folder2Name.value,
    result: result.value,
  }
  try {
    localStorage.setItem(previousComparisonKey, JSON.stringify(lastComparison.value))
  } catch {
    ElMessage.warning('比对完成，但上一次记录无法保存到本地')
  }
}

function showPreviousComparison() {
  if (!lastComparison.value) return

  folder1Name.value = lastComparison.value.folder1Name
  folder2Name.value = lastComparison.value.folder2Name
  folder1Files.value = []
  folder2Files.value = []
  result.value = lastComparison.value.result
}

function resetComparison() {
  folder1Name.value = ''
  folder2Name.value = ''
  folder1Files.value = []
  folder2Files.value = []
  result.value = null
  if (folder1Input.value) folder1Input.value.value = ''
  if (folder2Input.value) folder2Input.value.value = ''
}

function formatSize(size) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${unitIndex === 0 ? value : value.toFixed(2)} ${units[unitIndex]}`
}

function missingFilesSummary({ columns, data }) {
  // 汇总缺失文件在文件夹 1 中占用的总大小。
  return columns.map((_, index) => {
    if (index === 0) return '合计'
    if (index === 1) return formatSize(data.reduce((total, file) => total + file.size, 0))
    return ''
  })
}

function sizeDifferencesSummary({ columns, data }) {
  // 两列分别合计大小差异文件在两个文件夹中的总大小。
  return columns.map((_, index) => {
    if (index === 0) return '合计'
    if (index === 1) return formatSize(data.reduce((total, file) => total + file.sizeInFolder1, 0))
    if (index === 2) return formatSize(data.reduce((total, file) => total + file.sizeInFolder2, 0))
    return ''
  })
}
</script>

<template>
  <el-card class="compare-card">
    <template #header>
      <div class="page-heading">
        <div>
          <h2>文件夹比对</h2>
          <p>按相对路径检查文件缺失和大小差异</p>
        </div>
      </div>
    </template>

    <div class="folder-grid">
      <section class="folder-box">
        <div class="folder-heading">
          <span class="folder-index">1</span>
          <div>
            <h3>基准文件夹</h3>
            <p>比对基准，检查文件夹 2 是否缺少文件</p>
          </div>
        </div>
        <div class="folder-actions">
          <span class="folder-name" :title="folder1Name">{{ folder1Name || '尚未选择文件夹' }}</span>
          <el-button type="primary" plain @click="folder1Input?.click()">选择文件夹</el-button>
          <input ref="folder1Input" class="folder-input" type="file" directory multiple
            @change="selectFolder($event, 1)" />
        </div>
        <div v-if="folder1Files.length || result" class="file-count">
          已读取 {{ folder1Files.length || result.folder1Count }} 个文件
        </div>
      </section>

      <section class="folder-box">
        <div class="folder-heading">
          <span class="folder-index folder-index-secondary">2</span>
          <div>
            <h3>待比对文件夹</h3>
            <p>将与基准文件夹逐个比较</p>
          </div>
        </div>
        <div class="folder-actions">
          <span class="folder-name" :title="folder2Name">{{ folder2Name || '尚未选择文件夹' }}</span>
          <el-button type="primary" plain @click="folder2Input?.click()">选择文件夹</el-button>
          <input ref="folder2Input" class="folder-input" type="file" directory multiple
            @change="selectFolder($event, 2)" />
        </div>
        <div v-if="folder2Files.length || result" class="file-count">
          已读取 {{ folder2Files.length || result.folder2Count }} 个文件
        </div>
      </section>
    </div>

    <div class="action-row">
      <el-button type="primary" :disabled="!canCompare" @click="compareFolders">开始比对</el-button>
      <el-button :disabled="!lastComparison" @click="showPreviousComparison">
        <el-icon>
          <Clock />
        </el-icon>
        上一次比对记录
      </el-button>
      <el-button @click="resetComparison">重置</el-button>
    </div>

    <template v-if="result">
      <div class="summary-grid">
        <div class="summary-item"><span>文件夹 1 文件数</span><strong>{{ result.folder1Count }}</strong></div>
        <div class="summary-item"><span>文件夹 2 文件数</span><strong>{{ result.folder2Count }}</strong></div>
        <div class="summary-item"><span>文件夹 2 缺少</span><strong class="warning-number">{{ result.missingFiles.length
        }}</strong></div>
        <div class="summary-item"><span>大小不一致</span><strong class="warning-number">{{ result.sizeDifferences.length
        }}</strong></div>
      </div>

      <section class="result-section">
        <div class="section-heading">
          <h3>文件夹 2 缺少的文件</h3>
          <el-tag type="warning">{{ result.missingFiles.length }} 个</el-tag>
        </div>
        <el-table :data="result.missingFiles" border show-summary :summary-method="missingFilesSummary"
          empty-text="没有缺失文件">
          <el-table-column prop="path" label="相对路径" min-width="280" show-overflow-tooltip />
          <el-table-column label="文件夹 1 大小" width="160">
            <template #default="{ row }">{{ formatSize(row.size) }}</template>
          </el-table-column>
        </el-table>
      </section>

      <section class="result-section">
        <div class="section-heading">
          <h3>文件大小不一致</h3>
          <el-tag type="warning">{{ result.sizeDifferences.length }} 个</el-tag>
        </div>
        <el-table :data="result.sizeDifferences" border show-summary :summary-method="sizeDifferencesSummary"
          empty-text="没有大小差异">
          <el-table-column prop="path" label="相对路径" min-width="280" show-overflow-tooltip />
          <el-table-column label="文件夹 1 大小" width="160">
            <template #default="{ row }">{{ formatSize(row.sizeInFolder1) }}</template>
          </el-table-column>
          <el-table-column label="文件夹 2 大小" width="160">
            <template #default="{ row }">{{ formatSize(row.sizeInFolder2) }}</template>
          </el-table-column>
        </el-table>
      </section>
    </template>
  </el-card>
</template>

<style scoped>
.compare-card {
  max-width: 1100px;
  margin: 0 auto;
}

.page-heading h2,
.folder-heading h3,
.section-heading h3 {
  margin: 0;
  color: #263445;
}

.page-heading p,
.folder-heading p {
  margin: 6px 0 0;
  color: #7b8794;
  font-size: 13px;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.folder-box {
  min-width: 0;
  padding: 18px;
  border: 1px solid #e4e8ef;
  border-radius: 6px;
}

.folder-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.folder-heading h3,
.section-heading h3 {
  font-size: 15px;
}

.folder-index {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #e9f2ff;
  color: #2878d0;
  font-weight: 600;
}

.folder-index-secondary {
  background: #e9f7f1;
  color: #16835d;
}

.folder-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.folder-name {
  min-width: 0;
  overflow: hidden;
  color: #586474;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-input {
  display: none;
}

.file-count {
  margin-top: 10px;
  color: #748091;
  font-size: 12px;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin: 18px 0 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  min-height: 72px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border-left: 3px solid #d8e4f1;
  background: #f7f9fc;
}

.summary-item span {
  color: #748091;
  font-size: 13px;
}

.summary-item strong {
  color: #263445;
  font-size: 20px;
}

.summary-item .warning-number {
  color: #c27a19;
}

.result-section+.result-section {
  margin-top: 24px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

@media (max-width: 767px) {
  .folder-grid {
    grid-template-columns: 1fr;
  }

  .folder-box {
    padding: 14px;
  }

  .folder-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .folder-actions .el-button {
    align-self: flex-start;
  }

  .action-row {
    justify-content: flex-start;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>