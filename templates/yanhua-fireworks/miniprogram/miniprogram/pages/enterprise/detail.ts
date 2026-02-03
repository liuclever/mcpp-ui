// 企业中心内容详情页面
import { request, api } from '../../utils/api';

interface Content {
  id: number;
  columnId: number;
  title: string;
  coverImage: string;
  summary: string;
  content: string;
  status: string;
  publishTime: string;
  viewCount: number;
  createTime: string;
  updateTime: string;
}

interface PageData {
  contentId: number;
  content: Content | null;
  loading: boolean;
  imageUrls: string[];
  videoUrls: string[];
  processedContent: string;
  isSinglePage: boolean; // 是否是单页类型（通过columnId加载）
}

Page<PageData, {}>({
  data: {
    contentId: 0,
    content: null,
    loading: true,
    imageUrls: [],
    videoUrls: [],
    processedContent: '',
    isSinglePage: false
  },

  onLoad(options: any) {
    // 支持两种参数：id（内容ID）或 columnId（栏目ID）
    if (options.id) {
      // 直接通过内容ID加载
      const contentId = parseInt(options.id);
      if (!contentId || isNaN(contentId)) {
        this.showError('参数错误');
        return;
      }
      this.setData({ contentId });
      this.loadContentDetail();
    } else if (options.columnId) {
      // 通过栏目ID加载该栏目的第一条内容（单页类型）
      const columnId = parseInt(options.columnId);
      if (!columnId || isNaN(columnId)) {
        this.showError('参数错误');
        return;
      }
      this.setData({ isSinglePage: true });
      this.loadContentByColumnId(columnId);
    } else {
      this.showError('缺少必要参数');
    }
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
   * 通过栏目ID加载内容
   */
  async loadContentByColumnId(columnId: number) {
    this.setData({ loading: true });
    
    try {
      const res = await request<{ records: Content[], list: Content[] }>({
        url: '/enterprise-center/content/list',
        method: 'GET',
        data: { columnId, page: 1, pageSize: 1 },
        showLoading: false
      });
      
      const list = res.data.records || res.data.list || [];
      
      if (list && list.length > 0) {
        // 获取第一条内容的ID
        const contentId = list[0].id;
        this.setData({ contentId }, () => {
          this.loadContentDetail();
        });
      } else {
        // 没有内容
        this.setData({ loading: false });
        wx.showModal({
          title: '提示',
          content: '该栏目暂无内容',
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        });
      }
    } catch (error: any) {
      console.error('加载内容列表失败:', error);
      this.setData({ loading: false });
      
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载内容详情
   */
  loadContentDetail() {
    const that = this;
    that.setData({ loading: true });
    
    // 使用统一的API配置
    const API_BASE = api.getBaseUrl();
    
    wx.request({
      url: `${API_BASE}/enterprise-center/content/detail/${that.data.contentId}`,
      method: 'GET',
      success: function(res: any) {
        console.log('加载内容详情响应:', res);
        
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          const content = res.data.data;
          
          // 提取富文本中的图片和视频URL
          const imageUrls = that.extractImageUrls(content.content);
          const videoUrls = that.extractVideoUrls(content.content);
          
          // 处理富文本内容，添加点击标识
          const processedContent = that.processRichTextContent(content.content);
          
          // 格式化发布时间
          if (content.publishTime) {
            content.publishTime = that.formatTime(content.publishTime);
          }
          
          that.setData({
            content: content,
            imageUrls: imageUrls,
            videoUrls: videoUrls,
            processedContent: processedContent,
            loading: false
          });
          
          // 设置页面标题
          wx.setNavigationBarTitle({
            title: content.title
          });
        } else {
          // API返回错误
          console.error('加载内容详情失败:', res.data);
          that.setData({ loading: false });
          
          const errorMsg = (res.data && res.data.message) ? res.data.message : '加载失败';
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
        console.error('加载内容详情失败:', error);
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
   * 从HTML内容中提取视频URL
   */
  extractVideoUrls(html: string): string[] {
    if (!html) return [];
    
    const videoRegex = /<video[^>]+src="([^">]+)"/g;
    const sourceRegex = /<source[^>]+src="([^">]+)"/g;
    const urls: string[] = [];
    let match;
    
    // 提取video标签的src
    while ((match = videoRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    
    // 提取source标签的src
    while ((match = sourceRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  },

  /**
   * 处理富文本内容，添加图片和视频的点击标识及样式
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
        // 添加内联样式确保视频正确显示
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
   * 格式化时间
   */
  formatTime(timeStr: string): string {
    const date = new Date(timeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  /**
   * 富文本点击事件处理
   * 注意：由于rich-text组件的限制，这个方法可能无法完全捕获所有点击事件
   * 如果需要更好的交互体验，建议使用自定义组件或wxParse等第三方库
   */
  onRichTextTap(e: any) {
    console.log('Rich text tapped:', e);
    
    // 尝试获取点击的元素信息
    // 注意：rich-text的事件处理有限制，可能无法准确获取点击的具体元素
    
    // 如果有图片URL，显示预览
    if (this.data.imageUrls.length > 0) {
      // 由于无法准确获取点击的图片，这里预览第一张图片
      // 实际使用中，建议使用自定义组件来实现更好的交互
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
    this.loadContentDetail();
    // 延迟停止刷新，给请求一些时间
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    const content = this.data.content;
    if (!content) {
      return {
        title: '企业中心',
        path: '/pages/enterprise/index'
      };
    }
    
    return {
      title: content.title,
      path: `/pages/enterprise/detail?id=${content.id}`,
      imageUrl: content.coverImage || ''
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const content = this.data.content;
    if (!content) {
      return {
        title: '企业中心',
        query: ''
      };
    }
    
    return {
      title: content.title,
      query: `id=${content.id}`,
      imageUrl: content.coverImage || ''
    };
  }
});
