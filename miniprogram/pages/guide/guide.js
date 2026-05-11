const app = getApp()
const utils = require('../../utils/index.js')

Page({
  data: {
    weddingDate: '',
    daysLeft: 0,
    currentPhase: {},
    phases: [],
    expandedPhase: 1,
    selectedDate: '',
    defaultDate: '',
    showAddTaskModal: false,
    newTaskName: '',
    newTaskDesc: '',
    showMoveTaskModal: false,
    taskToMove: null,
    targetPhase: 1,
    currentPhaseName: '',
    currentPhaseColor: '',
    taskSourcePhase: 1,
    phaseOptions: [],
    selectedPhaseIndex: 0,
    selectedPhaseName: ''
  },

  onLoad: function () {
    this.setDefaultDate()
    this.loadUserData()
  },

  onShow: function () {
    this.loadUserData()
  },

  setDefaultDate: function () {
    const today = new Date()
    const defaultDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)
    this.setData({
      defaultDate: utils.formatDate(defaultDate),
      selectedDate: ''
    })
  },

  loadUserData: function () {
    const weddingDate = app.globalData.weddingDate
    if (weddingDate) {
      const daysLeft = utils.getDaysBetween(new Date(), weddingDate)
      const currentPhase = utils.getPhaseByDays(daysLeft)
      
      this.setData({
        weddingDate: weddingDate,
        daysLeft: daysLeft,
        currentPhase: currentPhase,
        expandedPhase: currentPhase.phase
      })
      
      this.loadPhases(daysLeft)
    }
  },

  loadPhases: function (daysLeft) {
    const taskTemplates = require('../../data/tasks.js').taskTemplates
    const sharedTasks = app.getTasks()
    
    const phases = taskTemplates.map(phase => {
      const isTimeline = phase.isTimeline === true
      
      if (isTimeline) {
        return {
          ...phase,
          color: this.getPhaseColor(phase.phase),
          isCurrent: phase.phase === utils.getPhaseByDays(daysLeft).phase
        }
      }
      
      const phaseTasks = sharedTasks.filter(t => t.phase === phase.phase)
      const completed = phaseTasks.filter(t => t.status === 'completed').length
      
      return {
        ...phase,
        color: this.getPhaseColor(phase.phase),
        tasks: phaseTasks,
        completed: completed,
        total: phaseTasks.length,
        isCurrent: phase.phase === utils.getPhaseByDays(daysLeft).phase
      }
    })
    
    const phaseNames = phases.map(p => p.phaseName)
    
    this.setData({ phases, phaseNames })
  },

  getPhaseColor: function (phase) {
    const colors = ['#D4A574', '#E8B4B8', '#B5C4B1', '#C9B896', '#D4A574', '#FAAD14', '#FF4D4F', '#52C41A']
    return colors[phase - 1] || '#D4A574'
  },

  onDateChange: function (e) {
    const date = e.detail.value
    const dateCN = utils.formatDateCN(date)
    this.setData({
      selectedDate: dateCN,
      defaultDate: date
    })
  },

  confirmDate: function () {
    if (!this.data.defaultDate) {
      wx.showToast({
        title: '请选择婚期',
        icon: 'none'
      })
      return
    }

    app.globalData.weddingDate = this.data.defaultDate
    app.setWeddingDate(this.data.defaultDate)
    
    wx.showToast({
      title: '婚期已设置',
      icon: 'success'
    })

    setTimeout(() => {
      this.loadUserData()
    }, 1000)
  },

  togglePhase: function (e) {
    const phase = parseInt(e.currentTarget.dataset.phase)
    this.setData({
      expandedPhase: this.data.expandedPhase === phase ? null : phase
    })
  },

  toggleTask: function (e) {
    const taskId = e.currentTarget.dataset.id
    app.updateTaskStatus(taskId, 'completed')
    this.loadPhases(this.data.daysLeft)
  },

  moveTask: function (e) {
    const taskId = e.currentTarget.dataset.id
    const phases = this.data.phases
    let taskToMove = null
    let taskPhase = null
    let currentPhaseName = ''
    let currentPhaseColor = ''
    
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      if (phase.isTimeline) {
        continue
      }
      
      const tasks = phase.tasks || []
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        taskToMove = task
        taskPhase = phase.phase
        currentPhaseName = phase.phaseName
        currentPhaseColor = phase.color
        break
      }
    }
    
    if (taskToMove) {
      this.setData({
        showMoveTaskModal: true,
        taskToMove: taskToMove,
        targetPhase: taskPhase,
        currentPhaseName: currentPhaseName,
        currentPhaseColor: currentPhaseColor,
        taskSourcePhase: taskPhase
      })
    }
  },

  onPhaseSelect: function (e) {
    const phase = parseInt(e.currentTarget.dataset.phase)
    this.setData({ targetPhase: phase })
  },

  confirmMoveTask: function () {
    const { taskToMove, targetPhase, taskSourcePhase } = this.data
    
    if (targetPhase === taskSourcePhase) {
      wx.showToast({
        title: '请选择其他阶段',
        icon: 'none'
      })
      return
    }
    
    const tasks = app.getTasks()
    
    const targetPhaseData = this.data.phases.find(p => p.phase === targetPhase)
    const phaseName = targetPhaseData ? targetPhaseData.phaseName : ''
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskToMove.id) {
        return { 
          ...task, 
          phase: targetPhase,
          phaseName: phaseName,
          daysBeforeWedding: targetPhaseData ? targetPhaseData.daysBeforeWedding : 1
        }
      }
      return task
    })
    
    app.saveTasksData(updatedTasks)
    app.globalData.tasks = updatedTasks
    this.loadPhases(this.data.daysLeft)
    
    this.setData({
      showMoveTaskModal: false,
      taskToMove: null,
      targetPhase: 1,
      taskSourcePhase: 1
    })
    
    wx.showToast({
      title: '已移动',
      icon: 'success'
    })
  },

  closeMoveTaskModal: function () {
    this.setData({
      showMoveTaskModal: false,
      taskToMove: null,
      targetPhase: 1
    })
  },

  updateTaskStatus: function (taskId, status) {
    app.updateTaskStatus(taskId, status)
    this.loadPhases(this.data.daysLeft)
  },

  addCustomTask: function () {
    const phases = this.data.phases
    const phaseOptions = phases
      .filter(p => !p.isTimeline)
      .map(p => ({
        phase: p.phase,
        name: p.phaseName,
        color: p.color
      }))
    
    const currentPhaseIndex = phaseOptions.findIndex(p => p.phase === this.data.currentPhase.phase)
    const defaultIndex = currentPhaseIndex >= 0 ? currentPhaseIndex : 0
    const defaultPhase = phaseOptions[defaultIndex] || phaseOptions[0]
    
    this.setData({
      showAddTaskModal: true,
      newTaskName: '',
      newTaskDesc: '',
      phaseOptions: phaseOptions,
      selectedPhaseIndex: defaultIndex,
      selectedPhaseName: defaultPhase ? defaultPhase.name : phaseOptions[0].name
    })
  },

  closeAddTaskModal: function () {
    this.setData({
      showAddTaskModal: false,
      newTaskName: '',
      newTaskDesc: ''
    })
  },

  stopPropagation: function () {},

  onTaskNameInput: function (e) {
    this.setData({ newTaskName: e.detail.value })
  },

  onTaskDescInput: function (e) {
    this.setData({ newTaskDesc: e.detail.value })
  },

  onPhaseSelectForAdd: function (e) {
    const index = e.detail.value
    const phase = this.data.phaseOptions[index]
    this.setData({
      selectedPhaseIndex: index,
      selectedPhaseName: phase.name
    })
  },

  saveTask: function () {
    if (!this.data.newTaskName.trim()) {
      wx.showToast({
        title: '请输入任务名称',
        icon: 'none'
      })
      return
    }

    const selectedPhase = this.data.phaseOptions[this.data.selectedPhaseIndex]
    const selectedPhaseData = this.data.phases.find(p => p.phase === (selectedPhase ? selectedPhase.phase : this.data.currentPhase.phase))
    
    const newTask = {
      id: 'custom-' + Date.now(),
      name: this.data.newTaskName,
      description: this.data.newTaskDesc || '',
      status: 'pending',
      isCustom: true,
      phase: selectedPhase ? selectedPhase.phase : this.data.currentPhase.phase,
      phaseName: selectedPhase ? selectedPhase.name : this.data.currentPhase.phaseName,
      daysBeforeWedding: selectedPhaseData ? selectedPhaseData.daysBeforeWedding : 1
    }

    const tasks = app.getTasks()
    const updatedTasks = [...tasks, newTask]
    app.saveTasksData(updatedTasks)
    
    this.setData({
      showAddTaskModal: false,
      newTaskName: '',
      newTaskDesc: '',
      selectedPhaseIndex: 0,
      selectedPhaseName: ''
    })

    this.loadPhases(this.data.daysLeft)
    
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },
  
  getDaysBeforeWedding: function (phase) {
    const mapping = {
      1: 365,
      2: 270,
      3: 180,
      4: 90,
      5: 30,
      6: 7,
      7: 1
    }
    return mapping[phase] || 30
  }
})
