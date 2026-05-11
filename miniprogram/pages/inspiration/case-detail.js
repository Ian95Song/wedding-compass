const weddingCases = require('../../data/cases.js').weddingCases

Page({
  data: {
    caseDetail: null
  },

  onLoad: function (options) {
    const id = options && options.id
    if (id) {
      this.loadCaseDetail(id)
    }
  },

  loadCaseDetail: function (id) {
    const caseDetail = weddingCases.find(c => c.id === id)
    if (caseDetail) {
      this.setData({ caseDetail })
    } else {
      this.setData({ caseDetail: weddingCases[0] })
    }
  },

  formatMoney: function (amount) {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1) + '万'
    }
    return amount.toLocaleString()
  },

  goBack: function () {
    wx.navigateBack()
  }
})