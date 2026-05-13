const initData = require('../../utils/data-init.js');

Page({
  data: {
    gifts: [],
    filteredGifts: [],
    totalAmount: 0,
    formattedTotal: '0',
    showAddModal: false,
    showGuestPicker: false,
    editingGift: null,
    searchText: '',
    availableGuests: [],
    formData: {
      name: '',
      amount: '',
      relation: '',
      note: ''
    },
    relations: ['家人', '亲戚', '朋友', '同事', '同学', '其他']
  },

  onLoad: function () {
    this.loadGiftData()
  },

  onShow: function () {
    this.loadGiftData()
  },

  formatMoney: function (amount) {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1) + '万'
    }
    return amount.toLocaleString()
  },

  loadGiftData: function () {
    const gifts = initData.gifts()
    const guests = wx.getStorageSync('guests') || []
    
    const processedGifts = gifts.map(item => ({
      ...item,
      amount: item.amount || 0,
      formattedAmount: this.formatMoney(item.amount || 0)
    }))
    
    const giftNames = processedGifts.map(g => g.name)
    const availableGuests = guests.filter(g => !giftNames.includes(g.name))
    
    this.setData({ 
      gifts: processedGifts, 
      filteredGifts: processedGifts, 
      availableGuests 
    })
    this.calculateTotal()
  },

  calculateTotal: function () {
    const totalAmount = this.data.gifts.reduce((sum, gift) => sum + (gift.amount || 0), 0)
    this.setData({ 
      totalAmount,
      formattedTotal: this.formatMoney(totalAmount)
    })
  },

  updateFilteredGifts: function () {
    const { gifts, searchText } = this.data
    let filteredGifts = gifts
    if (searchText) {
      const search = searchText.toLowerCase()
      filteredGifts = gifts.filter(g => 
        g.name.toLowerCase().includes(search) ||
        g.relation.includes(search)
      )
    }
    this.setData({ filteredGifts })
  },

  addGift: function () {
    this.setData({
      showAddModal: true,
      editingGift: null,
      formData: { name: '', amount: '', relation: '', note: '' }
    })
  },

  openGuestPicker: function () {
    this.setData({ showGuestPicker: true })
  },

  closeGuestPicker: function () {
    this.setData({ showGuestPicker: false })
  },

  selectGuest: function (e) {
    const { name, relation } = e.currentTarget.dataset
    this.setData({
      'formData.name': name,
      'formData.relation': relation,
      showGuestPicker: false
    })
  },

  editGift: function (e) {
    const id = e.currentTarget.dataset.id
    const gift = this.data.gifts.find(g => g.id === id)
    if (gift) {
      this.setData({
        showAddModal: true,
        editingGift: gift,
        formData: {
          name: gift.name,
          amount: String(gift.amount),
          relation: gift.relation,
          note: gift.note
        }
      })
    }
  },

  closeModal: function () {
    this.setData({ showAddModal: false, editingGift: null })
  },

  stopPropagation: function () {},

  onInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  selectRelation: function (e) {
    const relation = e.currentTarget.dataset.value
    this.setData({ 'formData.relation': relation })
  },

  saveGift: function () {
    const { name, amount, relation, note } = this.data.formData
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

    const giftAmount = Number(amount)
    const gift = {
      id: this.data.editingGift ? this.data.editingGift.id : 'new-' + Date.now(),
      name,
      amount: giftAmount,
      formattedAmount: this.formatMoney(giftAmount),
      relation,
      note,
      date: this.data.editingGift ? this.data.editingGift.date : new Date().toISOString().split('T')[0]
    }

    let newList
    if (this.data.editingGift) {
      newList = this.data.gifts.map(g => g.id === gift.id ? gift : g)
    } else {
      newList = [...this.data.gifts, gift]
    }

    this.setData({ gifts: newList, filteredGifts: newList, showAddModal: false, editingGift: null })
    wx.setStorageSync('gifts', newList)
    this.calculateTotal()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  deleteGift: function (e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.gifts.filter(g => g.id !== id)
          this.setData({ gifts: newList })
          this.calculateTotal()
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  onSearchInput: function (e) {
    this.setData({ searchText: e.detail.value })
    this.updateFilteredGifts()
  }
})
