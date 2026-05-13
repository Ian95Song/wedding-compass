const initData = require('../../utils/data-init.js');

Page({
  data: {
    guests: [],
    filteredGuests: [],
    searchText: '',
    filterType: 'all',
    confirmedCount: 0,
    totalCount: 0,
    showAddModal: false,
    showImportModal: false,
    editingGuest: null,
    formData: {
      name: '',
      phone: '',
      relation: '',
      table: '',
      note: '',
      isConfirmed: false
    },
    relations: ['男方-家人', '男方-亲戚', '男方-朋友', '男方-同事', '男方-同学', '男方-其他', '女方-家人', '女方-亲戚', '女方-朋友', '女方-同事', '女方-同学', '女方-其他'],
    groomRelations: ['男方-家人', '男方-亲戚', '男方-朋友', '男方-同事', '男方-同学', '男方-其他'],
    brideRelations: ['女方-家人', '女方-亲戚', '女方-朋友', '女方-同事', '女方-同学', '女方-其他']
  },

  onLoad: function () {
    this.loadGuestData();
  },

  onShow: function () {
    this.loadGuestData();
  },

  loadGuestData: function () {
    const guests = initData.guests();
    const processedGuests = guests.map(g => ({
      ...g,
      gender: g.relation.includes('男方') ? 'groom' : 'bride'
    }));
    this.setData({ guests: processedGuests, filteredGuests: processedGuests });
    this.updateStats();
  },

  updateStats: function () {
    const confirmed = this.data.guests.filter(g => g.isConfirmed).length;
    this.setData({ confirmedCount: confirmed, totalCount: this.data.guests.length });
  },

  updateFilteredGuests: function () {
    let guests = this.data.guests;
    
    if (this.data.filterType === 'groom') {
      guests = guests.filter(g => g.relation.includes('男方'));
    } else if (this.data.filterType === 'bride') {
      guests = guests.filter(g => g.relation.includes('女方'));
    }
    
    if (this.data.searchText) {
      const search = this.data.searchText.toLowerCase();
      guests = guests.filter(g =>
        g.name.toLowerCase().includes(search) ||
        g.relation.includes(search)
      );
    }
    
    this.setData({ filteredGuests: guests });
  },

  onSearchInput: function (e) {
    this.setData({ searchText: e.detail.value });
    this.updateFilteredGuests();
  },

  onFilterChange: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.updateFilteredGuests();
  },

  toggleConfirmed: function (e) {
    const id = e.currentTarget.dataset.id;
    const guests = this.data.guests.map(g => {
      if (g.id === id) {
        return { ...g, isConfirmed: !g.isConfirmed };
      }
      return g;
    });
    this.setData({ guests });
    this.updateFilteredGuests();
    wx.setStorageSync('guests', guests);
    this.updateStats();
  },

  editGuest: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/wedding-sub/guest-edit?id=' + id
    });
  },

  deleteGuest: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个宾客吗？',
      success: (res) => {
        if (res.confirm) {
          const guests = this.data.guests.filter(g => g.id !== id);
          this.setData({ guests });
          this.updateFilteredGuests();
          wx.setStorageSync('guests', guests);
          this.updateStats();
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  },

  addGuest: function () {
    this.setData({
      showAddModal: true,
      editingGuest: null,
      formData: { name: '', phone: '', relation: '', table: '', note: '', isConfirmed: false }
    });
  },

  showImportModal: function () {
    this.setData({ showImportModal: true });
  },

  closeModal: function () {
    this.setData({ showAddModal: false, editingGuest: null });
  },

  closeImportModal: function () {
    this.setData({ showImportModal: false });
  },

  stopPropagation: function () {},

  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  selectRelation: function (e) {
    const relation = e.currentTarget.dataset.value;
    this.setData({ 'formData.relation': relation });
  },

  toggleConfirmedSwitch: function (e) {
    this.setData({ 'formData.isConfirmed': e.detail.value });
  },

  saveGuest: function () {
    const { name, relation } = this.data.formData;
    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!relation) {
      wx.showToast({ title: '请选择关系', icon: 'none' });
      return;
    }

    const guest = {
      id: this.data.editingGuest ? this.data.editingGuest.id : 'g-' + Date.now(),
      name,
      phone: this.data.formData.phone || '',
      relation,
      table: this.data.formData.table,
      note: this.data.formData.note,
      isConfirmed: this.data.formData.isConfirmed
    };

    let newList;
    if (this.data.editingGuest) {
      newList = this.data.guests.map(g => g.id === guest.id ? guest : g);
    } else {
      newList = [...this.data.guests, guest];
    }

    this.setData({ guests: newList, showAddModal: false, editingGuest: null });
    this.updateFilteredGuests();
    wx.setStorageSync('guests', newList);
    this.updateStats();
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  exportGuests: function () {
    const guests = this.data.guests
    if (guests.length === 0) {
      wx.showToast({ title: '暂无宾客数据', icon: 'none' })
      return
    }
    
    let csv = '姓名,手机号,关系,桌号,备注,确认状态\n'
    guests.forEach(g => {
      csv += `${g.name},${g.phone || '-'},${g.relation || '-'},${g.table || '-'},${g.note || '-'},${g.isConfirmed ? '已确认' : '待确认'}\n`
    })
    
    wx.setClipboardData({
      data: csv,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
        this.setData({ showImportModal: false })
      },
      fail: () => {
        wx.showToast({ title: '导出失败', icon: 'none' })
      }
    })
  }
})
