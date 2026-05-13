function safeGet(key) {
  try {
    return wx.getStorageSync(key) || null
  } catch (e) {
    console.error('safeGet error:', key, e)
    return null
  }
}

function safeSet(key, data) {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (e) {
    console.error('safeSet error:', key, e)
    return false
  }
}

function safeRemove(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('safeRemove error:', key, e)
    return false
  }
}

function getList(key) {
  return safeGet(key) || []
}

function getObject(key) {
  return safeGet(key) || {}
}

function generateId(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)
}

module.exports = { safeGet, safeSet, safeRemove, getList, getObject, generateId }
