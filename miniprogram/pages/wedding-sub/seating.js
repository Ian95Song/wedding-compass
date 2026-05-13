const initData = require('../../utils/data-init.js');

Page({
  data: {
    tables: [],
    showAddTableModal: false,
    showAssignModal: false,
    showTableDetailModal: false,
    editingTable: null,
    selectedTable: null,
    selectedDetailTable: null,
    availableGuests: [],
    formData: {
      tableNumber: '',
      tableName: '',
      maxGuests: '10'
    },
    assignedCount: 0,
    totalGuests: 0
  },

  onLoad: function () {
    this.loadData()
  },

  onShow: function () {
    this.loadData()
  },

  loadData: function () {
    const guests = initData.guests();
    const tables = initData.tables();
    
    let assignedCount = 0
    const assignedIds = []
    
    tables.forEach(table => {
      if (table.guests) {
        assignedCount += table.guests.length
        table.guests.forEach(guest => {
          assignedIds.push(guest.id)
        })
      }
    })
    
    const availableGuests = guests.filter(guest => !assignedIds.includes(guest.id))
    
    this.setData({ 
      tables: tables,
      availableGuests: availableGuests,
      assignedCount: assignedCount,
      totalGuests: guests.length
    })
  },

  addTable: function () {
    const nextNumber = this.data.tables.length > 0 
      ? Math.max(...this.data.tables.map(t => t.number)) + 1 
      : 1
    
    this.setData({
      showAddTableModal: true,
      editingTable: null,
      formData: { 
        tableNumber: String(nextNumber), 
        tableName: '', 
        maxGuests: '10' 
      }
    })
  },

  editTable: function (e) {
    const id = e.currentTarget.dataset.id
    const table = this.data.tables.find(t => t.id === id)
    if (table) {
      this.setData({
        showAddTableModal: true,
        editingTable: table,
        formData: {
          tableNumber: String(table.number),
          tableName: table.name || '',
          maxGuests: String(table.maxGuests || 10)
        }
      })
    }
  },

  deleteTable: function (e) {
    const id = e.currentTarget.dataset.id
    const table = this.data.tables.find(t => t.id === id)
    
    wx.showModal({
      title: '确认删除',
      content: table && table.guests && table.guests.length > 0 
        ? '该桌有宾客安排，删除后宾客将被移出座位安排，确定继续吗？'
        : '确定要删除这桌吗？',
      success: (res) => {
        if (res.confirm) {
          const table = this.data.tables.find(t => t.id === id)
          if (table && table.guests && table.guests.length > 0) {
            const guests = wx.getStorageSync('guests') || []
            const updatedGuests = guests.map(g => {
              if (table.guests.some(guest => guest.id === g.id)) {
                return { ...g, table: '' }
              }
              return g
            })
            wx.setStorageSync('guests', updatedGuests)
          }
          
          const newTables = this.data.tables.filter(t => t.id !== id)
          this.setData({ tables: newTables })
          wx.setStorageSync('tables', newTables)
          this.loadData()
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  closeModal: function () {
    this.setData({ showAddTableModal: false, editingTable: null })
  },

  closeAssignModal: function () {
    this.setData({ showAssignModal: false, selectedTable: null })
  },

  closeTableDetailModal: function () {
    this.setData({ showTableDetailModal: false, selectedDetailTable: null })
  },

  stopPropagation: function () {
  },

  onInput: function (e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  saveTable: function () {
    const { tableNumber, tableName, maxGuests } = this.data.formData
    
    if (!tableNumber || Number(tableNumber) <= 0) {
      wx.showToast({ title: '请输入有效桌号', icon: 'none' })
      return
    }
    
    const parsedMaxGuests = Number(maxGuests) || 10
    if (parsedMaxGuests < 1) {
      wx.showToast({ title: '人数上限至少为1', icon: 'none' })
      return
    }

    const existingTable = this.data.tables.find(t => 
      t.number === Number(tableNumber) && t.id !== (this.data.editingTable ? this.data.editingTable.id : null)
    )
    if (existingTable) {
      wx.showToast({ title: '该桌号已存在', icon: 'none' })
      return
    }

    const table = {
      id: this.data.editingTable ? this.data.editingTable.id : `table-${Date.now()}`,
      number: Number(tableNumber),
      name: tableName,
      guests: this.data.editingTable ? this.data.editingTable.guests : [],
      maxGuests: parsedMaxGuests
    }

    let newTables
    if (this.data.editingTable) {
      newTables = this.data.tables.map(t => t.id === table.id ? table : t)
    } else {
      newTables = [...this.data.tables, table]
    }

    this.setData({ tables: newTables, showAddTableModal: false, editingTable: null })
    wx.setStorageSync('tables', newTables)
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  showTableDetail: function (e) {
    const id = e.currentTarget.dataset.id
    const table = this.data.tables.find(t => t.id === id)
    this.setData({ selectedDetailTable: table, showTableDetailModal: true })
  },

  assignGuests: function (e) {
    const id = e.currentTarget.dataset.id
    const table = this.data.tables.find(t => t.id === id)
    this.loadData()
    this.setData({ selectedTable: table, showAssignModal: true })
  },

  assignGuestsFromDetail: function () {
    if (this.data.selectedDetailTable) {
      this.loadData()
      this.setData({ 
        selectedTable: this.data.selectedDetailTable, 
        showAssignModal: true,
        showTableDetailModal: false 
      })
    }
  },

  assignGuestToTable: function (e) {
    const guestId = e.currentTarget.dataset.id
    const guestName = e.currentTarget.dataset.name
    if (!this.data.selectedTable) return

    const tableIndex = this.data.tables.findIndex(t => t.id === this.data.selectedTable.id)
    if (tableIndex === -1) return

    const table = this.data.tables[tableIndex]
    if (table.guests.length >= table.maxGuests) {
      wx.showToast({ title: '该桌已满', icon: 'none' })
      return
    }

    if (table.guests.some(g => g.id === guestId)) {
      wx.showToast({ title: '该宾客已在桌中', icon: 'none' })
      return
    }

    const newTables = [...this.data.tables]
    newTables[tableIndex] = {
      ...table,
      guests: [...table.guests, { id: guestId, name: guestName }]
    }

    const guests = wx.getStorageSync('guests') || []
    const updatedGuests = guests.map(g => {
      if (g.id === guestId) {
        return { ...g, table: String(table.number) }
      }
      return g
    })
    wx.setStorageSync('guests', updatedGuests)
    
    this.setData({ 
      tables: newTables,
      selectedTable: newTables[tableIndex]
    })
    wx.setStorageSync('tables', newTables)
    this.loadData()
    
    const updatedTable = this.data.tables.find(t => t.id === this.data.selectedTable.id)
    this.setData({ selectedTable: updatedTable })
    
    wx.showToast({ title: '已安排', icon: 'success' })
  },

  removeGuest: function (e) {
    const { tableId, guestId } = e.currentTarget.dataset
    const tableIndex = this.data.tables.findIndex(t => t.id === tableId)
    if (tableIndex === -1) return

    const table = this.data.tables[tableIndex]
    const newTables = [...this.data.tables]
    newTables[tableIndex] = {
      ...table,
      guests: table.guests.filter(g => g.id !== guestId)
    }

    const guests = wx.getStorageSync('guests') || []
    const updatedGuests = guests.map(g => {
      if (g.id === guestId) {
        return { ...g, table: '' }
      }
      return g
    })
    wx.setStorageSync('guests', updatedGuests)
    
    this.setData({ tables: newTables })
    wx.setStorageSync('tables', newTables)
    
    const updatedTable = this.data.tables.find(t => t.id === tableId)
    if (this.data.selectedTable && this.data.selectedTable.id === tableId) {
      this.setData({ selectedTable: updatedTable })
    }
    if (this.data.selectedDetailTable && this.data.selectedDetailTable.id === tableId) {
      this.setData({ selectedDetailTable: updatedTable })
    }
    
    this.loadData()
  },

  getTableProgress: function (table) {
    if (!table.maxGuests || table.maxGuests <= 0) return 0
    return Math.round((table.guests.length / table.maxGuests) * 100)
  },

  exportSeating: function () {
    if (this.data.tables.length === 0) {
      wx.showToast({ title: '暂无数据可导出', icon: 'none' })
      return
    }
    
    let text = '【座位安排表】\n\n'
    
    this.data.tables.forEach(table => {
      const guests = table.guests && table.guests.length > 0 
        ? table.guests.map(g => g.name).join('、') 
        : '（空）'
      text += `桌号：${table.number} | ${table.name || '主桌'}\n`
      text += `人数：${table.guests ? table.guests.length : 0}/${table.maxGuests}人\n`
      text += `宾客：${guests}\n`
      text += '─────────────────\n'
    })
    
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
      },
      fail: () => {
        wx.showToast({ title: '导出失败', icon: 'none' })
      }
    })
  }
})