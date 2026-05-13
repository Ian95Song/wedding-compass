const { decisionCategories } = require('../../data/tasks.js');
const fileManager = require('../../utils/file-manager.js');

Page({
  data: {
    categories: decisionCategories,
    category: '',
    categoryInfo: null,
    formData: {
      name: '',
      price: '',
      date: '',
      contact: '',
      notes: '',
      images: []
    },
    isEditing: false,
    editIndex: -1,
    tempImages: [],
    savedImages: [],
    namePlaceholder: '请输入选项名称',
    pricePlaceholder: '请输入价格',
    datePlaceholder: '如：2024-06-15',
    contactPlaceholder: '请输入联系人',
    notesPlaceholder: '请输入备注信息'
  },

  onLoad: function (options) {
    const category = options.category || 'venue'
    const categoryInfo = decisionCategories.find(cat => cat.id === category) || decisionCategories[0]
    
    const placeholders = categoryInfo.placeholders || {}
    
    this.setData({ 
      category,
      categoryInfo,
      namePlaceholder: placeholders.name || '请输入选项名称',
      pricePlaceholder: placeholders.price || '请输入价格',
      datePlaceholder: placeholders.date || '如：2024-06-15',
      contactPlaceholder: placeholders.contact || '请输入联系人',
      notesPlaceholder: placeholders.notes || '请输入备注信息'
    })
    
    if (options.index !== undefined) {
      const index = parseInt(options.index)
      const decisions = wx.getStorageSync('decisions') || {}
      const categoryDecisions = decisions[category] || []
      const item = categoryDecisions[index]
      
      if (item) {
        this.setData({
          formData: {
            name: item.name,
            price: String(item.price || ''),
            date: item.date || '',
            contact: item.contact || '',
            notes: item.notes || '',
            images: item.images || []
          },
          savedImages: item.images || [],
          isEditing: true,
          editIndex: index
        })
        wx.setNavigationBarTitle({ title: '编辑决策' })
      }
    } else {
      wx.setNavigationBarTitle({ title: '添加决策' })
    }
  },

  onNameInput: function (e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onPriceInput: function (e) {
    this.setData({ 'formData.price': e.detail.value })
  },

  onDateInput: function (e) {
    this.setData({ 'formData.date': e.detail.value })
  },

  onContactInput: function (e) {
    this.setData({ 'formData.contact': e.detail.value })
  },

  onNotesInput: function (e) {
    this.setData({ 'formData.notes': e.detail.value })
  },

  chooseImage: async function () {
    const currentCount = this.data.tempImages.length + this.data.savedImages.length
    const remaining = 3 - currentCount
    
    if (remaining <= 0) {
      wx.showToast({ title: '最多上传3张图片', icon: 'none' })
      return
    }

    try {
      const tempPaths = await fileManager.chooseImage(remaining)
      this.setData({
        tempImages: [...this.data.tempImages, ...tempPaths]
      })
    } catch (err) {
      console.error('Choose image failed:', err)
    }
  },

  deleteTempImage: function (e) {
    const index = e.currentTarget.dataset.index
    const tempImages = this.data.tempImages.filter((_, i) => i !== index)
    this.setData({ tempImages })
  },

  deleteSavedImage: async function (e) {
    const index = e.currentTarget.dataset.index
    const imagePath = this.data.savedImages[index]
    
    try {
      await fileManager.deleteImage(imagePath)
    } catch (err) {
      console.error('Delete image failed:', err)
    }
    
    const savedImages = this.data.savedImages.filter((_, i) => i !== index)
    this.setData({ savedImages })
  },

  previewImage: function (e) {
    const src = e.currentTarget.dataset.src
    const urls = [...this.data.savedImages, ...this.data.tempImages]
    fileManager.previewImage(src, urls)
  },

  save: async function () {
    const { name, price, date, contact, notes } = this.data.formData
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入选项名称', icon: 'none' })
      return
    }
    
    wx.showLoading({ title: '保存中...' })
    
    let allImages = [...this.data.savedImages]
    
    if (this.data.tempImages.length > 0) {
      const savedTempImages = await fileManager.saveImages(this.data.tempImages)
      allImages = [...allImages, ...savedTempImages]
    }
    
    const decisions = wx.getStorageSync('decisions') || {}
    const categoryDecisions = decisions[this.data.category] || []
    
    const item = {
      id: this.data.isEditing ? categoryDecisions[this.data.editIndex].id : 'd_' + Date.now(),
      name: name.trim(),
      price: price ? parseFloat(price) : 0,
      date: date.trim(),
      contact: contact.trim(),
      notes: notes.trim(),
      images: allImages,
      isSelected: false,
      formattedPrice: price ? parseFloat(price).toLocaleString() : ''
    }
    
    if (this.data.isEditing) {
      item.isSelected = categoryDecisions[this.data.editIndex].isSelected
      item.id = categoryDecisions[this.data.editIndex].id
      categoryDecisions[this.data.editIndex] = item
    } else {
      categoryDecisions.push(item)
    }
    
    decisions[this.data.category] = categoryDecisions
    wx.setStorageSync('decisions', decisions)
    
    wx.hideLoading()
    
    wx.showToast({
      title: this.data.isEditing ? '更新成功' : '添加成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
