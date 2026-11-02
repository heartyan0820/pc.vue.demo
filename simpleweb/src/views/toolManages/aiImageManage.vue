<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  DEFAULT_IMAGE_MODEL,
  DEFAULT_IMAGE_URL,
  IMAGE_SIZES,
  fetchImageConfigs,
  generateImage,
} from '@/utils/aiImage'

// 手填的 Key / 模型存本地：后台没配图片生成配置时也能直接用
const KEY_STORAGE = 'ai_image_api_key'
const MODEL_STORAGE = 'ai_image_model'

const prompt = ref('')
const size = ref('2K')
const watermark = ref(false)
const loading = ref(false)
const images = ref([])
const configs = ref([])
const selectedConfigId = ref(null)
const customKey = ref(localStorage.getItem(KEY_STORAGE) || '')
const customModel = ref(localStorage.getItem(MODEL_STORAGE) || '')
const showSettings = ref(false)
let controller = null

const activeConfig = computed(() => {
  const hit = configs.value.find((item) => item.id === selectedConfigId.value)
  const apiKey = customKey.value.trim() || hit?.apiKey || ''
  // 手填模型优先，其次用后台配置，最后回退即梦 4.0
  const model = customModel.value.trim() || hit?.model || DEFAULT_IMAGE_MODEL
  if (hit) return { ...hit, apiKey, model }
  // 后台没有图片生成配置时回退到方舟默认地址
  return {
    name: '即梦 AI · 图片生成',
    model,
    url: DEFAULT_IMAGE_URL,
    apiKey,
  }
})

const keyReady = computed(() => !!activeConfig.value.apiKey)

async function loadConfigs() {
  try {
    const list = await fetchImageConfigs()
    configs.value = list
    if (list.length) {
      selectedConfigId.value = list[0].id
      // 后台已有 Key 时不必重复填写
      if (!customKey.value.trim() && list[0].apiKey) customKey.value = list[0].apiKey
    }
  } catch (error) {
    // 未登录或后台不可用：静默回退，由用户手填 Key
    console.warn('[aiImage] 读取后台配置失败：', error)
  }
}

function saveSettings() {
  localStorage.setItem(KEY_STORAGE, customKey.value.trim())
  localStorage.setItem(MODEL_STORAGE, customModel.value.trim())
  ElMessage.success('设置已保存到本地')
}

async function generate() {
  const text = prompt.value.trim()
  if (loading.value) return
  if (!text) {
    ElMessage.warning('请先输入提示词')
    return
  }
  if (!keyReady.value) {
    showSettings.value = true
    ElMessage.warning('请先填写方舟 API Key（火山引擎控制台 → API Key 管理）')
    return
  }

  loading.value = true
  controller = new AbortController()
  try {
    const list = await generateImage({
      config: activeConfig.value,
      prompt: text,
      size: size.value,
      watermark: watermark.value,
      signal: controller.signal,
    })
    images.value.unshift(
      ...list.map((item) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: item.url,
        prompt: text,
        size: size.value,
        model: activeConfig.value.model,
        createdAt: new Date().toLocaleString(),
      })),
    )
    ElMessage.success(`生成成功，共 ${list.length} 张`)
  } catch (error) {
    if (error.name === 'AbortError') ElMessage.info('已取消生成')
    else ElMessage.error(error.message || '生成失败')
  } finally {
    loading.value = false
    controller = null
  }
}

function cancel() {
  controller?.abort()
}

