const initData = require('../../utils/data-init.js');

Page({
  data: {
    categories: ['新娘服饰', '新郎服饰', '婚房布置', '婚礼当天', '接亲物品', '宾客招待', '备用物品'],
    activeCategoryIndex: 0,
    activeCategory: '新娘服饰',
    checklistData: {},
    currentChecklist: [],
    checkedCount: 0,
    totalItems: 0,
    progressPercent: 0,
    
    showModal: false,
    isEdit: false,
    editIndex: -1,
    form: {
      name: '',
      note: ''
    }
  },

  onLoad: function () {
    this.loadChecklistData();
  },

  onShow: function () {
    this.loadChecklistData();
  },

  loadChecklistData: function () {
    const checklist = initData.checklist();
    this.setData({ checklistData: checklist });
    this.updateCurrentChecklist();
  },

  switchCategory: function (e) {
    const index = e.detail.value;
    const category = this.data.categories[index];
    this.setData({ 
      activeCategoryIndex: index,
      activeCategory: category 
    });
    this.updateCurrentChecklist();
  },

  updateCurrentChecklist: function () {
    const checklist = this.data.checklistData[this.data.activeCategory] || [];
    const checked = checklist.filter(item => item.isChecked).length;
    const total = checklist.length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    this.setData({ 
      currentChecklist: checklist,
      checkedCount: checked,
      totalItems: total,
      progressPercent: percent
    });
  },

  toggleChecked: function (e) {
    const index = e.currentTarget.dataset.index;
    const checklistData = { ...this.data.checklistData };
    const category = this.data.activeCategory;
    checklistData[category][index].isChecked = !checklistData[category][index].isChecked;
    this.setData({ checklistData });
    wx.setStorageSync('checklist', checklistData);
    this.updateCurrentChecklist();
  },

  openAddModal: function () {
    this.setData({
      showModal: true,
      isEdit: false,
      editIndex: -1,
      form: { name: '', note: '' }
    });
  },

  openEditModal: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.currentChecklist[index];
    this.setData({
      showModal: true,
      isEdit: true,
      editIndex: index,
      form: { 
        name: item.name || '', 
        note: item.note || '' 
      }
    });
  },

  closeModal: function () {
    this.setData({ showModal: false });
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  saveItem: function () {
    const { name, note } = this.data.form;
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'none' });
      return;
    }

    const checklistData = { ...this.data.checklistData };
    const category = this.data.activeCategory;
    
    if (!checklistData[category]) {
      checklistData[category] = [];
    }

    const newItem = {
      id: 'checklist-' + Date.now(),
      name: name.trim(),
      note: note ? note.trim() : '',
      isChecked: false
    };

    if (this.data.isEdit && this.data.editIndex >= 0) {
      checklistData[category][this.data.editIndex] = {
        ...newItem,
        id: checklistData[category][this.data.editIndex].id,
        isChecked: checklistData[category][this.data.editIndex].isChecked
      };
    } else {
      checklistData[category].push(newItem);
    }

    wx.setStorageSync('checklist', checklistData);
    this.setData({ checklistData, showModal: false });
    this.updateCurrentChecklist();
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  deleteItem: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个物品吗？',
      success: (res) => {
        if (res.confirm) {
          const checklistData = { ...this.data.checklistData };
          checklistData[this.data.activeCategory] = checklistData[this.data.activeCategory].filter((_, i) => i !== index);
          this.setData({ checklistData });
          wx.setStorageSync('checklist', checklistData);
          this.updateCurrentChecklist();
        }
      }
    });
  }
});
