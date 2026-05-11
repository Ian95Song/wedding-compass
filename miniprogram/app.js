App({
  onLaunch: function () {
    console.log('=== App onLaunch ===')
    const agreed = wx.getStorageSync('privacyAgreed')
    console.log('privacyAgreed:', agreed)
    if (agreed) {
      console.log('已同意，直接加载数据')
      this.globalData.privacyAgreed = true
      this.loadUserData()
      this.loadTasksData()
    } else {
      console.log('未同意，等待首页显示弹窗')
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
          wx.setStorageSync('privacyAgreed', true)
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
    const weddingDate = wx.getStorageSync('weddingDate')
    const userInfo = wx.getStorageSync('userInfo') || {}

    this.globalData.weddingDate = weddingDate
    this.globalData.userInfo = userInfo
  },

  loadTasksData: function () {
    const savedTasks = wx.getStorageSync('tasks')
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
    wx.setStorageSync('tasks', allTasks)
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
    wx.setStorageSync('tasks', tasks)
  },

  setWeddingDate: function (date) {
    this.globalData.weddingDate = date
    wx.setStorageSync('weddingDate', date)
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
