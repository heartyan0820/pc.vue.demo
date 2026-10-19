<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  ArrowRight,
  Bottom,
  ChatDotRound,
  CircleClose,
  Delete,
  Document,
  DocumentCopy,
  Hide,
  Loading,
  Paperclip,
  Picture,
  Promotion,
  Refresh,
  Setting,
  Top,
  User,
  View,
} from '@element-plus/icons-vue'
import {
  configHost,
  fetchAiConfigs,
  fetchBalance,
  streamChat,
  supportsBalance,
  supportsThinking,
  supportsVision,
} from '../../utils/aiChat'

const MESSAGE_STORAGE_KEY = 'ai_chat_messages'
const SETTINGS_STORAGE_KEY = 'ai_chat_settings'

const QUICK_PROMPTS = [
  '帮我写一个 Vue 3 的防抖输入框组件',
  '用一段话解释什么是 SSE 流式响应',
  '帮我把这段 SQL 优化一下',
]

const MAX_ATTACHMENTS = 5
const MAX_FILE_BYTES = 2 * 1024 * 1024
// localStorage 一般只有 5MB，图片 base64 很容易撑爆，超过这个体积就不留原图
const PERSIST_IMAGE_CHARS = 250 * 1024
const PERSIST_TEXT_CHARS = 50000
// 纯文本文件才能直接读出正文发过去；PDF/Word/Excel 需要专门的解析库，前端做不了
const TEXT_FILE_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'json', 'csv', 'log', 'xml', 'yml', 'yaml', 'ini', 'conf',
  'sql', 'js', 'ts', 'jsx', 'tsx', 'vue', 'css', 'scss', 'less', 'html', 'py', 'java',
  'go', 'rb', 'php', 'c', 'cpp', 'h', 'sh', 'env', 'properties', 'gitignore',
])

const configs = ref([])
const selectedConfigId = ref(null)
const loadingConfigs = ref(false)
const configError = ref('')

const balance = ref(null)
const balanceError = ref('')
const loadingBalance = ref(false)

const messages = ref([])
const draft = ref('')
const thinking = ref(true)
const temperature = ref(1)
const systemPrompt = ref('你是一个乐于助人的中文助手，回答简洁清晰。')
const loading = ref(false)
const showSettings = ref(false)
const keyVisible = ref(false)
const useCustomKey = ref(false)
const customApiKey = ref('')
const customKeyVisible = ref(false)
const forceVision = ref(false)
const bodyRef = ref()
const fileInputRef = ref()

const attachments = ref([])
const previewVisible = ref(false)
const previewFile = ref(null)
const atTop = ref(true)
const atBottom = ref(true)

const activeConfig = computed(
  () => configs.value.find((item) => item.id === selectedConfigId.value) || null,
)
// 开了覆盖但还没填 Key，就当作"没有可用配置"，避免静默落回后台配置的 Key
const keyMissing = computed(() => useCustomKey.value && !customApiKey.value.trim())

// 实际生效的配置：地址 / 模型 / 温度仍来自后台配置，只把 Key 换成手填的
const effectiveConfig = computed(() => {
  const config = activeConfig.value
  if (!config) return null
  if (!useCustomKey.value) return config
  const apiKey = customApiKey.value.trim()
  return apiKey ? { ...config, apiKey } : null
})

const activeApiKey = computed(() => effectiveConfig.value?.apiKey || '')
// 默认只露头尾：设置面板经常被投屏/截图，密钥不该一览无余
const maskedApiKey = computed(() => {
  const apiKey = activeApiKey.value
  if (!apiKey || keyVisible.value) return apiKey
  if (apiKey.length <= 12) return '*'.repeat(apiKey.length)
  return `${apiKey.slice(0, 6)}${'*'.repeat(Math.min(apiKey.length - 10, 20))}${apiKey.slice(-4)}`
})
const balanceText = computed(() => {
  const infos = balance.value?.infos || []
  if (!infos.length) return ''
  const symbols = { CNY: '¥', USD: '$' }
  return infos
    .map((info) =>
      symbols[info.currency] ? `${symbols[info.currency]}${info.total}` : `${info.total} ${info.currency}`.trim(),
    )
    .join(' / ')
})

const balanceDetail = computed(() => {
  const info = balance.value?.infos?.[0]
  if (!info) return ''
  return `充值 ${info.toppedUp} / 赠金 ${info.granted}`
})

const balanceHint = computed(() => {
  if (keyMissing.value) return '填写自定义 Key 后才能查询余额'
  if (!supportsBalance(effectiveConfig.value)) return '该厂商未提供余额查询接口，请到对应控制台查看'
  return '来自 DeepSeek /user/balance'
})

