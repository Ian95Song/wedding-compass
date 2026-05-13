const { getObject, safeSet, generateId } = require('./storage')

const KEY = 'checklist'

function getAll() {
  return getObject(KEY)
}

function getByCategory(category) {
  return getAll()[category] || []
}

function add(category, item) {
  const all = getAll()
  if (!all[category]) all[category] = []
  const newItem = {
    ...item,
    id: generateId('check'),
    isChecked: item.isChecked || false
  }
  all[category].push(newItem)
  safeSet(KEY, all)
  return newItem
}

function update(category, id, updates) {
  const all = getAll()
  if (!all[category]) return null
  const idx = all[category].findIndex(item => item.id === id)
  if (idx === -1) return null
  all[category][idx] = { ...all[category][idx], ...updates }
  safeSet(KEY, all)
  return all[category][idx]
}

function remove(category, id) {
  const all = getAll()
  if (!all[category]) return
  all[category] = all[category].filter(item => item.id !== id)
  safeSet(KEY, all)
}

function toggleChecked(category, id) {
  const all = getAll()
  if (!all[category]) return null
  const idx = all[category].findIndex(item => item.id === id)
  if (idx === -1) return null
  all[category][idx].isChecked = !all[category][idx].isChecked
  safeSet(KEY, all)
  return all[category][idx]
}

function getAllFlat() {
  const obj = getAll()
  return Object.keys(obj).reduce((arr, key) => arr.concat(obj[key].map(item => ({ ...item, category: key }))), [])
}

function getProgress() {
  const all = getAllFlat()
  if (all.length === 0) return 0
  return Math.round((all.filter(item => item.isChecked).length / all.length) * 100)
}

module.exports = { getAll, getByCategory, add, update, remove, toggleChecked, getAllFlat, getProgress }
