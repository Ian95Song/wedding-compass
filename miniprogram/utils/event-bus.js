const listeners = {}

function on(event, callback) {
  if (!listeners[event]) listeners[event] = []
  listeners[event].push(callback)
}

function off(event, callback) {
  if (!listeners[event]) return
  if (!callback) {
    listeners[event] = []
  } else {
    listeners[event] = listeners[event].filter(cb => cb !== callback)
  }
}

function emit(event, data) {
  if (!listeners[event]) return
  listeners[event].forEach(cb => {
    try { cb(data) } catch (e) { console.error('EventBus error:', event, e) }
  })
}

module.exports = { on, off, emit }