const keySourceHint = computed(() => {
  if (keyMissing.value) return '等待填写自定义 Key'
  if (useCustomKey.value) return `手动填写，配合「${activeConfig.value?.name || '-'}」的地址与模型`
  return `来自后台配置「${activeConfig.value?.name || '-'}」`
})

// 模型名推断不出来时，允许在设置里手动强制开启（自家的视觉模型名可能不在规则里）
const visionReady = computed(() => forceVision.value || supportsVision(effectiveConfig.value))
const hasImageAttachment = computed(() => attachments.value.some((item) => item.kind === 'image'))

const canSend = computed(
  () =>
    (Boolean(draft.value.trim()) || attachments.value.length > 0) &&
    !loading.value &&
    Boolean(effectiveConfig.value) &&
    (!hasImageAttachment.value || visionReady.value),
)

let controller = null

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function onBodyScroll() {
  const el = bodyRef.value
  if (!el) return
  // 留 24px 容差：滚到最后几个像素时浮点误差会让判定一直为 false
  atTop.value = el.scrollTop <= 24
  atBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight <= 24
}

function scrollToTop() {
  nextTick(() => {
    if (bodyRef.value) bodyRef.value.scrollTop = 0
  })
}

function scrollToBottom() {
  nextTick(() => {
    const el = bodyRef.value
    if (!el) return
    el.scrollTop = el.scrollHeight
    onBodyScroll()
  })
}

function buildRequestMessages() {
  const list = []
  const system = systemPrompt.value.trim()
  if (system) list.push({ role: 'system', content: system })

  for (const item of messages.value) {
    if (item.role === 'user') {
      list.push({ role: 'user', content: buildUserContent(item.content || '', item.attachments || []) })
      continue
    }
    // 只有生成完毕且有正文的 assistant 消息才作为上下文回传
    if (item.role === 'assistant' && item.content && !item.loading) {
      list.push({ role: 'assistant', content: item.content })
    }
  }
  return list
}

/**
 * 把"正文 + 附件"拼成接口要的 content：
 * - 文本附件直接内联进正文，纯文本模型也能吃
 * - 图片走 OpenAI 的 image_url（data URL），只有视觉模型认
 */
function buildUserContent(text, attachmentList) {
  const images = attachmentList.filter((item) => item.kind === 'image')
  const files = attachmentList.filter((item) => item.kind === 'text')

  let content = text
  for (const file of files) {
    content += `\n\n附件 ${file.name} 的内容：\n\`\`\`\n${file.text}\n\`\`\``
  }
  // 图片数据在落盘时被瘦身掉了，只能给模型一句说明
  for (const image of images.filter((item) => !item.dataUrl)) {
    content += `\n\n（此前附上了图片 ${image.name}，原图未在本机保留）`
  }

  const usableImages = images.filter((item) => item.dataUrl)
  if (!usableImages.length) return content

  const parts = []
  if (content.trim()) parts.push({ type: 'text', text: content.trim() })
  for (const image of usableImages) {
    parts.push({ type: 'image_url', image_url: { url: image.dataUrl } })
  }
  return parts
}

/** 落盘前瘦身：大图不留原图，长文本截断，避免撑爆 localStorage */
function slimAttachment(attachment) {
  if (attachment.kind === 'image') {
    if (!attachment.dataUrl || attachment.dataUrl.length > PERSIST_IMAGE_CHARS) {
      return { id: attachment.id, kind: 'image', name: attachment.name, size: attachment.size }
    }
    return attachment
  }
  const text = attachment.text || ''
  if (text.length <= PERSIST_TEXT_CHARS) return attachment
  return { ...attachment, text: `${text.slice(0, PERSIST_TEXT_CHARS)}\n...（内容过长，已截断）` }
}

function persistMessages() {
  const plain = messages.value
    .filter((item) => !item.loading)
    .map(({ id, role, content, reasoning, error, usage, createdAt, attachments }) => ({
      id,
      role,
      content,
      reasoning,
      // error / usage 一起存，否则失败原因刷新后就没了，只剩空白气泡
      error: error || '',
      usage: usage || null,
      createdAt,
      attachments: (attachments || []).map(slimAttachment),
    }))

  try {
    localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(plain))
    return
  } catch {
    // 配额超限（图片最常见）：丢掉所有图片数据再存一次，至少保住文字记录
  }

  try {
    localStorage.setItem(
      MESSAGE_STORAGE_KEY,
      JSON.stringify(
        plain.map((item) => ({
          ...item,
          attachments: (item.attachments || []).map((file) =>
            file.kind === 'image'
              ? { id: file.id, kind: 'image', name: file.name, size: file.size }
              : file,
          ),
        })),
      ),
    )
  } catch {
    console.warn('[aiChat] 会话过大，本地历史未保存')
  }
}

