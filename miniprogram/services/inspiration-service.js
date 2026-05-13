const { getList, safeSet, generateId } = require('./storage')

const KEY = 'inspirations'

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
    id: generateId('inspo'),
    tags: item.tags || [],
    date: item.date || new Date().toISOString().split('T')[0]
  }
  list.unshift(newItem)
  safeSet(KEY, list)
  return newItem
}

function remove(id) {
  const list = getAll().filter(item => item.id !== id)
  safeSet(KEY, list)
}

function getByTag(tag) {
  return getAll().filter(item => item.tags && item.tags.includes(tag))
}

function getByType(type) {
  return getAll().filter(item => item.type === type)
}

function getCount() {
  return getAll().length
}

module.exports = { getAll, getById, add, remove, getByTag, getByType, getCount }
