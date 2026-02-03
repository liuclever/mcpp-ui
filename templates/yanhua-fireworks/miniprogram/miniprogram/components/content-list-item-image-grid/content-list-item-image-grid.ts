Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  data: {
    displayImages: [] as string[],
    imageCount: 0
  },

  observers: {
    'item': function(item: any) {
      if (item && item.images) {
        let images: string[] = [];
        
        // 解析图片数据
        if (typeof item.images === 'string') {
          try {
            images = JSON.parse(item.images);
          } catch (e) {
            // 如果不是JSON，可能是单个URL或逗号分隔的URL
            if (item.images.includes(',')) {
              images = item.images.split(',').map((url: string) => url.trim());
            } else if (item.images) {
              images = [item.images];
            }
          }
        } else if (Array.isArray(item.images)) {
          images = item.images;
        }
        
        // 最多显示9张图片
        const displayImages = images.slice(0, 9);
        
        this.setData({
          displayImages,
          imageCount: Math.min(displayImages.length, 9)
        });
      } else if (item && item.coverImage) {
        // 如果没有images但有coverImage，使用coverImage
        this.setData({
          displayImages: [item.coverImage],
          imageCount: 1
        });
      } else {
        this.setData({
          displayImages: [],
          imageCount: 0
        });
      }
    }
  },

  methods: {
    onTap() {
      if (this.data.item) {
        this.triggerEvent('tap', { item: this.data.item })
      }
    }
  }
})