function persistSettings() {
  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      configId: selectedConfigId.value,
      thinking: thinking.value,
      temperature: temperature.value,
      systemPrompt: systemPrompt.value,
      useCustomKey: useCustomKey.value,
      customApiKey: customApiKey.value,
      forceVision: forceVision.value,
    }),
  )
}

function restoreSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}')
    if (typeof saved.thinking === 'boolean') thinking.value = saved.thinking
    if (Number.isFinite(saved.temperature)) temperature.value = saved.temperature
    if (saved.systemPrompt) systemPrompt.value = saved.systemPrompt
    if (typeof saved.useCustomKey === 'boolean') useCustomKey.value = saved.useCustomKey
    if (saved.customApiKey) customApiKey.value = saved.customApiKey
    if (typeof saved.forceVision === 'boolean') forceVision.value = saved.forceVision
    return saved.configId ?? null
  } catch {
    return null
  }
}

async function loadConfigs(preferredId) {
  loadingConfigs.value = true
  configError.value = ''
  try {
    const list = await fetchAiConfigs()
    configs.value = list

    if (!list.length) {
      // 后台返回的记录里，value 是引用串（如 "AI.DeepSeek.Chat"）的那些会被过滤掉
      configError.value = '后台没有可用的 AI 配置：需要 value 是 JSON 且含 Model / Url / ApiKey 的记录'
      selectedConfigId.value = null
      return
    }

    const wanted = preferredId ?? selectedConfigId.value
    selectedConfigId.value = list.some((item) => item.id === wanted) ? wanted : list[0].id
    onConfigChange()
  } catch (error) {
    configError.value = 'AI 配置加载失败，请检查登录状态或网络后重试'
    console.error('[aiChat] 加载配置失败：', error)
  } finally {
    loadingConfigs.value = false
  }
}

async function loadBalance() {
  const config = effectiveConfig.value
  balance.value = null
  balanceError.value = ''

  // 非 DeepSeek 厂商没有可用接口，别发请求，提示由模板里的 hint 承担
  if (!config || !supportsBalance(config)) return

  loadingBalance.value = true
  try {
    balance.value = await fetchBalance(config)
  } catch (error) {
    balanceError.value = error.message || '余额查询失败'
  } finally {
    loadingBalance.value = false
  }
}

function resetBalance() {
  balance.value = null
  balanceError.value = ''
  // 只在面板展开时才查询，避免每次进页面都打一次接口
  if (showSettings.value) loadBalance()
}

function onCustomKeyChange() {
  persistSettings()
  resetBalance()
}

function onConfigChange() {
  const config = activeConfig.value
  if (config && config.temperature !== null) temperature.value = config.temperature
  keyVisible.value = false
  resetBalance()
  persistSettings()
}

