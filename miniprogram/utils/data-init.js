const { decisionCategories } = require('../data/tasks.js');
const presetData = require('../data/preset-data.js');

const initData = {
  decisions: () => {
    let data = wx.getStorageSync('decisions');
    if (!data || typeof data !== 'object' || !Object.keys(data).length) {
      data = {};
      decisionCategories.forEach(cat => {
        data[cat.id] = presetData.decisions[cat.id] || [];
      });
      wx.setStorageSync('decisions', data);
    }
    return data;
  },

  budgetList: () => {
    let data = wx.getStorageSync('budgetList');
    if (!data || !data.length) {
      data = presetData.budgetList.map((item, index) => ({
        ...item,
        id: `budget-${Date.now()}-${index}`
      }));
      wx.setStorageSync('budgetList', data);
    }
    return data;
  },

  guests: () => {
    let data = wx.getStorageSync('guests');
    if (!data || !data.length || data.length < presetData.guests.length) {
      data = presetData.guests.map((guest, index) => ({
        ...guest,
        id: `guest-${Date.now()}-${index}`
      }));
      wx.setStorageSync('guests', data);
    }
    return data;
  },

  tables: () => {
    let data = wx.getStorageSync('tables');
    if (!data || !data.length) {
      data = JSON.parse(JSON.stringify(presetData.tables));
      wx.setStorageSync('tables', data);
    }
    return data;
  },

  gifts: () => {
    let data = wx.getStorageSync('gifts');
    const isValid = data && Array.isArray(data) && data.length > 0 && 
                    data.every(item => item && item.id && item.name && item.amount && item.amount > 0);
    if (!isValid) {
      data = JSON.parse(JSON.stringify(presetData.gifts));
      wx.setStorageSync('gifts', data);
    }
    return data;
  },

  checklist: () => {
    try {
      let data = wx.getStorageSync('checklist');
      if (!data || typeof data !== 'object' || !Object.keys(data).length) {
        data = JSON.parse(JSON.stringify(presetData.checklist));
        wx.setStorageSync('checklist', data);
      }
      return data;
    } catch (e) {
      console.error('checklist init error:', e);
      const data = JSON.parse(JSON.stringify(presetData.checklist));
      wx.setStorageSync('checklist', data);
      return data;
    }
  },

  initAll: () => {
    initData.decisions();
    initData.budgetList();
    initData.guests();
    initData.tables();
    initData.gifts();
    initData.checklist();
  }
};

module.exports = initData;