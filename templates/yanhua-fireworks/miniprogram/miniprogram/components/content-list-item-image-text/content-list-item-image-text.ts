Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {},

  methods: {
    onTap() {
      if (this.data.item) {
        this.triggerEvent('tap', { item: this.data.item })
      }
    }
  }
})
