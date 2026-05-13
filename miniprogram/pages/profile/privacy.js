Page({
  data: {
    activeTab: 'privacy'
  },

  onLoad: function (options) {
    if (options.activeTab) {
      this.setData({ activeTab: options.activeTab })
    }
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  }
})