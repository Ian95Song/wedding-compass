const { getObject, safeSet, generateId } = require('./storage')

const KEY = 'decisions'

function getAll() {
  return getObject(KEY)
}

function getByCategory(category) {
  return getAll()[category] || []
}

function getAllFlat() {
  const obj = getAll()
  return Object.keys(obj).reduce((arr, key) => arr.concat(obj[key]), [])
}

function add(category, item) {
  const all = getAll()
  if (!all[category]) all[category] = []
  const newItem = {
    ...item,
    id: generateId('decision'),
    category,
    isSelected: item.isSelected || false,
    images: item.images || [],
    date: item.date || new Date().toISOString().split('T')[0]
  }
  if (newItem.price) {
    newItem.formattedPrice = Number(newItem.price).toLocaleString()
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
  if (all[category][idx].price) {
    all[category][idx].formattedPrice = Number(all[category][idx].price).toLocaleString()
  }
  safeSet(KEY, all)
  return all[category][idx]
}

function remove(category, id) {
  const all = getAll()
  if (!all[category]) return
  all[category] = all[category].filter(item => item.id !== id)
  safeSet(KEY, all)
}

function toggleSelected(category, id) {
  const all = getAll()
  if (!all[category]) return null
  const idx = all[category].findIndex(item => item.id === id)
  if (idx === -1) return null
  all[category][idx].isSelected = !all[category][idx].isSelected
  safeSet(KEY, all)
  return all[category][idx]
}

function getCount() {
  return getAllFlat().length
}

function getSelectedCount() {
  return getAllFlat().filter(item => item.isSelected).length
}

module.exports = { getAll, getByCategory, getAllFlat, add, update, remove, toggleSelected, getCount, getSelectedCount }
