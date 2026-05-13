const { decisionCategories } = require('../../data/tasks.js');

const sampleDecisions = {
  venue: [
    { id: 'v1', name: '希尔顿酒店·水晶厅', price: 58000, date: '2026-08-15', contact: '张经理 138xxxx', notes: '五星酒店，水晶厅可放30桌，含基础布置', images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400'], isSelected: false },
    { id: 'v2', name: '香格里拉大酒店', price: 68000, date: '2026-08-20', contact: '李经理 139xxxx', notes: '国际品牌，园林景观，适合户外仪式', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'], isSelected: false },
    { id: 'v3', name: '草坪庄园·花语堂', price: 42000, date: '2026-08-22', contact: '王经理 137xxxx', notes: '法式庄园，草坪仪式，室内宴会厅', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400'], isSelected: false }
  ],
  clothing: [
    { id: 'c1', name: '维纳斯婚纱·主纱A', price: 8999, date: '2026-06-15', contact: '李店长 138xxxx', notes: '拖尾2米，缎面材质，赠头纱', images: ['https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400'], isSelected: false },
    { id: 'c2', name: '唯你婚纱·主纱B', price: 12800, date: '2026-06-18', contact: '王店长 139xxxx', notes: '齐地款，轻纱设计，适合小清新风格', images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400'], isSelected: false },
    { id: 'c3', name: '嫁依坊·敬酒服', price: 2800, date: '2026-06-20', contact: '赵店长 137xxxx', notes: '红色旗袍款，尺码M', images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400'], isSelected: false }
  ],
  photography: [
    { id: 'p1', name: '定格时光工作室', price: 15800, date: '2026-07-01', contact: '陈老师 138xxxx', notes: '双机位，含婚纱照+婚礼当天跟拍', images: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400'], isSelected: false },
    { id: 'p2', name: '壹HOME摄影', price: 12800, date: '2026-07-05', contact: '林老师 139xxxx', notes: '单机位，纪实风格，底片全送', images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400'], isSelected: false }
  ],
  makeup: [
    { id: 'm1', name: '苏恩彩妆·新娘妆', price: 3800, date: '2026-07-10', contact: '苏老师 138xxxx', notes: '含早妆+仪式妆+敬酒妆，共3套造型', images: ['https://images.unsplash.com/photo-1485415009078-f88df8ce5cd4?w=400'], isSelected: false },
    { id: 'm2', name: '艾琳造型', price: 4500, date: '2026-07-12', contact: '艾琳 139xxxx', notes: '总监级别，含妈妈妆+伴娘妆', images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'], isSelected: false }
  ],
  catering: [
    { id: 'ct1', name: '希尔顿·婚宴套餐A', price: 3888, date: '2026-08-01', contact: '餐饮部 138xxxx', notes: '每桌3888元，含酒水，已选20桌', images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=400'], isSelected: false },
    { id: 'ct2', name: '香格里拉·婚宴套餐B', price: 4588, date: '2026-08-05', contact: '餐饮部 139xxxx', notes: '每桌4588元，升级菜品，指定主厨', images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'], isSelected: false }
  ],
  'wedding-planner': [
    { id: 'wp1', name: '幸福策划·全包套餐', price: 28000, date: '2026-06-01', contact: '刘策划 138xxxx', notes: '四大金刚+布置+花艺，全流程服务', images: ['https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400'], isSelected: false },
    { id: 'wp2', name: 'Dream Wedding', price: 38000, date: '2026-06-05', contact: 'Alice 139xxxx', notes: '高端定制，1对1服务，含executive planning', images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=400'], isSelected: false }
  ],
  games: [
    { id: 'g1', name: '婚礼管家·暖场游戏套餐', price: 1500, date: '2026-07-20', contact: '小管家 138xxxx', notes: '含10款游戏道具+主持人引导', images: ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'], isSelected: false },
    { id: 'g2', name: '创意婚礼·互动环节方案', price: 2000, date: '2026-07-22', contact: '创意团队 139xxxx', notes: '微信墙+抽奖系统+弹幕互动', images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400'], isSelected: false }
  ],
  'wedding-items': [
    { id: 'wi1', name: '喜糖礼盒·糖世家', price: 15, date: '2026-06-30', contact: '喜糖店 138xxxx', notes: '每盒15元，已定200盒，含定制包装', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'], isSelected: false },
    { id: 'wi2', name: '伴手礼·精品礼盒', price: 35, date: '2026-07-01', contact: '礼品店 139xxxx', notes: '每份35元，已定50份，送父母和媒人', images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400'], isSelected: false }
  ],
  other: []
};

Page({
  data: {
    activeCategory: 'venue',
    decisions: {},
    currentDecisions: [],
    categories: decisionCategories
  },

  onLoad: function () {
    this.loadDecisionData();
  },

  onShow: function () {
    this.loadDecisionData();
  },

  loadDecisionData: function () {
    const saved = wx.getStorageSync('decisions');
    let decisions = {};
    
    if (saved) {
      decisionCategories.forEach(cat => {
        if (!saved[cat.id]) {
          saved[cat.id] = sampleDecisions[cat.id] || [];
        }
      });
      Object.keys(saved).forEach(key => {
        saved[key] = saved[key].map(item => ({
          ...item,
          formattedPrice: item.price ? item.price.toLocaleString() : ''
        }));
      });
      decisions = saved;
      wx.setStorageSync('decisions', saved);
    } else {
      decisionCategories.forEach(cat => {
        const items = sampleDecisions[cat.id] || [];
        decisions[cat.id] = items.map(item => ({
          ...item,
          formattedPrice: item.price ? item.price.toLocaleString() : ''
        }));
      });
      wx.setStorageSync('decisions', decisions);
    }
    
    this.setData({ decisions });
    this.updateCurrentDecisions();
  },

  switchCategory: function (e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeCategory: category });
    this.updateCurrentDecisions();
  },

  updateCurrentDecisions: function () {
    const decisions = this.data.decisions[this.data.activeCategory] || [];
    this.setData({ currentDecisions: decisions });
  },

  toggleSelected: function (e) {
    const index = e.currentTarget.dataset.index;
    const decisions = { ...this.data.decisions };
    const category = this.data.activeCategory;
    
    decisions[category] = decisions[category].map((d, i) => ({
      ...d,
      isSelected: i === index
    }));
    
    this.setData({ decisions });
    wx.setStorageSync('decisions', decisions);
    this.updateCurrentDecisions();
  },

  addDecision: function () {
    wx.navigateTo({
      url: '/pages/wedding-sub/decision-edit?category=' + this.data.activeCategory
    });
  },

  editDecision: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/wedding-sub/decision-edit?category=' + this.data.activeCategory + '&index=' + index
    });
  },

  deleteDecision: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个决策项吗？',
      success: (res) => {
        if (res.confirm) {
          const decisions = { ...this.data.decisions };
          decisions[this.data.activeCategory] = decisions[this.data.activeCategory].filter((_, i) => i !== index);
          this.setData({ decisions });
          wx.setStorageSync('decisions', decisions);
          this.updateCurrentDecisions();
        }
      }
    });
  },

  showCompare: function () {
    wx.showToast({ title: '对比功能开发中', icon: 'none' });
  },

  previewDecisionImage: function (e) {
    const current = e.currentTarget.dataset.current;
    const urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current,
      urls: urls
    });
  }
});
