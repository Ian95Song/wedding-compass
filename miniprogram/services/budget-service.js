const { getList, safeSet, generateId } = require('./storage')

const KEY = 'budgetList'

function getAll() {
  return getList(KEY)
}

function getById(id) {
  return getAll().find(item => item.id === id) || null
}

function add(item) {
  const list = getAll()
  const newItem = { ...item, id: generateId('budget'), date: item.date || new Date().toISOString().split('T')[0] }
  list.push(newItem)
  safeSet(KEY, list)
  return newItem
}

function update(id, updates) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...updates }
  safeSet(KEY, list)
  return list[idx]
}

function remove(id) {
  const list = getAll().filter(item => item.id !== id)
  safeSet(KEY, list)
}

function togglePaid(id) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  list[idx].isPaid = !list[idx].isPaid
  safeSet(KEY, list)
  return list[idx]
}

function getByCategory(category) {
  return getAll().filter(item => item.category === category)
}

function getTotalAmount() {
  return getAll().reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
}

function getPaidAmount() {
  return getAll().filter(item => item.isPaid).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
}

module.exports = { getAll, getById, add, update, remove, togglePaid, getByCategory, getTotalAmount, getPaidAmount }
