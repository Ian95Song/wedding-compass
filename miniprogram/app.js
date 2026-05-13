App({
  onLaunch: function () {
    let agreed = false
    try {
      agreed = wx.getStorageSync('privacyAgreed')
    } catch (e) {
      console.error('load privacyAgreed error:', e)
    }
    if (agreed) {
      this.globalData.privacyAgreed = true
      this.loadUserData()
      this.loadTasksData()
    } else {
      this.globalData.privacyAgreed = false
    }
  },

  onShow: function () {
    console.log('App Show')
  },

  onHide: function () {
    console.log('App Hide')
  },

  globalData: {
    userInfo: {},
    weddingDate: '',
    tasks: [],
    completedTasks: 0,
    privacyAgreed: false
  },

  showPrivacyModal: function () {
    const that = this
    wx.showModal({
      title: '隐私政策',
      content: '欢迎使用备婚手账本！\n\n为了保护您的隐私，我们需要您同意以下条款：\n\n1. 您的数据仅存储在您的手机本地\n2. 我们不会收集、存储或传输您的个人信息\n3. 您的数据安全由您自己负责\n\n请阅读并同意《用户服务协议》和《隐私政策》',
      showCancel: true,
      cancelText: '不同意',
      confirmText: '我已阅读并同意',
      success: function (res) {
        if (res.confirm) {
          try {
            wx.setStorageSync('privacyAgreed', true)
          } catch (e) {
            console.error('save privacyAgreed error:', e)
          }
          that.globalData.privacyAgreed = true
          that.loadUserData()
          that.loadTasksData()
        } else {
          wx.showModal({
            title: '提示',
            content: '您需要同意隐私政策才能使用小程序',
            showCancel: false,
            success: function () {
              that.showPrivacyModal()
            }
          })
        }
      }
    })
  },

  loadUserData: function () {
    try {
      const weddingDate = wx.getStorageSync('weddingDate')
      const userInfo = wx.getStorageSync('userInfo') || {}
      this.globalData.weddingDate = weddingDate
      this.globalData.userInfo = userInfo
    } catch (e) {
      console.error('loadUserData error:', e)
    }
  },

  loadTasksData: function () {
    let savedTasks
    try {
      savedTasks = wx.getStorageSync('tasks')
    } catch (e) {
      console.error('loadTasksData storage read error:', e)
      savedTasks = null
    }
    const taskTemplates = require('./data/tasks.js').taskTemplates

    if (savedTasks && savedTasks.length > 0) {
      const validatedTasks = savedTasks.map(task => {
        if (!task.phase) {
          const phase = taskTemplates.find(p => !p.isTimeline && p.tasks && p.tasks.find(t => t.id === task.id))
          return {
            ...task,
            phase: phase ? phase.phase : 1,
            phaseName: phase ? phase.phaseName : '',
            daysBeforeWedding: phase ? phase.daysBeforeWedding : 365
          }
        }
        return task
      })
      const deduplicatedTasks = this.deduplicateTasks(validatedTasks)

      const templateIds = new Set()
      taskTemplates.forEach(phase => {
        if (!phase.isTimeline && phase.tasks) {
          phase.tasks.forEach(task => templateIds.add(task.id))
        }
      })

      const hasAllTasks = Array.from(templateIds).every(id =>
        deduplicatedTasks.some(t => t.id === id)
      )

      if (hasAllTasks) {
        this.globalData.tasks = deduplicatedTasks
      } else {
        this.reinitializeTasks()
      }
    } else {
      this.reinitializeTasks()
    }
  },

  reinitializeTasks: function () {
    const taskTemplates = require('./data/tasks.js').taskTemplates
    const allTasks = []
    taskTemplates.forEach(phase => {
      if (!phase.isTimeline && phase.tasks) {
        phase.tasks.forEach(task => {
          allTasks.push({
            ...task,
            phase: phase.phase,
            phaseName: phase.phaseName,
            daysBeforeWedding: phase.daysBeforeWedding
          })
        })
      }
    })
    this.globalData.tasks = allTasks
    try {
      wx.setStorageSync('tasks', allTasks)
    } catch (e) {
      console.error('reinitializeTasks storage write error:', e)
    }
  },

  deduplicateTasks: function (tasks) {
    const seen = new Set()
    return tasks.filter(task => {
      const key = task.id
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  },

  saveTasksData: function (tasks) {
    this.globalData.tasks = tasks
    try {
      wx.setStorageSync('tasks', tasks)
    } catch (e) {
      console.error('saveTasksData error:', e)
    }
  },

  setWeddingDate: function (date) {
    this.globalData.weddingDate = date
    try {
      wx.setStorageSync('weddingDate', date)
    } catch (e) {
      console.error('setWeddingDate error:', e)
    }
  },

  getTasks: function () {
    if (!this.globalData.tasks || this.globalData.tasks.length === 0) {
      this.loadTasksData()
    }
    return this.globalData.tasks
  },

  updateTaskStatus: function (taskId, status) {
    const tasks = this.globalData.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: task.status === status ? 'pending' : status }
      }
      return task
    })
    this.saveTasksData(tasks)
    return tasks
  }
})
