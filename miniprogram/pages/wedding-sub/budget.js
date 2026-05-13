const { budgetTemplates, budgetCategories } = require('../../data/tasks.js');

Page({
  data: {
    budgetList: [],
    totalBudget: 0,
    spentAmount: 0,
    formattedTotal: '0',
    formattedSpent: '0',
    formattedRemaining: '0',
    progressPercent: 0,
    categories: budgetCategories
  },

  onLoad: function () {
    this.loadBudgetData();
  },

  onShow: function () {
    this.loadBudgetData();
  },

  loadBudgetData: function () {
    const saved = wx.getStorageSync('budgetList');
    let budgetList = [];
    if (saved && saved.length > 0) {
      budgetList = saved;
    } else {
      budgetList = budgetTemplates;
      wx.setStorageSync('budgetList', budgetTemplates);
    }
    budgetList = budgetList.map(item => ({
      ...item,
      formattedAmount: this.formatMoney(item.amount || 0)
    }));
    this.setData({ budgetList });
    this.calculateTotals();
  },

  formatMoney: function (amount) {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1) + '万';
    }
    return amount.toLocaleString();
  },

  calculateTotals: function () {
    const budgetList = this.data.budgetList || [];
    const total = budgetList.reduce((sum, item) => sum + (item.amount || 0), 0);
    const spent = budgetList.filter(item => item.isPaid).reduce((sum, item) => sum + (item.amount || 0), 0);
    const remaining = total - spent;
    const progress = total === 0 ? 0 : Math.round((spent / total) * 100);
    
    this.setData({ 
      totalBudget: total, 
      spentAmount: spent,
      formattedTotal: this.formatMoney(total),
      formattedSpent: this.formatMoney(spent),
      formattedRemaining: this.formatMoney(remaining),
      progressPercent: progress
    });
  },

  getCategoryInfo: function (categoryId) {
    return this.data.categories.find(cat => cat.id === categoryId) || { id: 'other', name: '其他', icon: '📝' };
  },

  togglePaidStatus: function (e) {
    const id = e.currentTarget.dataset.id;
    const budgetList = this.data.budgetList.map(item => {
      if (item.id === id) {
        return { ...item, isPaid: !item.isPaid };
      }
      return item;
    });
    this.setData({ budgetList });
    wx.setStorageSync('budgetList', budgetList);
    this.calculateTotals();
  },

  editBudget: function (e) {
    const id = e.currentTarget.dataset.id;
    const index = this.data.budgetList.findIndex(item => item.id === id);
    if (index !== -1) {
      wx.navigateTo({
        url: '/pages/wedding-sub/budget-edit?index=' + index
      });
    }
  },

  deleteBudget: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个预算项吗？',
      success: (res) => {
        if (res.confirm) {
          const budgetList = this.data.budgetList.filter(item => item.id !== id);
          this.setData({ budgetList });
          wx.setStorageSync('budgetList', budgetList);
          this.calculateTotals();
        }
      }
    });
  },

  addBudget: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/budget-edit'
    });
  }
});
