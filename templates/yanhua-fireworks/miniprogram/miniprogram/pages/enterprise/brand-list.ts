// 品牌故事列表页
import { api } from '../../utils/api';

interface BrandStory {
  id: number;
  title: string;
  content: string;
  imageList: string[];
  sortOrder: number;
  createTime: string;
  viewCount: number;
}

interface BrandStoryItem {
  id: number;
  title: string;
  summary: string;
  coverImage: string;
  images?: string[];
  publishTime: string;
  createTime: string;
  viewCount: number;
}

interface PageData {
  brandStories: BrandStoryItem[];
  displayMode: string;
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string;
}

Page<PageData, {}>({
  data: {
    brandStories: [],
    displayMode: 'image-grid',
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: true,
    loadingMore: false,
    error: ''
  },

  onLoad(options: any) {
    const displayMode = options.displayMode || 'image-grid';
    
    console.log('📋 brand-list.ts onLoad - displayMode:', displayMode);
    
    this.setData({ displayMode });
    
    wx.setNavigationBarTitle({
      title: '品牌故事'
    });
    this.loadBrandStories(true);
  },

  onShow() {
    // 从详情页返回时刷新列表以更新阅读量
    if (this.data.brandStories.length > 0) {
      this.loadBrandStories(true);
    }
  },

  /**
   * 加载品牌故事列表
   */
  loadBrandStories(refresh: boolean = false) {
    const that = this;
    
    if (refresh) {
      that.setData({
        page: 1,
        brandStories: [],
        hasMore: true,
        loading: true,
        error: ''
      });
    } else {
      that.setData({ loadingMore: true });
    }

    const API_BASE = api.getBaseUrl();
    const { page, pageSize } = that.data;

    wx.request({
      url: `${API_BASE}/enterprise-center/content/list`,
      method: 'GET',
      data: {
        columnId: 1,
        page,
        pageSize
      },
      success: function(res: any) {
        console.log('加载品牌故事列表响应:', res);
        
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          const data = res.data.data;
          const records = data.records || [];
          const total = data.total || 0;
          
          // 转换为列表项格式，确保字段名与组件期望一致
          const items: BrandStoryItem[] = records.map((item: any) => {
            // 从文章内容中提取图片
            const extractedImages = that.extractImagesFromContent(item.content || '');
            const coverImage = item.coverImage || (extractedImages.length > 0 ? extractedImages[0] : 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/default-cover.png');
            
            return {
              id: item.id,
              title: item.title,
              summary: item.summary || '',
              coverImage: coverImage,
              images: extractedImages.slice(0, 3), // 最多取3张图片
              publishTime: item.publishTime || item.createTime,
              createTime: item.createTime,
              viewCount: item.viewCount || 0
            };
          });
          
          const brandStories = refresh ? items : [...that.data.brandStories, ...items];
          const hasMore = brandStories.length < total;

          that.setData({
            brandStories: brandStories,
            total: total,
            hasMore: hasMore,
            loading: false,
            loadingMore: false
          });
        } else {
          const errorMsg = (res.data && res.data.message) ? res.data.message : '加载失败';
          that.handleLoadError(errorMsg);
        }
      },
      fail: function(error: any) {
        console.error('加载品牌故事列表失败:', error);
        that.handleLoadError('网络连接失败');
      }
    });
  },

  /**
   * 从HTML内容中提取图片URL列表
   */
  extractImagesFromContent(content: string): string[] {
    if (!content) return [];
    
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const images: string[] = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      if (match[1]) {
        images.push(match[1]);
      }
    }
    
    return images;
  },

  /**
   * 从内容中提取摘要（前100字）
   */
  extractSummary(content: string): string {
    if (!content) return '';
    
    // 移除HTML标签
    const text = content.replace(/<[^>]+>/g, '');
    // 移除多余空白
    const cleaned = text.replace(/\s+/g, ' ').trim();
    // 截取前100字
    return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned;
  },

  /**
   * 获取封面图（取第一张图片）
   */
  getCoverImage(imageList: string[]): string {
    if (imageList && imageList.length > 0) {
      return imageList[0];
    }
    // 使用COS上的默认封面图
    return 'https://zhengpan-fireworks-1392575669.cos.ap-shanghai.myqcloud.com/miniprogram/assets/images/default-cover.png';
  },

  /**
   * 处理加载错误
   */
  handleLoadError(message: string) {
    const that = this;
    
    that.setData({
      loading: false,
      loadingMore: false,
      error: message
    });

    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 跳转到详情页
   */
  goToDetail(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/enterprise/brand-detail?id=${id}`,
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 重试加载
   */
  onRetry() {
    this.loadBrandStories(true);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadBrandStories(true);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadBrandStories(false);
    }
  }
});
