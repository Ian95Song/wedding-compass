const { getList, safeSet, generateId } = require('./storage')

const KEY = 'guests'

function getAll() {
  return getList(KEY)
}

function getById(id) {
  return getAll().find(item => item.id === id) || null
}

function add(item) {
  const list = getAll()
  const newItem = {
    ...item,
    id: generateId('guest'),
    isConfirmed: item.isConfirmed || false,
    table: item.table || '',
    date: item.date || new Date().toISOString().split('T')[0]
  }
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

function toggleConfirmed(id) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  list[idx].isConfirmed = !list[idx].isConfirmed
  safeSet(KEY, list)
  return list[idx]
}

function getBySide(side) {
  return getAll().filter(item => item.side === side)
}

function getByRelation(relation) {
  return getAll().filter(item => item.relation === relation)
}

function getByTable(table) {
  return getAll().filter(item => item.table === table)
}

function getConfirmedCount() {
  return getAll().filter(item => item.isConfirmed).length
}

function getCount() {
  return getAll().length
}

module.exports = { getAll, getById, add, update, remove, toggleConfirmed, getBySide, getByRelation, getByTable, getConfirmedCount, getCount }
