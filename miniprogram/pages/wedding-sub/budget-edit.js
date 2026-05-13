const { budgetCategories } = require('../../data/tasks.js');

Page({
  data: {
    categories: budgetCategories,
    categoriesIndex: 0,
    selectedCategoryName: '请选择分类',
    formData: {
      category: '',
      description: '',
      amount: '',
      isPaid: false
    },
    isEditing: false,
    editIndex: -1
  },

  onLoad: function (options) {
    if (options.index !== undefined) {
      const index = parseInt(options.index)
      const budgetList = wx.getStorageSync('budgetList') || []
      const item = budgetList[index]
      
      if (item) {
        const categoryIndex = this.getCategoryIndex(item.category)
        const category = this.data.categories[categoryIndex >= 0 ? categoryIndex : 0]
        this.setData({
          formData: {
            category: item.category,
            description: item.description,
            amount: String(item.amount),
            isPaid: item.isPaid
          },
          categoriesIndex: categoryIndex >= 0 ? categoryIndex : 0,
          selectedCategoryName: category.name,
          isEditing: true,
          editIndex: index
        })
        wx.setNavigationBarTitle({ title: '编辑预算' })
      }
    } else {
      wx.setNavigationBarTitle({ title: '添加预算' })
    }
  },

  getCategoryIndex: function (categoryId) {
    const categories = this.data.categories
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === categoryId) {
        return i
      }
    }
    return 0
  },

  onCategoryChange: function (e) {
    const index = e.detail.value
    const category = this.data.categories[index]
    this.setData({
      'formData.category': category.id,
      categoriesIndex: index,
      selectedCategoryName: category.name
    })
  },

  onDescriptionInput: function (e) {
    this.setData({ 'formData.description': e.detail.value })
  },

  onAmountInput: function (e) {
    this.setData({ 'formData.amount': e.detail.value })
  },

  onPaidChange: function (e) {
    this.setData({ 'formData.isPaid': e.detail.value })
  },

  save: function () {
    const { category, description, amount, isPaid } = this.data.formData
    
    if (!category) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return
    }
    
    if (!description.trim()) {
      wx.showToast({ title: '请输入描述', icon: 'none' })
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      wx.showToast({ title: '请输入正确金额', icon: 'none' })
      return
    }
    
    const budgetList = wx.getStorageSync('budgetList') || []
    const item = {
      category,
      description: description.trim(),
      amount: parseFloat(amount),
      isPaid
    }
    
    if (this.data.isEditing) {
      budgetList[this.data.editIndex] = item
    } else {
      budgetList.push(item)
    }
    
    wx.setStorageSync('budgetList', budgetList)
    
    wx.showToast({
      title: this.data.isEditing ? '更新成功' : '添加成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
