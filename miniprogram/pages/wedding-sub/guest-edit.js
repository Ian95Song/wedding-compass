Page({
  data: {
    formData: {
      name: '',
      phone: '',
      relation: '',
      table: '',
      note: ''
    },
    isEditing: false,
    editIndex: -1
  },

  onLoad: function (options) {
    if (options.index !== undefined) {
      const index = parseInt(options.index)
      const guests = wx.getStorageSync('guests') || []
      const guest = guests[index]
      
      if (guest) {
        this.setData({
          formData: {
            name: guest.name,
            phone: guest.phone,
            relation: guest.relation,
            table: String(guest.table),
            note: guest.note
          },
          isEditing: true,
          editIndex: index
        })
        wx.setNavigationBarTitle({ title: '编辑宾客' })
      }
    } else {
      wx.setNavigationBarTitle({ title: '添加宾客' })
    }
  },

  onNameInput: function (e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onPhoneInput: function (e) {
    this.setData({ 'formData.phone': e.detail.value })
  },

  onRelationInput: function (e) {
    this.setData({ 'formData.relation': e.detail.value })
  },

  onTableInput: function (e) {
    this.setData({ 'formData.table': e.detail.value })
  },

  onNoteInput: function (e) {
    this.setData({ 'formData.note': e.detail.value })
  },

  save: function () {
    const { name, phone, relation, table, note } = this.data.formData
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入宾客姓名', icon: 'none' })
      return
    }
    
    const guests = wx.getStorageSync('guests') || []
    const guest = {
      name: name.trim(),
      phone: phone.trim(),
      relation: relation.trim(),
      table: table ? parseInt(table) : 0,
      note: note.trim(),
      isConfirmed: false
    }
    
    if (this.data.isEditing) {
      guest.isConfirmed = guests[this.data.editIndex].isConfirmed
      guests[this.data.editIndex] = guest
    } else {
      guests.push(guest)
    }
    
    wx.setStorageSync('guests', guests)
    
    wx.showToast({
      title: this.data.isEditing ? '更新成功' : '添加成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
