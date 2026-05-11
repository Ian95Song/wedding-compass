const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateCN = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getPhaseByDays = (daysLeft) => {
  if (daysLeft > 365) return { phase: 1, name: '婚前12个月+', color: '#D4A574' }
  if (daysLeft > 270) return { phase: 2, name: '婚前9-12个月', color: '#E8B4B8' }
  if (daysLeft > 180) return { phase: 3, name: '婚前6-9个月', color: '#B5C4B1' }
  if (daysLeft > 90) return { phase: 4, name: '婚前3-6个月', color: '#C9B896' }
  if (daysLeft > 30) return { phase: 5, name: '婚前1-3个月', color: '#D4A574' }
  if (daysLeft > 7) return { phase: 6, name: '婚前1个月', color: '#FAAD14' }
  if (daysLeft > 0) return { phase: 7, name: '婚前1周', color: '#FF4D4F' }
  return { phase: 8, name: '婚礼当天', color: '#52C41A' }
}

const calculateProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}

const getTodayTasks = (tasks, weddingDate) => {
  if (!tasks || !weddingDate) return []
  const today = new Date()
  const daysLeft = getDaysBetween(today, weddingDate)
  
  return tasks.filter(task => {
    const taskDaysLeft = task.daysBeforeWedding
    return taskDaysLeft >= daysLeft - 3 && taskDaysLeft <= daysLeft + 3 && task.status !== 'completed' && task.status !== 'skipped'
  }).slice(0, 5)
}

const getCurrentPhaseTasks = (tasks, daysLeft) => {
  if (!tasks) return []
  const currentPhase = getPhaseByDays(daysLeft)
  
  return tasks.filter(task => {
    return task.phase <= currentPhase.phase && task.status !== 'completed' && task.status !== 'skipped'
  })
}

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

module.exports = {
  formatDate,
  formatDateCN,
  getDaysBetween,
  getPhaseByDays,
  calculateProgress,
  getTodayTasks,
  getCurrentPhaseTasks,
  debounce
}
