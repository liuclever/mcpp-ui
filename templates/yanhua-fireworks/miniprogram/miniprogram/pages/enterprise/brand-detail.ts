// 品牌故事详情页
import { api } from '../../utils/api';

interface BrandStory {
  id: number;
  categoryType: string;
  title: string;
  content: string;
  images: string;
  imageList: string[];
  sortOrder: number;
  status: number;
  createTime: string;
  updateTime: string;
}

interface PageData {
  storyId: number;
  story: BrandStory | null;
  loading: boolean;
  processedContent: string;
  imageUrls: string[];
}

Page<PageData, {}>({
  data: {
    storyId: 0,
    story: null,
    loading: true,
    processedContent: '',
    imageUrls: []
  },

  onLoad(options: any) {
    if (!options.id) {
      this.showError('参数错误');
      return;
    }

    const storyId = parseInt(options.id);
    if (!storyId || isNaN(storyId)) {
      this.showError('参数错误');
      return;
    }

    this.setData({ storyId });
    this.loadStoryDetail();
  },

  /**
   * 显示错误并返回
   */
  showError(message: string) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  /**
   * 加载品牌故事详情
   */
  loadStoryDetail() {
    const that = this;
    that.setData({ loading: true });

    const API_BASE = api.getBaseUrl();

    wx.request({
      url: `${API_BASE}/enterprise-center/content/detail/${that.data.storyId}`,
      method: 'GET',
      success: function(res: any) {
        console.log('加载品牌故事详情响应:', res);

        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          const story = res.data.data;

          // 提取富文本中的图片URL
          const imageUrls = that.extractImageUrls(story.content);

          // 处理富文本内容
          const processedContent = that.processRichTextContent(story.content);

          that.setData({
            story: story,
            imageUrls: imageUrls,
            processedContent: processedContent,
            loading: false
          });

          // 设置页面标题
          wx.setNavigationBarTitle({
            title: story.title
          });
        } else {
          const errorMsg = (res.data && res.data.message) ? res.data.message : '加载失败';
          that.setData({ loading: false });
          
          wx.showToast({
            title: errorMsg,
            icon: 'none'
          });

          setTimeout(function() {
            wx.navigateBack();
          }, 1500);
        }
      },
      fail: function(error: any) {
        console.error('加载品牌故事详情失败:', error);
        that.setData({ loading: false });

        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });

        setTimeout(function() {
          wx.navigateBack();
        }, 1500);
      }
    });
  },

  /**
   * 从HTML内容中提取图片URL
   */
  extractImageUrls(html: string): string[] {
    if (!html) return [];

    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }

    return urls;
  },

  /**
   * 处理富文本内容，添加样式和图片点击标识
   */
  processRichTextContent(html: string): string {
    if (!html) return '';

    // 为图片添加样式和data-index属性
    let processed = html.replace(
      /<img([^>]*)src="([^">]+)"([^>]*)>/gi,
      (match, before, src, after) => {
        const index = this.data.imageUrls.indexOf(src);
        // 添加内联样式确保图片正确显示
        const style = 'max-width:100%;height:auto;display:block;margin:20rpx 0;border-radius:8rpx;';
        return `<img${before}src="${src}"${after} data-index="${index}" style="${style}">`;
      }
    );

    // 为视频添加controls属性和样式
    processed = processed.replace(
      /<video([^>]*)>/gi,
      (match, attrs) => {
        let newAttrs = attrs;
        if (!attrs.includes('controls')) {
          newAttrs += ' controls';
        }
        const style = 'max-width:100%;width:100%;height:auto;display:block;margin:20rpx 0;border-radius:8rpx;background:#000;';
        if (!attrs.includes('style=')) {
          newAttrs += ` style="${style}"`;
        }
        return `<video${newAttrs}>`;
      }
    );

    // 为段落添加样式
    processed = processed.replace(
      /<p([^>]*)>/gi,
      '<p$1 style="margin:20rpx 0;line-height:1.8;word-wrap:break-word;">'
    );

    // 为标题添加样式
    processed = processed.replace(
      /<h1([^>]*)>/gi,
      '<h1$1 style="font-weight:600;color:#333;margin:30rpx 0 20rpx;line-height:1.4;font-size:36rpx;">'
    );
    processed = processed.replace(
      /<h2([^>]*)>/gi,
      '<h2$1 style="font-weight:600;color:#333;margin:30rpx 0 20rpx;line-height:1.4;font-size:34rpx;">'
    );
    processed = processed.replace(
      /<h3([^>]*)>/gi,
      '<h3$1 style="font-weight:600;color:#333;margin:30rpx 0 20rpx;line-height:1.4;font-size:32rpx;">'
    );

    // 为列表添加样式
    processed = processed.replace(
      /<ul([^>]*)>/gi,
      '<ul$1 style="padding-left:40rpx;margin:20rpx 0;">'
    );
    processed = processed.replace(
      /<ol([^>]*)>/gi,
      '<ol$1 style="padding-left:40rpx;margin:20rpx 0;">'
    );
    processed = processed.replace(
      /<li([^>]*)>/gi,
      '<li$1 style="margin:10rpx 0;line-height:1.8;">'
    );

    // 为引用块添加样式
    processed = processed.replace(
      /<blockquote([^>]*)>/gi,
      '<blockquote$1 style="border-left:4rpx solid #FFD700;padding:20rpx;margin:20rpx 0;color:#666;background:#f9f9f9;border-radius:4rpx;">'
    );

    // 为表格添加样式
    processed = processed.replace(
      /<table([^>]*)>/gi,
      '<table$1 style="width:100%;border-collapse:collapse;margin:20rpx 0;font-size:26rpx;">'
    );
    processed = processed.replace(
      /<th([^>]*)>/gi,
      '<th$1 style="border:1rpx solid #e0e0e0;padding:10rpx;text-align:left;background:#f5f5f5;font-weight:600;">'
    );
    processed = processed.replace(
      /<td([^>]*)>/gi,
      '<td$1 style="border:1rpx solid #e0e0e0;padding:10rpx;text-align:left;">'
    );

    return processed;
  },

  /**
   * 富文本点击事件处理
   */
  onRichTextTap(e: any) {
    console.log('Rich text tapped:', e);
    
    // 如果有图片URL，显示预览
    if (this.data.imageUrls.length > 0) {
      // 由于rich-text组件限制，无法准确获取点击的具体图片
      // 这里预览第一张图片
      this.previewImages(0);
    }
  },

  /**
   * 预览图片
   */
  previewImages(index: number = 0) {
    if (this.data.imageUrls.length === 0) {
      return;
    }

    wx.previewImage({
      current: this.data.imageUrls[index],
      urls: this.data.imageUrls
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadStoryDetail();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 返回按钮点击
   */
  navigateBack() {
    wx.navigateBack({
      fail: () => {
        // 如果返回失败（比如没有上一页），跳转到品牌故事列表
        wx.redirectTo({
          url: '/pages/enterprise/brand-list'
        });
      }
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const story = this.data.story;
    if (!story) {
      return {
        title: '品牌故事',
        path: '/pages/enterprise/brand-list'
      };
    }

    return {
      title: story.title,
      path: `/pages/enterprise/brand-detail?id=${story.id}`,
      imageUrl: story.imageList && story.imageList.length > 0 ? story.imageList[0] : ''
    };
  }
});
