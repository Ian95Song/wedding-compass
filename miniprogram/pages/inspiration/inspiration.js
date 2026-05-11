const inspirationTags = require('../../data/tasks.js').inspirationTags
const caseTags = require('../../data/tasks.js').caseTags
const weddingCases = require('../../data/cases.js').weddingCases
const fileManager = require('../../utils/file-manager.js')
const xiaohongshu = require('../../utils/xiaohongshu.js')

const sampleInspirations = [
  { id: '1', type: 'text', content: '婚礼配色方案：香槟金+玫瑰粉+象牙白，高级优雅', tags: ['婚礼布置', '花艺'], date: '2026-05-08' },
  { id: '2', type: 'text', content: '备婚时间线参考：婚前12个月开始筹备，6个月前确定场地和婚庆', tags: ['婚礼流程'], date: '2026-05-07' }
]

Page({
  data: {
    tabs: [
      { id: 'inspiration', name: '灵感箱' },
      { id: 'cases', name: '案例库' }
    ],
    activeTab: 'inspiration',
    inspirations: [],
    filteredInspirations: [],
    searchText: '',
    selectedTag: '',
    tags: inspirationTags,
    caseTags: caseTags,
    allCases: weddingCases,
    filteredCases: weddingCases,
    selectedBudget: '',
    selectedStyle: '',
    showAddModal: false,
    formData: {
      type: 'link',
      content: '',
      tags: [],
      platform: 'other',
      isXiaohongshu: false,
      preview: {
        title: '',
        summary: ''
      }
    },
    selectedTagStr: '',
    types: [
      { id: 'link', name: '链接', icon: '🔗' },
      { id: 'text', name: '文字', icon: '📝' },
      { id: 'image', name: '图片', icon: '📷' }
    ]
  },

  onLoad: function () {
    this.loadInspirations()
  },

  onShow: function () {
    const app = getApp()
    if (app.globalData.inspirationTab) {
      this.setData({ activeTab: app.globalData.inspirationTab })
      app.globalData.inspirationTab = ''
    }
  },

  loadInspirations: function () {
    const saved = wx.getStorageSync('inspirations')
    let inspirations = []
    
    if (saved && saved.length > 0) {
      inspirations = saved
    } else {
      inspirations = sampleInspirations
      wx.setStorageSync('inspirations', inspirations)
    }
    
    this.setData({ inspirations })
    this.filterInspirations()
  },

  filterInspirations: function () {
    let result = this.data.inspirations
    
    if (this.data.searchText) {
      const search = this.data.searchText.toLowerCase()
      result = result.filter(i => 
        i.content.toLowerCase().includes(search) ||
        i.tags.some(t => t.toLowerCase().includes(search)) ||
        (i.preview && i.preview.title && i.preview.title.toLowerCase().includes(search))
      )
    }
    
    if (this.data.selectedTag) {
      result = result.filter(i => i.tags.includes(this.data.selectedTag))
    }
    
    this.setData({ filteredInspirations: result })
  },

  switchTab: function (e) {
    const tabId = e.currentTarget.dataset.id
    this.setData({ activeTab: tabId })
  },

  onSearchInput: function (e) {
    this.setData({ searchText: e.detail.value }, () => {
      this.filterInspirations()
    })
  },

  selectTag: function (e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({ 
      selectedTag: this.data.selectedTag === tag ? '' : tag 
    }, () => {
      this.filterInspirations()
    })
  },

  filterCases: function () {
    let result = this.data.allCases
    
    if (this.data.selectedBudget) {
      result = result.filter(c => c.budget === this.data.selectedBudget)
    }
    
    if (this.data.selectedStyle) {
      result = result.filter(c => c.style === this.data.selectedStyle)
    }
    
    this.setData({ filteredCases: result })
  },

  addInspiration: function () {
    this.setData({
      showAddModal: true,
      formData: {
        type: 'link',
        content: '',
        tags: new Array(),
        platform: 'other',
        isXiaohongshu: false,
        preview: {
          title: '',
          summary: ''
        }
      },
      selectedTagStr: ''
    })
  },

  closeModal: function () {
    this.setData({ 
      showAddModal: false,
      selectedTagStr: ''
    })
  },

  testClick: function () {
    wx.showToast({ title: '测试按钮点击成功', icon: 'success' })
  },
  
  stopPropagation: function () {},

  selectType: function (e) {
    const type = e.currentTarget.dataset.type
    this.setData({ 
      'formData.type': type, 
      'formData.content': '',
      'formData.platform': 'other',
      'formData.isXiaohongshu': false,
      'formData.preview': {
        title: '',
        summary: ''
      }
    })
  },

  onContentInput: function (e) {
    const content = e.detail.value
    this.setData({ 'formData.content': content })
    
    if (this.data.formData.type === 'link' && content.trim()) {
      const extracted = xiaohongshu.extractUrl(content)
      
      if (extracted && extracted.platform === 'xiaohongshu') {
        this.setData({ 
          'formData.isXiaohongshu': true,
          'formData.platform': 'xiaohongshu',
          'formData.content': extracted.url
        })
      } else {
        this.setData({ 
          'formData.isXiaohongshu': false,
          'formData.platform': 'other'
        })
      }
    }
  },

  onPreviewTitleInput: function (e) {
    this.setData({ 'formData.preview.title': e.detail.value })
  },

  onPreviewSummaryInput: function (e) {
    this.setData({ 'formData.preview.summary': e.detail.value })
  },

  toggleTag: function (e) {
    const tag = e.currentTarget.dataset.tag
    let currentTags = this.data.formData.tags
    
    if (!Array.isArray(currentTags)) {
      currentTags = []
    }
    
    if (currentTags.includes(tag)) {
      return
    }
    
    const newTags = [...currentTags, tag]
    
    this.setData({ 
      'formData.tags': newTags,
      selectedTagStr: newTags.join(',') + '|' + Date.now()
    })
  },
  
  removeTag: function (e) {
    const tag = e.currentTarget.dataset.tag
    let currentTags = this.data.formData.tags
    
    if (!Array.isArray(currentTags)) {
      currentTags = []
    }
    
    const newTags = currentTags.filter(t => t !== tag)
    
    this.setData({ 
      'formData.tags': newTags,
      selectedTagStr: newTags.join(',') + '|' + Date.now()
    })
  },

  uploadImage: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({ 'formData.content': res.tempFilePaths[0] })
      }
    })
  },

  saveInspiration: async function () {
    const { type, content, tags, platform, isXiaohongshu, preview } = this.data.formData
    
    if (!content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    if (isXiaohongshu && platform === 'xiaohongshu' && !preview.title) {
      wx.showToast({ title: '请填写笔记标题', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    
    let savedContent = content
    
    if (type === 'image' && content.startsWith('wx://')) {
      const savedPaths = await fileManager.saveImages([content])
      savedContent = savedPaths[0] || content
    }

    const newInspiration = {
      id: 'new-' + Date.now(),
      type,
      content: savedContent,
      tags: tags.length > 0 ? tags : ['其他'],
      date: new Date().toISOString().split('T')[0]
    }

    if (isXiaohongshu && platform === 'xiaohongshu' && preview.title) {
      newInspiration.platform = platform
      newInspiration.preview = {
        title: preview.title,
        summary: preview.summary || '',
        image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(preview.title + ' wedding inspiration')}&image_size=portrait_4_3`
      }
    }

    const updatedList = [newInspiration, ...this.data.inspirations]
    this.setData({
      inspirations: updatedList,
      showAddModal: false
    })
    wx.setStorageSync('inspirations', updatedList)
    this.filterInspirations()

    wx.hideLoading()
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  viewInspiration: function (e) {
    const id = e.currentTarget.dataset.id
    const inspiration = this.data.inspirations.find(i => i.id === id)
    
    if (!inspiration) return

    if (inspiration.platform === 'xiaohongshu') {
      wx.setClipboardData({
        data: inspiration.content,
        success: () => {
          wx.showModal({
            title: '链接已复制',
            content: '请在微信或其他浏览器中打开小红书查看',
            showCancel: false,
            confirmText: '知道了'
          })
        }
      })
      return
    }
    
    if (inspiration.type === 'image') {
      wx.previewImage({
        current: inspiration.content,
        urls: [inspiration.content]
      })
    } else if (inspiration.type === 'link') {
      wx.setClipboardData({
        data: inspiration.content,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' })
        }
      })
    }
  },

  copyLink: function (e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    const inspiration = this.data.inspirations.find(i => i.id === id)
    
    if (inspiration) {
      wx.setClipboardData({
        data: inspiration.content,
        success: () => {
          wx.showToast({ title: '链接已复制', icon: 'success' })
        }
      })
    }
  },

  formatNumber: function(num) {
    return xiaohongshu.formatNumber(num)
  },

  viewCase: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/inspiration/case-detail?id=${id}`
    })
  },

  selectBudget: function (e) {
    const value = e.currentTarget.dataset.value
    this.setData({ 
      selectedBudget: this.data.selectedBudget === value ? '' : value 
    }, () => {
      this.filterCases()
    })
  },

  selectStyle: function (e) {
    const value = e.currentTarget.dataset.value
    this.setData({ 
      selectedStyle: this.data.selectedStyle === value ? '' : value 
    }, () => {
      this.filterCases()
    })
  },

  deleteInspiration: function (e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条灵感吗？',
      success: (res) => {
        if (res.confirm) {
          const updatedList = this.data.inspirations.filter(i => i.id !== id)
          this.setData({ inspirations: updatedList })
          wx.setStorageSync('inspirations', updatedList)
          this.filterInspirations()
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  }
})