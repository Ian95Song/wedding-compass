Component({
  properties: {
    show: { type: Boolean, value: false },
    title: { type: String, value: '' },
    width: { type: String, value: '' },
    showClose: { type: Boolean, value: true },
    showFooter: { type: Boolean, value: true },
    showCancel: { type: Boolean, value: true },
    showConfirm: { type: Boolean, value: true },
    cancelText: { type: String, value: '取消' },
    confirmText: { type: String, value: '保存' },
    closeOnMask: { type: Boolean, value: true }
  },

  methods: {
    onMaskTap() {
      if (this.properties.closeOnMask) {
        this.triggerEvent('close')
      }
    },
    onClose() {
      this.triggerEvent('close')
    },
    onCancel() {
      this.triggerEvent('cancel')
    },
    onConfirm() {
      this.triggerEvent('confirm')
    },
    stopPropagation() {}
  }
})