async function download(item) {
  try {
    const response = await fetch(item.url)
    if (!response.ok) throw new Error('下载失败')
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `jimeng-${item.id}.png`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch {
    // 图片在 CDN 上，跨域取不到 blob 时退化为新窗口打开，由用户右键保存
    window.open(item.url, '_blank', 'noopener')
  }
}

function removeImage(id) {
  images.value = images.value.filter((item) => item.id !== id)
}

onMounted(loadConfigs)
</script>

<template>
  <div class="img-gen">
    <div class="img-gen__head">
      <h5 class="img-gen__title">AI 图片生成</h5>
      <span class="img-gen__model">{{ activeConfig.model }}</span>
      <el-button text @click="showSettings = !showSettings">
        {{ showSettings ? '收起设置' : '设置' }}
      </el-button>
    </div>

    <div v-show="showSettings" class="img-gen__settings">
      <div class="img-gen__row">
        <span class="img-gen__label">API Key</span>
        <el-input
          v-model="customKey"
          class="img-gen__key"
          type="password"
          show-password
          placeholder="火山方舟 ARK_API_KEY"
          @change="saveSettings"
        />
        <el-button @click="saveSettings">保存</el-button>
      </div>

      <div class="img-gen__row img-gen__row--mt">
        <span class="img-gen__label">模型 ID</span>
        <el-input
          v-model="customModel"
          class="img-gen__key"
          :placeholder="DEFAULT_IMAGE_MODEL"
          @change="saveSettings"
        />
      </div>
      <p class="img-gen__hint">
        接口：{{ activeConfig.url }}　|　模型：{{ activeConfig.model }}
        <template v-if="configs.length">　|　配置来源：后台「{{ activeConfig.name }}」</template>
        <template v-else>　|　后台无图片生成配置，使用默认即梦 4.0 地址</template>
      </p>
    </div>

    <el-input
      v-model="prompt"
      class="img-gen__prompt"
      type="textarea"
      :rows="4"
      maxlength="1000"
      show-word-limit
      resize="vertical"
      placeholder="请输入提示词，例如：星际穿越，黑洞里冲出一辆复古列车，电影质感，深蓝调，光影强烈"
      @keydown.ctrl.enter="generate"
    />

    <div class="img-gen__toolbar">
      <el-select v-model="size" class="img-gen__size">
        <el-option v-for="item in IMAGE_SIZES" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-switch v-model="watermark" active-text="AI 水印" />
      <el-button type="primary" :loading="loading" @click="generate">生成图片</el-button>
      <el-button v-if="loading" @click="cancel">取消</el-button>
    </div>

    <div v-if="images.length" class="img-gen__grid">
      <div v-for="item in images" :key="item.id" class="img-gen__card">
        <img :src="item.url" :alt="item.prompt" class="img-gen__pic" loading="lazy" />
        <div class="img-gen__info">
          <p class="img-gen__text" :title="item.prompt">{{ item.prompt }}</p>
          <div class="img-gen__meta">
            <span>{{ item.size }} · {{ item.createdAt }}</span>
            <div class="img-gen__ops">
              <el-button text size="small" @click="download(item)">下载</el-button>
              <el-button text size="small" @click="removeImage(item.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else-if="!loading" description="还没有生成记录，输入提示词试试" />

    <div v-if="images.length" class="img-gen__tip">
      生成结果在火山方舟侧仅保留 24 小时，请及时下载。
    </div>
  </div>
</template>

<style scoped lang="scss">
.img-gen {
  padding: 16px;

  &__head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
  }

  &__model {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__settings {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 6px;
    background: var(--el-fill-color-light);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__label {
    width: 56px;
    flex-shrink: 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  &__key {
    max-width: 420px;
  }

  &__row--mt {
    margin-top: 10px;
  }

  &__hint {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.6;
    word-break: break-all;
    color: var(--el-text-color-secondary);
  }

  &__prompt {
    margin-bottom: 12px;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  &__size {
    width: 200px;
  }

  &__grid {
    display: grid;
    gap: 16px;
    margin-top: 20px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  &__card {
    overflow: hidden;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    background: var(--el-bg-color);
  }

  &__pic {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    background: var(--el-fill-color-light);
  }

  &__info {
    padding: 8px 10px 4px;
  }

  &__text {
    margin: 0;
    overflow: hidden;
    font-size: 13px;
    line-height: 1.5;
    color: var(--el-text-color-regular);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &__ops {
    display: flex;
    align-items: center;
  }

  &__tip {
    margin-top: 16px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
