const { getList, safeSet, generateId } = require('./storage')

const KEY = 'tables'

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
    id: generateId('table'),
    guests: item.guests || [],
    maxGuests: item.maxGuests || 10
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

function addGuest(tableId, guest) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === tableId)
  if (idx === -1) return null
  if (!list[idx].guests) list[idx].guests = []
  if (!list[idx].guests.find(g => g.id === guest.id)) {
    list[idx].guests.push({ id: guest.id, name: guest.name })
  }
  safeSet(KEY, list)
  return list[idx]
}

function removeGuest(tableId, guestId) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === tableId)
  if (idx === -1) return null
  list[idx].guests = (list[idx].guests || []).filter(g => g.id !== guestId)
  safeSet(KEY, list)
  return list[idx]
}

function getGuestCount(tableId) {
  const table = getById(tableId)
  return table ? (table.guests || []).length : 0
}

module.exports = { getAll, getById, add, update, remove, addGuest, removeGuest, getGuestCount }
