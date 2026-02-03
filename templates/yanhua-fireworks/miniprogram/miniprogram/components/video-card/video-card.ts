Component({
  properties: {
    video: {
      type: Object,
      value: null
    },
    mode: {
      type: String,
      value: 'grid' // 'grid' | 'list'
    }
  },

  data: {
  },

  methods: {
    onTap() {
      if (this.data.video) {
        this.triggerEvent('tap', { video: this.data.video })
      }
    },

    formatNumber(num: number): string {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    }
  }
})
