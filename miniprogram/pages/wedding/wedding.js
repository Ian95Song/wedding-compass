const initData = require('../../utils/data-init.js');
const { decisionCategories, budgetCategories } = require('../../data/tasks.js');

Page({
  data: {
    decisionCount: 0,
    totalBudget: 0,
    formattedBudget: '0',
    guestCount: 0,
    tableCount: 0,
    totalGifts: 0,
    formattedGifts: '0',
    checkedItems: 0,
    totalItems: 0,
    
    showGiftModal: false,
    showDecisionModal: false,
    showGuestModal: false,
    showBudgetModal: false,
    
    decisionCategories: decisionCategories,
    budgetCategories: budgetCategories,
    
    giftForm: { name: '', amount: '', relation: '', note: '' },
    decisionForm: { category: '', name: '', price: '', date: '', contact: '', notes: '', images: [] },
    tempDecisionImages: [],
    guestForm: { name: '', phone: '', relation: '', note: '' },
    budgetForm: { category: '', amount: '', isPaid: false, note: '' },
    
    groomRelations: ['家人', '亲戚', '朋友', '同事', '同学', '其他'],
    brideRelations: ['家人', '亲戚', '朋友', '同事', '同学', '其他'],
    giftRelations: ['家人', '亲戚', '朋友', '同事', '同学', '其他']
  },

  onLoad: function (options) {
    this.loadData()
  },

  onShow: function () {
    this.loadData()
  },

  formatMoney: function (amount) {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1) + '万'
    }
    return amount.toLocaleString()
  },

  loadData: function () {
    const decisions = initData.decisions();
    const budgetList = initData.budgetList();
    const guests = initData.guests();
    const tables = initData.tables();
    const gifts = initData.gifts();
    const checklist = initData.checklist();

    let decisionCount = 0
    if (decisions && typeof decisions === 'object') {
      Object.values(decisions).forEach(arr => {
        decisionCount += Array.isArray(arr) ? arr.length : 0
      })
    }

    const totalBudget = budgetList.reduce((sum, item) => sum + (item.amount || 0), 0)
    const guestCount = guests.length
    const tableCount = tables.length
    const totalGifts = gifts.reduce((sum, g) => sum + (g.amount || 0), 0)

    let checkedItems = 0
    let totalItems = 0
    if (checklist && typeof checklist === 'object') {
      Object.values(checklist).forEach(items => {
        if (Array.isArray(items)) {
          totalItems += items.length
          checkedItems += items.filter(item => item.isChecked).length
        }
      })
    }

    this.setData({
      decisionCount,
      totalBudget,
      formattedBudget: this.formatMoney(totalBudget),
      guestCount,
      tableCount,
      totalGifts,
      formattedGifts: this.formatMoney(totalGifts),
      checkedItems,
      totalItems
    })
  },

  goToDecision: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/decision'
    })
  },

  goToBudget: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/budget'
    })
  },

  goToGuests: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/guests'
    })
  },

  goToSeating: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/seating'
    })
  },

  goToGifts: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/gifts'
    })
  },

  goToChecklist: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/checklist'
    })
  },

  openGiftModal: function () {
    this.setData({ showGiftModal: true, giftForm: { name: '', amount: '', relation: '', note: '' } })
  },

  closeGiftModal: function () {
    this.setData({ showGiftModal: false })
  },

  onGiftInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`giftForm.${field}`]: e.detail.value })
  },

  selectGiftRelation: function (e) {
    const relation = e.currentTarget.dataset.value
    this.setData({ 'giftForm.relation': relation })
  },

  saveGift: function () {
    const { name, amount, relation, note } = this.data.giftForm
    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!amount || Number(amount) <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }
    if (!relation) {
      wx.showToast({ title: '请选择关系', icon: 'none' })
      return
    }

    let gifts
    try {
      gifts = wx.getStorageSync('gifts') || []
    } catch (e) {
      console.error('load gifts error:', e)
      gifts = []
    }
    const newGift = {
      id: 'gift-' + Date.now(),
      name,
      amount: Number(amount),
      relation,
      note,
      date: new Date().toISOString().split('T')[0]
    }
    gifts.push(newGift)
    try {
      wx.setStorageSync('gifts', gifts)
    } catch (e) {
      console.error('save gifts error:', e)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    this.setData({ showGiftModal: false })
    this.loadData()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  openDecisionModal: function () {
    const today = new Date().toISOString().split('T')[0]
    this.setData({ 
      showDecisionModal: true, 
      decisionForm: { category: '', name: '', price: '', date: today, contact: '', notes: '', images: [] },
      tempDecisionImages: []
    })
  },

  closeDecisionModal: function () {
    this.setData({ showDecisionModal: false })
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
    
    if (this.data.tempDecisionImages.length > 0) {
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
    this.loadData()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  chooseDecisionImage: async function () {
    const currentCount = this.data.tempDecisionImages.length + this.data.decisionForm.images.length
    const remaining = 3 - currentCount
    
    if (remaining <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' })
      return
    }

    try {
      const fileManager = require('../../utils/file-manager.js')
      const tempPaths = await fileManager.chooseImage(remaining)
      this.setData({
        tempDecisionImages: [...this.data.tempDecisionImages, ...tempPaths]
      })
    } catch (err) {
      console.error('Choose image failed:', err)
    }
  },

  deleteTempDecisionImage: function (e) {
    const index = e.currentTarget.dataset.index
    const tempImages = this.data.tempDecisionImages.filter((_, i) => i !== index)
    this.setData({ tempDecisionImages: tempImages })
  },

  previewDecisionImage: function (e) {
    const src = e.currentTarget.dataset.src
    const urls = [...this.data.decisionForm.images, ...this.data.tempDecisionImages]
    wx.previewImage({
      current: src,
      urls: urls
    })
  },

  openGuestModal: function () {
    this.setData({ showGuestModal: true, guestForm: { name: '', phone: '', relation: '', note: '' } })
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
    this.loadData()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  openBudgetModal: function () {
    this.setData({ showBudgetModal: true, budgetForm: { category: '', description: '', amount: '', isPaid: false, note: '' } })
  },

  closeBudgetModal: function () {
    this.setData({ showBudgetModal: false })
  },

  selectBudgetCategory: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({ 'budgetForm.category': id })
  },

  onBudgetInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`budgetForm.${field}`]: e.detail.value })
  },

  onBudgetPaidChange: function (e) {
    this.setData({ 'budgetForm.isPaid': e.detail.value })
  },

  selectBudgetPaid: function (e) {
    const isPaid = e.currentTarget.dataset.paid === 'true'
    this.setData({ 'budgetForm.isPaid': isPaid })
  },

  saveBudget: function () {
    const { category, description, amount, isPaid, note } = this.data.budgetForm
    if (!category) {
      wx.showToast({ title: '请选择类目', icon: 'none' })
      return
    }
    if (!amount || Number(amount) <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }

    let budgetList
    try {
      budgetList = wx.getStorageSync('budgetList') || []
    } catch (e) {
      console.error('load budgetList error:', e)
      budgetList = []
    }
    const newBudget = {
      id: 'budget-' + Date.now(),
      category,
      description: description || '',
      amount: Number(amount),
      isPaid,
      note: note || '',
      date: new Date().toISOString().split('T')[0]
    }
    budgetList.push(newBudget)
    try {
      wx.setStorageSync('budgetList', budgetList)
    } catch (e) {
      console.error('save budgetList error:', e)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
      return
    }

    this.setData({ showBudgetModal: false })
    this.loadData()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  stopPropagation: function () {}
})