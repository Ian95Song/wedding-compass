const app = getApp()
const utils = require('../../utils/index.js')

Page({
  data: {
    userInfo: {},
    weddingDate: '',
    weddingDateCN: '',
    showEditModal: false,
    formData: {
      nickname: '',
      weddingDate: ''
    }
  },

  onLoad: function () {
    this.loadUserData()
  },

  onShow: function () {
    this.loadUserData()
  },

  loadUserData: function () {
    const userInfo = app.globalData.userInfo || {}
    const weddingDate = app.globalData.weddingDate
    
    this.setData({
      userInfo: userInfo,
      weddingDate: weddingDate,
      weddingDateCN: weddingDate ? utils.formatDateCN(weddingDate) : '',
      formData: {
        nickname: userInfo.nickname || '',
        weddingDate: weddingDate || ''
      }
    })
  },

  editProfile: function () {
    this.setData({ showEditModal: true })
  },

  closeEditModal: function () {
    this.setData({ showEditModal: false })
  },

  stopPropagation: function () {},

  onNicknameInput: function (e) {
    this.setData({ 'formData.nickname': e.detail.value })
  },

  onWeddingDateChange: function (e) {
    this.setData({ 'formData.weddingDate': e.detail.value })
  },

  saveProfile: function () {
    const { nickname, weddingDate } = this.data.formData
    
    if (nickname) {
      app.globalData.userInfo = { ...app.globalData.userInfo, nickname }
    }
    
    if (weddingDate) {
      app.globalData.weddingDate = weddingDate
      app.setWeddingDate(weddingDate)
    }
    
    this.setData({ showEditModal: false })
    this.loadUserData()
    
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  goToPrivacy: function () {
    wx.navigateTo({
      url: '/pages/profile/privacy'
    })
  },

  showHelp: function () {
    wx.showModal({
      title: '使用指南',
      content: '欢迎使用备婚手账本！\n\n1. 设置婚期后自动生成备婚时间线\n2. 使用决策本对比选择供应商\n3. 通过灵感库收藏婚礼灵感\n4. 管理预算、宾客名单和座位安排',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  showFeedback: function () {
    wx.showModal({
      title: '问题反馈',
      content: '感谢您的反馈！如有问题或建议，请发送邮件至 feedback@weddingnotebook.com',
      showCancel: false,
      confirmText: '知道了'
    })
  }
})