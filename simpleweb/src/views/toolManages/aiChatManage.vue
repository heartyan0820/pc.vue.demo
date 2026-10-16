<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  ArrowRight,
  ChatDotRound,
  Delete,
  DocumentCopy,
  Hide,
  Loading,
  Promotion,
  Refresh,
  Setting,
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
} from '../../utils/aiChat'

const MESSAGE_STORAGE_KEY = 'ai_chat_messages'
const SETTINGS_STORAGE_KEY = 'ai_chat_settings'

const QUICK_PROMPTS = [
  '帮我写一个 Vue 3 的防抖输入框组件',
  '用一段话解释什么是 SSE 流式响应',
  '帮我把这段 SQL 优化一下',
]

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
const bodyRef = ref()

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

const canSend = computed(
  () => Boolean(draft.value.trim()) && !loading.value && Boolean(effectiveConfig.value),
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

function scrollToBottom() {
  nextTick(() => {
    if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
  })
}

function buildRequestMessages() {
  const list = []
  const system = systemPrompt.value.trim()
  if (system) list.push({ role: 'system', content: system })

  for (const item of messages.value) {
    if (item.role === 'user') {
      list.push({ role: 'user', content: item.content })
      continue
    }
    // 只有生成完毕且有正文的 assistant 消息才作为上下文回传
    if (item.role === 'assistant' && item.content && !item.loading) {
      list.push({ role: 'assistant', content: item.content })
    }
  }
  return list
}

function persistMessages() {
  const plain = messages.value
    .filter((item) => !item.loading)
    .map(({ id, role, content, reasoning, error, usage, createdAt }) => ({
      id,
      role,
      content,
      reasoning,
      // error / usage 一起存，否则失败原因刷新后就没了，只剩空白气泡
      error: error || '',
      usage: usage || null,
      createdAt,
    }))
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(plain))
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
  if (!text || loading.value) return

  if (keyMissing.value) {
    ElMessage.warning('请在设置里填写自定义 API Key')
    return
  }
  if (!effectiveConfig.value) {
    ElMessage.warning('请先在上方选择一个 AI 配置')
    return
  }

  draft.value = ''
  messages.value.push({ id: uid(), role: 'user', content: text, createdAt: Date.now() })

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

async function copyApiKey() {
  if (!activeApiKey.value) return
  try {
    await navigator.clipboard.writeText(activeApiKey.value)
    ElMessage.success('API Key 已复制')
  } catch {
    ElMessage.warning('浏览器拒绝了剪贴板访问，请手动复制')
  }
}

function clearChat() {
  messages.value = []
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

    <div ref="bodyRef" class="chat-body">
      <div v-if="!messages.length" class="chat-empty">
        <el-icon class="empty-icon"><ChatDotRound /></el-icon>
        <h3>开始和 AI 对话</h3>
        <p>在下方输入内容，Enter 发送，Shift + Enter 换行</p>
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

            <pre v-else class="message-content">{{ message.content }}</pre>

            <div v-if="message.usage" class="message-usage">
              输入 {{ message.usage.prompt_tokens }} / 输出 {{ message.usage.completion_tokens }} tokens
            </div>
          </div>

          <el-button
            v-if="message.role === 'assistant' && message.content && !message.loading"
            class="copy-button"
            link
            size="small"
            :icon="DocumentCopy"
            @click="copyContent(message)"
          >
            复制
          </el-button>
        </div>
      </div>
    </div>

    <div class="chat-footer">
      <el-input
        v-model="draft"
        type="textarea"
        :rows="3"
        resize="none"
        :disabled="loading"
        placeholder="输入消息，Enter 发送，Shift + Enter 换行"
        @keydown.enter.exact.prevent="handleEnter"
      />
      <div class="footer-actions">
        <el-button v-if="loading" type="danger" plain @click="stopGenerate">停止生成</el-button>
        <el-button v-else type="primary" :icon="Promotion" :disabled="!canSend" @click="sendMessage">
          发送
        </el-button>
      </div>
    </div>
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

.chat-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 4px;
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

.copy-button {
  align-self: flex-start;
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
