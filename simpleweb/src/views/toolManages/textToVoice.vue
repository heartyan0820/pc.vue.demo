<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

// Web Speech API：浏览器原生语音合成，无需联网、无需后端。
// 微信等手机内置浏览器常无此 API（或仅有 webkit 前缀版本），故做前缀兼容
const synth = window.speechSynthesis || window.webkitSpeechSynthesis
const Utterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance
const supported = !!synth && !!Utterance

const text = ref('')
const speaking = ref(false)
const voices = ref([])
const voiceURI = ref('')
const rate = ref(1)
const pitch = ref(1)
const volume = ref(1)

const selectedVoice = computed(() => voices.value.find((v) => v.voiceURI === voiceURI.value))
const percent = (v) => `${Math.round(v * 100)}%`

// Chrome 的语音列表是异步加载的，需要监听 voiceschanged
function loadVoices() {
  if (!supported) return
  const list = synth.getVoices() || []
  // 优先中文语音，没有则回退到全部语音
  const zhVoices = list.filter((v) => (v.lang || '').toLowerCase().startsWith('zh'))
  voices.value = zhVoices.length ? zhVoices : list
  if (voices.value.length && !voices.value.some((v) => v.voiceURI === voiceURI.value)) {
    voiceURI.value = voices.value[0].voiceURI
  }
}

// 在线朗读兜底：不支持本地合成时用公开 TTS 接口播放。
// 单个源在手机端（尤其微信等内置浏览器）可能被拦截，故多源依次回退
const TTS_SOURCES = [
  (t) => `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(t)}&le=zh`,
  (t) => `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(t)}&spd=3&source=web`,
]

const audio = ref(null)

function splitSentences(content) {
  return content.match(/[^。！？!?；;\n]+[。！？!?；;\n]?/g)?.filter((s) => s.trim()) || [content]
}

function onlineSpeak(content) {
  const list = splitSentences(content)
  let index = 0
  let sourceIndex = 0

  const fail = () => {
    audio.value = null
    speaking.value = false
    ElMessage.error('在线朗读失败：请检查网络，或复制链接后在 Chrome / Safari 中打开')
  }

  const playNext = () => {
    if (index >= list.length) {
      audio.value = null
      speaking.value = false
      return
    }
    if (sourceIndex >= TTS_SOURCES.length) {
      fail()
      return
    }

    const el = new Audio()
    el.preload = 'auto'
    audio.value = el
    // 同一句失败时可能同时触发 onerror 与 play() reject，用 settled 避免重复切换
    let settled = false
    const nextSource = () => {
      if (settled) return
      settled = true
      sourceIndex += 1
      playNext()
    }

    el.onplay = () => (speaking.value = true)
    el.onended = () => {
      index += 1
      sourceIndex = 0
      playNext()
    }
    el.onerror = nextSource
    el.src = TTS_SOURCES[sourceIndex](list[index])
    el.load()
    el.play().catch(nextSource)
  }

  playNext()
}

function play() {
  const content = text.value.trim()
  if (!content) {
    ElMessage.warning('请先输入要朗读的文本')
    return
  }
  if (!supported) {
    onlineSpeak(content)
    return
  }

  synth.cancel()
  loadVoices()
  // Chrome 在 paused 状态下 speak 不会发声，需先 resume
  if (synth.paused) synth.resume()

  const utterance = new Utterance(content)
  const voice = selectedVoice.value
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  } else {
    utterance.lang = 'zh-CN'
  }
  utterance.rate = rate.value
  utterance.pitch = pitch.value
  utterance.volume = volume.value

  utterance.onstart = () => (speaking.value = true)
  utterance.onend = () => (speaking.value = false)
  utterance.onerror = () => {
    speaking.value = false
    ElMessage.error('语音播放失败，请重试')
  }

  synth.speak(utterance)
}

function stop() {
  if (audio.value) {
    const el = audio.value
    // 解绑回调，避免停止后再触发 onended 继续播下一句
    el.onended = null
    el.onerror = null
    el.pause()
    audio.value = null
  }
  speaking.value = false
  if (!supported) return
  synth.cancel()
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
    ElMessage.success('链接已复制')
  } catch {
    ElMessage.warning('复制失败，请手动复制地址栏链接')
  }
}

function toggle() {
  speaking.value ? stop() : play()
}

onMounted(() => {
  loadVoices()
  if (supported) synth.addEventListener?.('voiceschanged', loadVoices)
})

onUnmounted(() => {
  stop()
  if (supported) synth.removeEventListener?.('voiceschanged', loadVoices)
})
</script>

<template>
  <div class="tts">
    <el-alert
      v-if="!supported"
      class="tts__tip"
      type="warning"
      show-icon
      :closable="false"
      title="当前浏览器不支持本地语音合成（常见于微信等内置浏览器），已自动切换为在线朗读；如需音色/语速调节，请在 Chrome / Safari 浏览器中打开"
    >
      <el-button size="small" @click="copyLink">复制页面链接</el-button>
      <span class="tts__hint">粘贴到 Chrome / Safari 打开即可使用本地语音合成</span>
    </el-alert>

    <el-input
      v-model="text"
      class="tts__input"
      type="textarea"
      :rows="8"
      maxlength="500"
      show-word-limit
      resize="vertical"
      placeholder="请输入要朗读的文本"
    />

    <div class="tts__panel">
      <div class="tts__field">
        <span class="tts__label">音色</span>
        <el-select v-model="voiceURI" class="tts__select" placeholder="默认音色" clearable>
          <el-option
            v-for="v in voices"
            :key="v.voiceURI"
            :label="`${v.name}（${v.lang}）`"
            :value="v.voiceURI"
          />
        </el-select>
      </div>

      <div class="tts__field">
        <span class="tts__label">语速</span>
        <el-slider v-model="rate" :min="0.5" :max="2" :step="0.1" />
        <span class="tts__value">{{ percent(rate) }}</span>
      </div>

      <div class="tts__field">
        <span class="tts__label">音调</span>
        <el-slider v-model="pitch" :min="0" :max="2" :step="0.1" />
        <span class="tts__value">{{ percent(pitch) }}</span>
      </div>

      <div class="tts__field">
        <span class="tts__label">音量</span>
        <el-slider v-model="volume" :min="0" :max="1" :step="0.1" />
        <span class="tts__value">{{ percent(volume) }}</span>
      </div>
    </div>

    <div class="tts__actions">
      <el-button :type="speaking ? 'danger' : 'primary'" @click="toggle">
        {{ speaking ? '停止' : '播放' }}
      </el-button>
      <el-button @click="stop">停止</el-button>
      <el-button text @click="text = ''">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tts {
  padding: 16px;

  &__tip {
    margin-bottom: 12px;
  }

  &__hint {
    margin-left: 12px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__input {
    margin-bottom: 16px;
  }

  &__panel {
    display: grid;
    gap: 8px 24px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__label {
    width: 36px;
    flex-shrink: 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
  }

  &__select {
    flex: 1;
  }

  &__value {
    width: 44px;
    flex-shrink: 0;
    font-size: 13px;
    text-align: right;
    color: var(--el-text-color-secondary);
  }

  &__actions {
    margin-top: 20px;
  }
}
</style>
