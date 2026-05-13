const { getList, safeSet, safeGet } = require('./storage')

const TASKS_KEY = 'tasks'
const DATE_KEY = 'weddingDate'

function getAll() {
  return getList(TASKS_KEY)
}

function getWeddingDate() {
  return safeGet(DATE_KEY) || ''
}

function setWeddingDate(date) {
  return safeSet(DATE_KEY, date)
}

function updateStatus(id, status) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  list[idx].status = status
  safeSet(TASKS_KEY, list)
  return list[idx]
}

function toggleStatus(id) {
  const list = getAll()
  const idx = list.findIndex(item => item.id === id)
  if (idx === -1) return null
  list[idx].status = list[idx].status === 'completed' ? 'pending' : 'completed'
  safeSet(TASKS_KEY, list)
  return list[idx]
}

function getProgress() {
  const list = getAll()
  if (list.length === 0) return 0
  return Math.round((list.filter(t => t.status === 'completed').length / list.length) * 100)
}

function getTodayTasks() {
  const weddingDate = getWeddingDate()
  if (!weddingDate) return []
  const today = new Date()
  const wedding = new Date(weddingDate)
  const daysLeft = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
  return getAll().filter(task => {
    const taskDays = Number(task.daysBeforeWedding) || 0
    return daysLeft <= taskDays && daysLeft >= taskDays - 7 && task.status !== 'completed'
  })
}

function saveAll(list) {
  safeSet(TASKS_KEY, list)
}

module.exports = { getAll, getWeddingDate, setWeddingDate, updateStatus, toggleStatus, getProgress, getTodayTasks, saveAll }
