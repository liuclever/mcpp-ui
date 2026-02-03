// 企业中心内容列表页
import { api } from '../../utils/api';

interface ContentItem {
  id: number;
  columnId: number;
  title: string;
  coverImage: string;
  images?: string;
  summary: string;
  publishTime: string;
  viewCount: number;
}

interface PageData {
  columnId: number;
  columnName: string;
  displayMode: string;
  contentList: ContentItem[];
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
    columnId: 0,
    columnName: '',
    displayMode: 'image-text',
    contentList: [],
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: true,
    loadingMore: false,
    error: ''
  },

  onLoad(options: any) {
    const columnId = parseInt(options.columnId || '0');
    const columnName = options.columnName || '内容列表';
    const displayMode = options.displayMode || 'image-text';
    
    console.log('📋 list.ts onLoad - options:', options);
    console.log('📋 list.ts onLoad - displayMode:', displayMode);
    
    this.setData({
      columnId,
      columnName,
      displayMode
    });

    wx.setNavigationBarTitle({
      title: columnName
    });

    this.loadContentList(true);
  },

  /**
   * 加载内容列表
   */
  loadContentList(refresh: boolean = false) {
    const that = this;
    
    if (refresh) {
      that.setData({
        page: 1,
        contentList: [],
        hasMore: true,
        loading: true,
        error: ''
      });
    } else {
      that.setData({ loadingMore: true });
    }

    const API_BASE = api.getBaseUrl();
    const { columnId, page, pageSize } = that.data;

    wx.request({
      url: `${API_BASE}/enterprise-center/content/list`,
      method: 'GET',
      data: {
        columnId,
        page,
        pageSize
      },
      success: function(res: any) {
        console.log('加载内容列表响应:', res);
        
        if (res.statusCode === 200 && res.data && res.data.code === 200) {
          const data = res.data.data;
          // Handle undefined list - use empty array as fallback
          const list = data.records || data.list || [];
          const total = data.total || 0;
          
          const contentList = refresh ? list : [...that.data.contentList, ...list];
          const hasMore = contentList.length < total;

          that.setData({
            contentList: contentList,
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
        console.error('加载内容列表失败:', error);
        that.handleLoadError('网络连接失败');
      }
    });
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
      url: `/pages/enterprise/detail?id=${id}`,
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
   * 列表项点击事件处理
   */
  onItemTap(e: any) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/enterprise/detail?id=${id}`,
        fail: (err) => {
          console.error('跳转失败:', err);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });
    }
  },

  /**
   * 重试加载
   */
  onRetry() {
    this.loadContentList(true);
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadContentList(true);
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
      this.loadContentList(false);
    }
  }
});