async function sendMessage() {
  const text = draft.value.trim()
  if (loading.value) return
  // 只带附件、没打字也算一条有效消息（例如"帮我总结这个文件"）
  if (!text && !attachments.value.length) return

  if (keyMissing.value) {
    ElMessage.warning('请在设置里填写自定义 API Key')
    return
  }
  if (!effectiveConfig.value) {
    ElMessage.warning('请先在上方选择一个 AI 配置')
    return
  }
  if (hasImageAttachment.value && !visionReady.value) {
    ElMessage.warning(`「${effectiveConfig.value.model}」不支持图片输入，请切换视觉模型或在设置里强制开启`)
    return
  }

  const pending = attachments.value
  draft.value = ''
  attachments.value = []
  messages.value.push({
    id: uid(),
    role: 'user',
    content: text,
    attachments: pending,
    createdAt: Date.now(),
  })

  const requestMessages = buildRequestMessages()
  // 必须用 reactive 包一层：直接改普通对象的话 Vue 追踪不到变化，
  // 流式增量（以及 loading / error 状态）都不会触发重新渲染
  const reply = reactive({
    id: uid(),
    role: 'assistant',
    content: '',
    reasoning: '',
    reasonOpen: false,
    loading: true,
    error: '',
    usage: null,
    createdAt: Date.now(),
    configName: effectiveConfig.value.name,
  })
  messages.value.push(reply)
  // 先把提问落盘：这样生成中途刷新，问题也不会丢
  persistMessages()
  scrollToBottom()

  loading.value = true
  controller = new AbortController()

  try {
    await streamChat({
      config: effectiveConfig.value,
      messages: requestMessages,
      temperature: temperature.value,
      thinking: thinking.value,
      signal: controller.signal,
      onReasoning: (chunk) => {
        reply.reasoning += chunk
        scrollToBottom()
      },
      onContent: (chunk) => {
        reply.content += chunk
        scrollToBottom()
      },
      onUsage: (usage) => {
        reply.usage = usage
      },
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      if (!reply.content) reply.content = '（已停止生成）'
    } else {
      reply.error = error.message || '请求失败'
      ElMessage.error(reply.error)
    }
  } finally {
    // 既没正文、也没思维链、还没报错，说明上游什么增量都没给，别留个空白气泡
    if (!reply.content && !reply.reasoning && !reply.error) {
      reply.error = '没有收到任何回复内容，请检查该配置的 Key、余额和模型名'
    }
    reply.loading = false
    loading.value = false
    controller = null
    persistMessages()
    scrollToBottom()
  }
}

function stopGenerate() {
  controller?.abort()
}

function handleEnter(event) {
  // 中文输入法回车确认候选词时不要发送
  if (event.isComposing || event.keyCode === 229) return
  sendMessage()
}

function useQuickPrompt(text) {
  draft.value = text
}

function toggleReasoning(message) {
  message.reasonOpen = !message.reasonOpen
}

async function copyContent(message) {
  try {
    await navigator.clipboard.writeText(message.content)
    ElMessage.success('已复制')
  } catch {
    ElMessage.warning('浏览器拒绝了剪贴板访问，请手动复制')
  }
}

const previewTruncated = computed(
  () => Boolean(previewFile.value?.text?.includes('内容过长，已截断')),
)

function openPreview(file) {
  if (!file) return
  previewFile.value = file
  previewVisible.value = true
}

async function copyPreviewText() {
  const text = previewFile.value?.text
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('内容已复制')
  } catch {
    ElMessage.warning('浏览器拒绝了剪贴板访问，请手动复制')
  }
}

async function copyApiKey() {
  if (!activeApiKey.value) return
  try {
    await navigator.clipboard.writeText(activeApiKey.value)
    ElMessage.success('API Key 已复制')
  } catch {
    ElMessage.warning('浏览器拒绝了剪贴板访问，请手动复制')
  }
}

function deleteMessage(id) {
  const index = messages.value.findIndex((item) => item.id === id)
  if (index === -1) return
  messages.value.splice(index, 1)
  persistMessages()
}

