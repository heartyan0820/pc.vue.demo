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

// 在线朗读兜底：不支持本地合成时，用公开 TTS 接口按顺序播放（长文本按句拆分）
const audio = ref(null)

function splitSentences(content) {
  return content.match(/[^。！？!?；;\n]+[。！？!?；;\n]?/g)?.filter((s) => s.trim()) || [content]
}

function onlineSpeak(content) {
  const list = splitSentences(content)
  let index = 0

  const playNext = () => {
    if (index >= list.length) {
      audio.value = null
      speaking.value = false
      return
    }
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(list[index])}&le=zh`
    const el = new Audio(url)
    audio.value = el
    el.onplay = () => (speaking.value = true)
    el.onended = () => {
      index += 1
      playNext()
    }
    el.onerror = () => {
      audio.value = null
      speaking.value = false
      ElMessage.error('在线朗读失败，请检查网络后重试')
    }
    el.play().catch(() => {
      audio.value = null
      speaking.value = false
      ElMessage.error('在线朗读播放失败，建议在系统浏览器中打开')
    })
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
    audio.value.pause()
    audio.value = null
  }
  if (!supported) return
  synth.cancel()
  speaking.value = false
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
    />

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
