const app = getApp()
const utils = require('../../utils/index.js')
const { decisionCategories, budgetCategories, inspirationTags } = require('../../data/tasks.js')

Page({
  data: {
    showPrivacyModal: false,
    weddingDate: '',
    weddingDateCN: '',
    daysLeft: 0,
    tasks: [],
    todayTasks: [],
    progress: 0,
    completedTasks: 0,
    totalTasks: 0,
    selectedDate: '',
    minDate: '',
    showDecisionModal: false,
    showGuestModal: false,
    showInspirationModal: false,
    showExpenseModal: false,
    decisionCategories: decisionCategories,
    expenseCategories: budgetCategories,
    inspirationTags: inspirationTags,
    inspirationTypes: [
      { id: 'text', name: '文字', icon: '📝' },
      { id: 'link', name: '链接', icon: '🔗' },
      { id: 'image', name: '图片', icon: '📷' }
    ],
    decisionForm: {
      category: '',
      name: '',
      price: '',
      contact: '',
      notes: ''
    },
    guestForm: {
      name: '',
      phone: '',
      relation: '',
      side: 'bride'
    },
    inspirationForm: {
      type: 'text',
      content: '',
      tags: []
    },
    expenseForm: {
      category: '',
      description: '',
      amount: '',
      isPaid: false,
      note: ''
    },
    groomRelations: ['家人', '亲戚', '朋友', '同事', '同学', '其他'],
    brideRelations: ['家人', '亲戚', '朋友', '同事', '同学', '其他']
  },

  onLoad: function () {
    this.migrateExpensesData()
    this.checkPrivacyAgreement()
  },

  checkPrivacyAgreement: function () {
    try {
      const agreed = wx.getStorageSync('privacyAgreed')
      if (!agreed) {
        this.setData({ showPrivacyModal: true })
      } else {
        this.setMinDate()
        this.loadUserData()
      }
    } catch (e) {
      console.error('checkPrivacyAgreement storage error:', e)
      this.setData({ showPrivacyModal: true })
    }
  },

  migrateExpensesData: function () {
    try {
      const oldExpenses = wx.getStorageSync('expenses')
      if (oldExpenses && Array.isArray(oldExpenses) && oldExpenses.length > 0) {
        const budgetList = wx.getStorageSync('budgetList') || []
        const migrated = oldExpenses.map(item => ({
          ...item,
          id: item.id.replace('expense-', 'budget-')
        }))
        wx.setStorageSync('budgetList', [...budgetList, ...migrated])
        wx.removeStorageSync('expenses')
      }
    } catch (e) {
      console.error('migrateExpensesData error:', e)
    }
  },

  goToPrivacyPolicy: function (e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/profile/privacy?activeTab=' + type
    })
  },

  onRefusePrivacy: function () {
    wx.showModal({
      title: '提示',
      content: '您需要同意隐私政策才能使用备婚手账本。请在充分阅读并理解协议内容后，再做出决定。',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  onAgreePrivacy: function () {
    try {
      wx.setStorageSync('privacyAgreed', true)
    } catch (e) {
      console.error('save privacyAgreed error:', e)
    }
    app.globalData.privacyAgreed = true
    this.setData({ showPrivacyModal: false })
    this.setMinDate()
    app.loadUserData()
    app.loadTasksData()
    this.loadUserData()
    wx.showToast({ title: '已同意协议', icon: 'success' })
  },

  onShow: function () {
    app.loadTasksData()
    this.loadUserData()
  },

  setMinDate: function () {
    const today = new Date()
    const minDate = today.toISOString().split('T')[0]
    this.setData({ minDate: minDate })
  },

  loadUserData: function () {
    const weddingDate = app.globalData.weddingDate
    if (weddingDate) {
      this.setData({
        weddingDate: weddingDate,
        weddingDateCN: utils.formatDateCN(weddingDate),
        daysLeft: utils.getDaysBetween(new Date(), weddingDate),
        selectedDate: weddingDate
      })
      this.loadTasks()
    }
  },

  loadTasks: function () {
    const tasks = app.getTasks()
    const daysLeft = this.data.daysLeft
    
    const completedCount = tasks.filter(t => t.status === 'completed').length
    const currentTasks = utils.getCurrentPhaseTasks(tasks, daysLeft)

    this.setData({
      tasks: tasks,
      todayTasks: currentTasks,
      totalTasks: tasks.length,
      completedTasks: completedCount,
      progress: utils.calculateProgress(tasks)
    })
  },

  openDatePicker: function () {
    this.setMinDate()
  },

  onDateChange: function (e) {
    const date = e.detail.value
    if (date) {
      app.globalData.weddingDate = date
      app.setWeddingDate(date)
      
      this.setData({
        weddingDate: date,
        weddingDateCN: utils.formatDateCN(date),
        daysLeft: utils.getDaysBetween(new Date(), date),
        selectedDate: date
      })
      
      this.loadTasks()
      
      wx.showToast({
        title: '婚期已设置',
        icon: 'success',
        duration: 2000
      })
    }
  },

  toggleTask: function (e) {
    const taskId = e.currentTarget.dataset.id
    
    let todayTasks = this.data.todayTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, checking: true }
      }
      return task
    })
    
    this.setData({ todayTasks })
    
    setTimeout(() => {
      const tasks = app.updateTaskStatus(taskId, 'completed')
      
      todayTasks = todayTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, removing: true }
        }
        return task
      })
      
      this.setData({ tasks, todayTasks })
      
      setTimeout(() => {
        const completedCount = tasks.filter(t => t.status === 'completed').length
        const currentTasks = utils.getCurrentPhaseTasks(tasks, this.data.daysLeft)
        
        this.setData({
          tasks: tasks,
          todayTasks: currentTasks,
          completedTasks: completedCount,
          progress: utils.calculateProgress(tasks)
        })
        
        wx.showToast({
          title: '已完成',
          icon: 'success',
          duration: 1500
        })
      }, 400)
    }, 300)
  },

  handleCheck: function (e) {
    e.stopPropagation()
    this.toggleTask(e)
  },

  goToGuide: function () {
    wx.switchTab({
      url: '/pages/guide/guide'
    })
  },

  stopPropagation: function () {},

  openDecisionModal: function () {
    const today = new Date().toISOString().split('T')[0]
    this.setData({
      showDecisionModal: true,
      decisionForm: { category: '', name: '', price: '', date: today, contact: '', notes: '', images: [] },
      tempDecisionImages: []
    })
  },

  closeDecisionModal: function () {
    this.setData({ showDecisionModal: false, tempDecisionImages: [] })
  },

  selectDecisionCategory: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({ 'decisionForm.category': id })
  },

  onDecisionInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`decisionForm.${field}`]: e.detail.value })
  },

  saveDecision: async function () {
    const { category, name, price, date, contact, notes } = this.data.decisionForm
    
    if (!category) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return
    }
    if (!name.trim()) {
      wx.showToast({ title: '请输入选项名称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    
    let allImages = [...this.data.decisionForm.images]
    
    if (this.data.tempDecisionImages && this.data.tempDecisionImages.length > 0) {
      try {
        const fileManager = require('../../utils/file-manager.js')
        const savedImages = await fileManager.saveImages(this.data.tempDecisionImages)
        allImages = [...allImages, ...savedImages]
      } catch (err) {
        console.error('Save images failed:', err)
      }
    }

    let decisions
    try {
      decisions = wx.getStorageSync('decisions') || {}
    } catch (e) {
      console.error('load decisions error:', e)
      decisions = {}
    }
    if (!decisions[category]) {
      decisions[category] = []
    }
    decisions[category].push({
      id: 'decision-' + Date.now(),
      category,
      name,
      price: Number(price) || 0,
      date: date || new Date().toISOString().split('T')[0],
      contact,
      notes,
      images: allImages,
      isSelected: false,
      formattedPrice: price ? Number(price).toLocaleString() : ''
    })
    try {
      wx.setStorageSync('decisions', decisions)
    } catch (e) {
      console.error('save decisions error:', e)
      wx.hideLoading()
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    wx.hideLoading()
    this.setData({ showDecisionModal: false, tempDecisionImages: [] })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  chooseDecisionImage: async function () {
    const currentCount = (this.data.tempDecisionImages || []).length + this.data.decisionForm.images.length
    const remaining = 3 - currentCount
    
    if (remaining <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' })
      return
    }

    try {
      const fileManager = require('../../utils/file-manager.js')
      const tempPaths = await fileManager.chooseImage(remaining)
      this.setData({
        tempDecisionImages: [...(this.data.tempDecisionImages || []), ...tempPaths]
      })
    } catch (err) {
      console.error('Choose image failed:', err)
    }
  },

  deleteTempDecisionImage: function (e) {
    const index = e.currentTarget.dataset.index
    const tempImages = (this.data.tempDecisionImages || []).filter((_, i) => i !== index)
    this.setData({ tempDecisionImages: tempImages })
  },

  previewDecisionImage: function (e) {
    const src = e.currentTarget.dataset.src
    const urls = [...this.data.decisionForm.images, ...(this.data.tempDecisionImages || [])]
    wx.previewImage({
      current: src,
      urls: urls
    })
  },

  openGuestModal: function () {
    this.setData({
      showGuestModal: true,
      guestForm: { name: '', phone: '', relation: '', note: '' }
    })
  },

  closeGuestModal: function () {
    this.setData({ showGuestModal: false })
  },

  onGuestInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`guestForm.${field}`]: e.detail.value })
  },

  selectGuestRelation: function (e) {
    const relation = e.currentTarget.dataset.relation
    this.setData({ 'guestForm.relation': relation })
  },

  saveGuest: function () {
    const { name, phone, relation, note } = this.data.guestForm
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!relation) {
      wx.showToast({ title: '请选择关系', icon: 'none' })
      return
    }

    const side = relation.startsWith('男方') ? 'groom' : 'bride'
    let guests
    try {
      guests = wx.getStorageSync('guests') || []
    } catch (e) {
      console.error('load guests error:', e)
      guests = []
    }
    const newGuest = {
      id: 'guest-' + Date.now(),
      name,
      phone,
      relation,
      side,
      isConfirmed: false,
      table: 0,
      note: note || '',
      date: new Date().toISOString().split('T')[0]
    }

    guests.push(newGuest)
    try {
      wx.setStorageSync('guests', guests)
    } catch (e) {
      console.error('save guests error:', e)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    this.setData({ showGuestModal: false })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  openInspirationModal: function () {
    this.setData({
      showInspirationModal: true,
      inspirationForm: { type: 'text', content: '', tags: [] }
    })
  },

  closeInspirationModal: function () {
    this.setData({ showInspirationModal: false })
  },

  selectInspirationType: function (e) {
    const type = e.currentTarget.dataset.type
    this.setData({ 
      'inspirationForm.type': type, 
      'inspirationForm.content': '' 
    })
  },

  onInspirationInput: function (e) {
    this.setData({ 'inspirationForm.content': e.detail.value })
  },

  toggleInspirationTag: function (e) {
    const tag = e.currentTarget.dataset.tag
    const tags = this.data.inspirationForm.tags
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag]
    this.setData({ 'inspirationForm.tags': newTags })
  },

  uploadInspirationImage: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({ 'inspirationForm.content': res.tempFilePaths[0] })
      }
    })
  },

  saveInspiration: function () {
    const { type, content, tags } = this.data.inspirationForm
    
    if (!content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    let inspirations
    try {
      inspirations = wx.getStorageSync('inspirations') || []
    } catch (e) {
      console.error('load inspirations error:', e)
      inspirations = []
    }
    const newInspiration = {
      id: 'inspiration-' + Date.now(),
      type,
      content,
      tags: tags.length > 0 ? tags : ['其他'],
      date: new Date().toISOString().split('T')[0]
    }

    inspirations.unshift(newInspiration)
    try {
      wx.setStorageSync('inspirations', inspirations)
    } catch (e) {
      console.error('save inspirations error:', e)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    this.setData({ showInspirationModal: false })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  openExpenseModal: function () {
    this.setData({
      showExpenseModal: true,
      expenseForm: { category: '', description: '', amount: '', isPaid: false, note: '' }
    })
  },

  closeExpenseModal: function () {
    this.setData({ showExpenseModal: false })
  },

  selectExpenseCategory: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({ 'expenseForm.category': id })
  },

  onExpenseInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`expenseForm.${field}`]: e.detail.value })
  },

  onExpensePaidChange: function (e) {
    this.setData({ 'expenseForm.isPaid': e.detail.value })
  },

  saveExpense: function () {
    const { category, description, amount, isPaid, note } = this.data.expenseForm

    if (!category) {
      wx.showToast({ title: '请选择类目', icon: 'none' })
      return
    }
    if (!amount || Number(amount) <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }

    try {
      const budgetList = wx.getStorageSync('budgetList') || []
      const newExpense = {
        id: 'budget-' + Date.now(),
        category,
        description: description || '',
        amount: Number(amount),
        isPaid,
        note: note || '',
        date: new Date().toISOString().split('T')[0]
      }

      budgetList.push(newExpense)
      wx.setStorageSync('budgetList', budgetList)
    } catch (e) {
      console.error('saveExpense storage error:', e)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    this.setData({ showExpenseModal: false })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  goToDecision: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/decision'
    })
  },

  goToInspiration: function () {
    wx.switchTab({
      url: '/pages/inspiration/inspiration'
    })
  },

  goToInspirationBox: function () {
    wx.switchTab({
      url: '/pages/inspiration/inspiration'
    })
  },

  goToCases: function () {
    wx.navigateTo({
      url: '/pages/inspiration/cases'
    })
  },

  goToMyWedding: function () {
    wx.switchTab({
      url: '/pages/wedding/wedding'
    })
  }
})
