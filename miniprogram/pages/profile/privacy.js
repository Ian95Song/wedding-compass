Page({
  data: {
    activeTab: 'privacy'
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  }
})