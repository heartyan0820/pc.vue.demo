import { ref, onBeforeUnmount } from 'vue'

export function useTimer(initial = 0) {
  const count = ref(initial)
  const isRunning = ref(false)
  let timer = null

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true
    timer = setInterval(() => {
      count.value++
    }, 1000)
  }

  const pause = () => {
    isRunning.value = false
    clearInterval(timer)
    timer = null
  }

  const reset = (value = initial) => {
    count.value = 0
    pause()
  }

  // 组件卸载自动清理，不用每个页面都写
  onBeforeUnmount(() => clearInterval(timer))

  return { count, isRunning, start, pause, reset }
}
