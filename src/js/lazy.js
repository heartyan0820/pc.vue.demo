const observers = new WeakMap()

function stopObserving(el) {
  const state = observers.get(el)
  if (state) {
    state.observer.disconnect()
    observers.delete(el)
  }
}

function observeImage(el, url) {
  stopObserving(el)

  if (!url) {
    el.removeAttribute('src')
    return
  }

  if (typeof IntersectionObserver === 'undefined') {
    el.src = url
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.src = url
        observer.disconnect()
        observers.delete(el)
      }
    },
    {
      rootMargin: '100px 0px',
    }
  )

  observers.set(el, { observer })
  observer.observe(el)
}

export default {
  mounted(el, binding) {
    observeImage(el, binding.value)
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      observeImage(el, binding.value)
    }
  },

  unmounted(el) {
    stopObserving(el)
  },
}