function pickFiles() {
  fileInputRef.value?.click()
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileExtension(name) {
  const index = name.lastIndexOf('.')
  return index === -1 ? '' : name.slice(index + 1).toLowerCase()
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

async function addFiles(files) {
  for (const file of files) {
    if (attachments.value.length >= MAX_ATTACHMENTS) {
      ElMessage.warning(`最多只能带 ${MAX_ATTACHMENTS} 个附件`)
      break
    }
    if (file.size > MAX_FILE_BYTES) {
      ElMessage.warning(`${file.name} 超过 ${formatSize(MAX_FILE_BYTES)}，已跳过`)
      continue
    }

    if (file.type.startsWith('image/')) {
      try {
        const dataUrl = await readAsDataUrl(file)
        attachments.value.push({ id: uid(), kind: 'image', name: file.name, size: file.size, dataUrl })
      } catch {
        ElMessage.error(`${file.name} 读取失败`)
      }
      continue
    }

    if (TEXT_FILE_EXTENSIONS.has(fileExtension(file.name))) {
      const text = new TextDecoder('utf-8').decode(await file.arrayBuffer())
      attachments.value.push({ id: uid(), kind: 'text', name: file.name, size: file.size, text })
      continue
    }

    ElMessage.warning(`${file.name} 暂不支持：PDF / Word / Excel 请转成文本或截图后再传`)
  }
}

async function onFilesPicked(event) {
  const input = event.target
  const files = Array.from(input.files || [])
  // 必须清空 value，否则连续选同一个文件不会再触发 change
  input.value = ''
  await addFiles(files)
}

/** 截图粘进来时浏览器给的名字通常是 image.png，换成能分辨的名字 */
function pastedImageName(file) {
  if (file.name && file.name !== 'image.png') return file.name
  const stamp = new Date().toLocaleTimeString('zh-CN', { hour12: false }).replace(/:/g, '')
  return `粘贴图片-${stamp}.png`
}

async function onPaste(event) {
  const clipboard = event.clipboardData
  if (!clipboard) return

  // 现代浏览器直接给 files；Safari 之类可能只有 items，两条路都试一下
  let images = Array.from(clipboard.files || []).filter((file) => file.type.startsWith('image/'))
  if (!images.length) {
    images = Array.from(clipboard.items || [])
      .filter((item) => item.kind === 'file' && String(item.type).startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter(Boolean)
  }
  if (!images.length) return

  // 剪贴板里往往同时有文字（比如从微信复制的截图），有图就别把文字也塞进输入框
  event.preventDefault()
  await addFiles(images.map((file) => new File([file], pastedImageName(file), { type: file.type })))
}

function removeAttachment(id) {
  attachments.value = attachments.value.filter((item) => item.id !== id)
}

function clearChat() {
  messages.value = []
  attachments.value = []
  localStorage.removeItem(MESSAGE_STORAGE_KEY)
  ElMessage.success('会话已清空')
}

function restoreMessages() {
  try {
    const saved = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || '[]')
    messages.value = saved.map((item) => {
      const content = item.content || ''
      const reasoning = item.reasoning || ''
      let error = item.error || ''
      // 老版本存下来的空记录（当时失败信息没被保存）——给个说明，别留纯白气泡
      if (item.role === 'assistant' && !content && !reasoning && !error) {
        error = '这条回复没有内容：可能是旧版本记录，或当时请求失败'
      }
      return {
        id: item.id || uid(),
        role: item.role,
        content,
        reasoning,
        error,
        usage: item.usage || null,
        attachments: item.attachments || [],
        reasonOpen: false,
        loading: false,
        createdAt: item.createdAt || Date.now(),
      }
    })
  } catch {
    messages.value = []
  }
}

watch(showSettings, (open) => {
  if (open) loadBalance()
})

onMounted(() => {
  restoreMessages()
  loadConfigs(restoreSettings())
  scrollToBottom()
})
</script>

<template>
  <div class="ai-chat">
    <div class="chat-toolbar">
      <el-select
        v-model="selectedConfigId"
        class="config-select"
        placeholder="选择 AI 配置"
        :loading="loadingConfigs"
        @change="onConfigChange"
      >
        <el-option v-for="config in configs" :key="config.id" :label="config.name" :value="config.id">
          <span>{{ config.name }}</span>
          <span class="option-meta">{{ config.model }} · {{ configHost(config) }}</span>
        </el-option>
      </el-select>

      <el-tooltip
        :disabled="!activeConfig || supportsThinking(activeConfig)"
        content="深度思考是 DeepSeek 独有的参数，其他厂商不支持"
        placement="top"
      >
        <el-switch
          v-model="thinking"
          active-text="深度思考"
          :disabled="!supportsThinking(activeConfig)"
          @change="persistSettings"
        />
      </el-tooltip>

      <el-button link :icon="Refresh" :loading="loadingConfigs" @click="loadConfigs()">
        刷新配置
      </el-button>

      <el-button link :icon="Setting" @click="showSettings = !showSettings">设置</el-button>

      <el-button link type="danger" :icon="Delete" :disabled="!messages.length" @click="clearChat">
        清空会话
      </el-button>

      <span v-if="activeConfig" class="toolbar-tip">
        {{ activeConfig.model }} @ {{ configHost(activeConfig) }}
      </span>
    </div>

    <el-alert
      v-if="configError"
      class="config-alert"
      type="error"
      show-icon
      :closable="false"
      :title="configError"
    >
      <template #default>
        <el-button size="small" :loading="loadingConfigs" @click="loadConfigs()">重试</el-button>
      </template>
    </el-alert>

    <div v-show="showSettings" class="chat-settings">
      <div class="settings-row">
        <span class="settings-label">API Key</span>
        <el-input
          class="apikey-input"
          :model-value="maskedApiKey"
          readonly
          placeholder="未选择 AI 配置"
        >
          <template #append>
            <el-button
              :icon="keyVisible ? Hide : View"
              :disabled="!activeApiKey"
              title="显示 / 隐藏完整密钥"
              @click="keyVisible = !keyVisible"
            />
            <el-button
              :icon="DocumentCopy"
              :disabled="!activeApiKey"
              title="复制完整密钥"
              @click="copyApiKey"
            />
          </template>
        </el-input>
        <span class="settings-hint">{{ keySourceHint }}</span>
      </div>

      <div class="settings-row">
        <span class="settings-label">自定义 Key</span>
        <el-switch v-model="useCustomKey" active-text="启用覆盖" @change="onCustomKeyChange" />
        <el-input
          v-model="customApiKey"
          class="custom-key-input"
          :type="customKeyVisible ? 'text' : 'password'"
          :disabled="!useCustomKey"
          placeholder="填写后覆盖上方配置自带的 Key"
          clearable
          @change="onCustomKeyChange"
        >
          <template #append>
            <el-button
              :icon="customKeyVisible ? Hide : View"
              :disabled="!useCustomKey"
              title="显示 / 隐藏"
              @click="customKeyVisible = !customKeyVisible"
            />
          </template>
        </el-input>
        <span class="settings-hint">
          {{ useCustomKey ? '仅保存在本机浏览器，换设备需重新填' : '不启用时使用后台配置的 Key' }}
        </span>
      </div>

      <div class="settings-row">
        <span class="settings-label">账户余额</span>
        <div class="balance-value">
          <template v-if="loadingBalance">查询中...</template>
          <template v-else-if="balanceError">
            <span class="balance-error">{{ balanceError }}</span>
          </template>
          <template v-else-if="balanceText">
            <span class="balance-total">{{ balanceText }}</span>
            <span v-if="balanceDetail" class="balance-detail">{{ balanceDetail }}</span>
            <el-tag v-if="balance && !balance.isAvailable" type="danger" size="small">余额不可用</el-tag>
          </template>
          <template v-else>--</template>
        </div>
        <el-button
          link
          :icon="Refresh"
          :loading="loadingBalance"
          :disabled="!effectiveConfig || !supportsBalance(effectiveConfig)"
          @click="loadBalance"
        >
          刷新
        </el-button>
        <span class="settings-hint">{{ balanceHint }}</span>
      </div>

      <div class="settings-row">
        <span class="settings-label">图片输入</span>
        <el-switch v-model="forceVision" active-text="强制开启" @change="persistSettings" />
        <span class="settings-hint">
          {{
            visionReady
              ? '已按视觉模型处理，可发送图片'
              : '当前模型名不匹配视觉模型，图片会被接口拒绝；确认它支持图片时可强制开启'
          }}
        </span>
      </div>

      <div class="settings-row">
        <span class="settings-label">系统提示词</span>
        <el-input
          v-model="systemPrompt"
          type="textarea"
          :rows="2"
          resize="none"
          placeholder="给模型设定角色与回答风格"
          @change="persistSettings"
        />
      </div>

      <div class="settings-row">
        <span class="settings-label">温度 {{ temperature }}</span>
        <el-slider
          v-model="temperature"
          :min="0"
          :max="2"
          :step="0.1"
          class="temperature-slider"
          @change="persistSettings"
        />
        <span class="settings-hint">切换配置时会自动套用该配置自带的 Temperature</span>
      </div>
    </div>

    <div class="chat-body-wrapper">
      <div ref="bodyRef" class="chat-body" @scroll="onBodyScroll">
        <div v-if="!messages.length" class="chat-empty">
          <el-icon class="empty-icon"><ChatDotRound /></el-icon>
          <h3>开始和 AI 对话</h3>
          <p>在下方输入内容，Enter 发送，Shift + Enter 换行；可直接粘贴图片，或点「附件」选文件</p>
          <div class="quick-prompts">
            <el-button
              v-for="prompt in QUICK_PROMPTS"
              :key="prompt"
              size="small"
              round
              plain
              @click="useQuickPrompt(prompt)"
            >
              {{ prompt }}
            </el-button>
          </div>
        </div>

        <div v-for="message in messages" :key="message.id" class="message-row" :class="message.role">
          <div class="message-avatar">
            <el-icon><User v-if="message.role === 'user'" /><ChatDotRound v-else /></el-icon>
          </div>

          <div class="message-main">
            <div class="message-meta">
              <span>{{ message.role === 'user' ? '我' : message.configName || 'AI' }}</span>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>

            <div class="message-bubble" :class="{ 'is-error': message.error }">
              <div v-if="message.attachments?.length" class="message-attachments">
                <div
                  v-for="file in message.attachments"
                  :key="file.id"
                  class="attachment-chip is-clickable"
                  :title="`点击预览 ${file.name}`"
                  @click="openPreview(file)"
                >
                  <img
                    v-if="file.kind === 'image' && file.dataUrl"
                    :src="file.dataUrl"
                    :alt="file.name"
                    class="attachment-thumb"
                  />
                  <el-icon v-else>
                    <Picture v-if="file.kind === 'image'" />
                    <Document v-else />
                  </el-icon>
                  <span class="attachment-name">{{ file.name }}</span>
                  <span class="attachment-size">{{ formatSize(file.size) }}</span>
                </div>
              </div>

              <div v-if="message.reasoning" class="reasoning">
                <button type="button" class="reasoning-toggle" @click="toggleReasoning(message)">
                  <el-icon>
                    <ArrowDown v-if="message.reasonOpen" />
                    <ArrowRight v-else />
                  </el-icon>
                  <span>思考过程</span>
                </button>
                <pre v-show="message.reasonOpen" class="reasoning-content">{{ message.reasoning }}</pre>
              </div>

              <div v-if="message.error" class="message-error">{{ message.error }}</div>

              <div v-else-if="!message.content && message.loading" class="message-typing">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>正在思考...</span>
              </div>

              <pre v-else-if="message.content" class="message-content">{{ message.content }}</pre>

              <div v-if="message.usage" class="message-usage">
                输入 {{ message.usage.prompt_tokens }} / 输出 {{ message.usage.completion_tokens }} tokens
              </div>
            </div>

            <div class="message-actions">
              <el-button
                v-if="message.role === 'assistant' && message.content && !message.loading"
                link
                size="small"
                :icon="DocumentCopy"
                @click="copyContent(message)"
              >
                复制
              </el-button>
              <el-button
                v-if="!message.loading"
                link
                size="small"
                type="danger"
                :icon="Delete"
                @click="deleteMessage(message.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-buttons">
        <el-button
          v-show="!atTop"
          class="scroll-button"
          circle
          size="small"
          :icon="Top"
          title="回到顶部"
          @click="scrollToTop"
        />
        <el-button
          v-show="!atBottom"
          class="scroll-button"
          circle
          size="small"
          :icon="Bottom"
          title="回到底部"
          @click="scrollToBottom"
        />
      </div>
    </div>

    <div class="chat-footer">
      <div v-if="attachments.length" class="pending-attachments">
        <div
          v-for="file in attachments"
          :key="file.id"
          class="attachment-chip is-clickable"
          :title="`点击预览 ${file.name}`"
          @click="openPreview(file)"
        >
          <img
            v-if="file.kind === 'image'"
            :src="file.dataUrl"
            :alt="file.name"
            class="attachment-thumb"
          />
          <el-icon v-else><Document /></el-icon>
          <span class="attachment-name">{{ file.name }}</span>
          <span class="attachment-size">{{ formatSize(file.size) }}</span>
          <el-button
            link
            size="small"
            :icon="CircleClose"
            title="移除"
            @click.stop="removeAttachment(file.id)"
          />
        </div>
      </div>

      <div v-if="hasImageAttachment && !visionReady" class="vision-warning">
        当前模型「{{ effectiveConfig?.model }}」不是视觉模型，发图片会被接口拒绝。请换成视觉模型，
        或在设置里「强制开启」图片输入。
      </div>

      <el-input
        v-model="draft"
        type="textarea"
        :rows="3"
        resize="none"
        :disabled="loading"
        placeholder="输入消息，Enter 发送，Shift + Enter 换行；可直接 Ctrl+V 粘贴图片"
        @paste="onPaste"
        @keydown.enter.exact.prevent="handleEnter"
      />
      <div class="footer-actions">
        <el-button
          :icon="Paperclip"
          :disabled="loading"
          title="选择文件（截图可直接 Ctrl+V 粘贴）"
          @click="pickFiles"
        >
          附件
        </el-button>
        <el-button v-if="loading" type="danger" plain @click="stopGenerate">停止生成</el-button>
        <el-button v-else type="primary" :icon="Promotion" :disabled="!canSend" @click="sendMessage">
          发送
        </el-button>
      </div>

      <input ref="fileInputRef" type="file" multiple class="hidden-file-input" @change="onFilesPicked" />
    </div>

    <el-dialog
      v-model="previewVisible"
      :title="previewFile ? previewFile.name : '附件预览'"
      width="720px"
      append-to-body
      destroy-on-close
    >
      <div v-if="previewFile" class="file-preview">
        <div class="file-preview-meta">
          <span>{{ previewFile.kind === 'image' ? '图片' : '文本' }}</span>
          <span>{{ formatSize(previewFile.size) }}</span>
          <span v-if="previewTruncated" class="file-preview-note">内容过长，保存会话时已截断</span>
        </div>

        <div v-if="previewFile.kind === 'image'" class="file-preview-image">
          <img v-if="previewFile.dataUrl" :src="previewFile.dataUrl" :alt="previewFile.name" />
          <div v-else class="file-preview-empty">
            图片内容未保留（超过会话保存上限），只保留了文件名
          </div>
        </div>

        <template v-else>
          <pre class="file-preview-text">{{ previewFile.text || '（没有文本内容）' }}</pre>
          <el-button
            size="small"
            :icon="DocumentCopy"
            :disabled="!previewFile.text"
            @click="copyPreviewText"
          >
            复制内容
          </el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.ai-chat {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
}

.chat-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.config-select {
  width: 300px;
}

.option-meta {
  float: right;
  margin-left: 16px;
  color: #909399;
  font-size: 12px;
}

.toolbar-tip {
  margin-left: auto;
  color: #909399;
  font-size: 12px;
}

.config-alert {
  flex: 0 0 auto;
}

.chat-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafcff;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-label {
  width: 84px;
  flex: 0 0 auto;
  color: #606266;
  font-size: 13px;
}

.apikey-input {
  max-width: 420px;
}

.custom-key-input {
  max-width: 420px;
}

.balance-value {
  display: flex;
  min-width: 220px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #606266;
}

.balance-total {
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.balance-detail {
  color: #909399;
  font-size: 12px;
}

.balance-error {
  color: #f56c6c;
  font-size: 12px;
}

.temperature-slider {
  width: 220px;
}

.settings-hint {
  color: #909399;
  font-size: 12px;
}

.chat-body-wrapper {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.chat-body {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 8px 4px;
}

.scroll-buttons {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.scroll-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
}

.chat-empty {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8490a0;
}

.empty-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.chat-empty h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.chat-empty p {
  margin: 0;
  font-size: 13px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.message-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  display: flex;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #3784f7;
  color: #fff;
  font-size: 18px;
}

.message-row.user .message-avatar {
  background: #67c23a;
}

.message-main {
  display: flex;
  max-width: min(760px, 78%);
  flex-direction: column;
  gap: 4px;
}

.message-row.user .message-main {
  align-items: flex-end;
}

.message-meta {
  display: flex;
  gap: 8px;
  color: #909399;
  font-size: 12px;
}

.message-bubble {
  padding: 10px 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.message-row.user .message-bubble {
  border-color: #b3e08d;
  background: #f0f9eb;
}

.message-bubble.is-error {
  border-color: #fbc4c4;
  background: #fef0f0;
}

.message-content {
  margin: 0;
  color: #303133;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
}

.message-typing {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #909399;
  font-size: 13px;
}

.is-loading {
  animation: rotating 1.2s linear infinite;
}

.message-error {
  color: #f56c6c;
  font-size: 13px;
}

.reasoning {
  margin-bottom: 8px;
  padding: 6px 8px;
  border-left: 3px solid #d9ecff;
  border-radius: 4px;
  background: #f5f9ff;
}

.reasoning-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #409eff;
  font-size: 12px;
  cursor: pointer;
}

.reasoning-content {
  margin: 6px 0 0;
  max-height: 260px;
  overflow-y: auto;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-usage {
  margin-top: 6px;
  color: #a0a8b3;
  font-size: 12px;
}

.message-actions {
  display: flex;
  align-self: flex-start;
  gap: 4px;
}

.message-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.attachment-chip {
  display: flex;
  max-width: 280px;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background: #fafcff;
  color: #606266;
  font-size: 12px;
}

.attachment-chip.is-clickable {
  cursor: pointer;
  transition: all 0.15s;
}

.attachment-chip.is-clickable:hover {
  border-color: #79bbff;
  background: #ecf5ff;
  color: #409eff;
}

.attachment-thumb {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
}

.attachment-name {
  overflow: hidden;
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  color: #a0a8b3;
}

.pending-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-preview-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  color: #909399;
  font-size: 12px;
}

.file-preview-note {
  color: #e6a23c;
}

.file-preview-image {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 6px;
  background: #fafafa;
}

.file-preview-image img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 4px;
  object-fit: contain;
}

.file-preview-empty {
  padding: 24px 0;
  color: #909399;
  font-size: 12px;
}

.file-preview-text {
  max-height: 60vh;
  margin: 0 0 10px;
  padding: 12px;
  overflow: auto;
  border-radius: 6px;
  background: #fafafa;
  color: #303133;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.vision-warning {
  padding: 6px 10px;
  border: 1px solid #fbc4c4;
  border-radius: 6px;
  background: #fef0f0;
  color: #e26b6b;
  font-size: 12px;
  line-height: 1.6;
}

.hidden-file-input {
  display: none;
}

.chat-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .toolbar-tip {
    display: none;
  }

  .message-main {
    max-width: 82%;
  }

  .settings-row {
    flex-wrap: wrap;
  }
}
</style>
