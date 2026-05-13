const { decisionCategories } = require('../data/tasks.js')
const presetData = require('../data/preset-data.js')
const { safeGet, safeSet } = require('../services/storage')

const initData = {
  decisions: () => {
    let data = safeGet('decisions')
    if (!data || typeof data !== 'object' || !Object.keys(data).length) {
      data = {}
      decisionCategories.forEach(cat => {
        data[cat.id] = presetData.decisions[cat.id] || []
      })
      safeSet('decisions', data)
    }
    return data
  },

  budgetList: () => {
    let data = safeGet('budgetList')
    if (!data || !data.length) {
      data = presetData.budgetList.map((item, index) => ({
        ...item,
        id: `budget-${Date.now()}-${index}`
      }))
      safeSet('budgetList', data)
    }
    return data
  },

  guests: () => {
    let data = safeGet('guests')
    if (!data || !data.length || data.length < presetData.guests.length) {
      data = presetData.guests.map((guest, index) => ({
        ...guest,
        id: `guest-${Date.now()}-${index}`
      }))
      safeSet('guests', data)
    }
    return data
  },

  tables: () => {
    let data = safeGet('tables')
    if (!data || !data.length) {
      data = JSON.parse(JSON.stringify(presetData.tables))
      safeSet('tables', data)
    }
    return data
  },

  gifts: () => {
    let data = safeGet('gifts')
    const isValid = data && Array.isArray(data) && data.length > 0 &&
                    data.every(item => item && item.id && item.name && item.amount && item.amount > 0)
    if (!isValid) {
      data = JSON.parse(JSON.stringify(presetData.gifts))
      safeSet('gifts', data)
    }
    return data
  },

  checklist: () => {
    let data = safeGet('checklist')
    if (!data || typeof data !== 'object' || !Object.keys(data).length) {
      data = JSON.parse(JSON.stringify(presetData.checklist))
      safeSet('checklist', data)
    }
    return data
  },

  inspirations: () => {
    let data = safeGet('inspirations')
    if (!data || !Array.isArray(data)) {
      data = []
      safeSet('inspirations', data)
    }
    return data
  },

  initAll: () => {
    initData.decisions()
    initData.budgetList()
    initData.guests()
    initData.tables()
    initData.gifts()
    initData.checklist()
    initData.inspirations()
  }
}

module.exports = initData
