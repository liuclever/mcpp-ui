// 企业中心主页面
import { request } from '../../utils/api';

interface EnterpriseCenterConfig {
  bannerImageUrl: string;
  introductionText: string;
}

interface ColumnConfig {
  id: number;
  name: string;
  type: 'single' | 'list' | 'map' | 'form';
  icon: string;
  description: string;
  sortOrder: number;
  enabled: boolean;
  displayMode?: string;
}

interface PageData {
  config: EnterpriseCenterConfig;
  columns: ColumnConfig[];
  loading: boolean;
  error: string;
}

Page<PageData, {}>({
  data: {
    config: {
      bannerImageUrl: '',
      introductionText: ''
    },
    columns: [],
    loading: true,
    error: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '企业中心'
    });
    this.loadConfig();
  },

  onShow() {
    // 每次页面显示时重新加载栏目数据，确保获取最新的displayMode配置
    this.loadColumns();
  },

  /**
   * 加载企业中心配置
   */
  async loadConfig() {
    this.setData({ loading: true, error: '' });
    
    try {
      const res = await request<EnterpriseCenterConfig>({
        url: '/enterprise-center/config',
        method: 'GET',
        showLoading: false
      });
      
      // 修复: 使用 res.data 获取实际数据
      this.setData({
        config: res.data,
        loading: false
      });
    } catch (error: any) {
      console.error('加载企业中心配置失败:', error);
      this.handleLoadError(error.message || '加载配置失败');
    }
  },

  /**
   * 加载栏目列表
   */
  async loadColumns() {
    try {
      const res = await request<ColumnConfig[]>({
        url: '/enterprise-center/columns',
        method: 'GET',
        showLoading: false
      });
      
      // 修复: 使用 res.data 获取实际数据
      this.setData({
        columns: res.data || []
      });
    } catch (error: any) {
      console.error('加载栏目列表失败:', error);
      wx.showToast({
        title: '加载栏目失败',
        icon: 'none'
      });
    }
  },

  /**
   * 处理加载错误
   */
  handleLoadError(message: string) {
    console.error('加载企业中心配置失败:', message);
    
    // 使用默认配置
    this.setData({
      config: {
        bannerImageUrl: '/images/default-banner.jpg',
        introductionText: '正攀烟花，专注烟花行业多年，致力于为全球客户提供高品质的烟花产品和专业的燃放服务。'
      },
      loading: false,
      error: '加载失败，显示默认内容'
    });
    
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 跳转到栏目页面
   */
  goToColumn(e: any) {
    const column = e.currentTarget.dataset.column;
    
    // 特殊处理: 品牌故事跳转到列表页
    if (column.name === '品牌故事' || column.id === 1) {
      this.goToBrandList(column.displayMode);
      return;
    }
    
    // 根据栏目类型跳转到不同页面
    const routes: Record<string, string> = {
      single: '/pages/enterprise/detail',
      list: '/pages/enterprise/list',
      form: '/pages/enterprise/form',
      map: '/pages/enterprise/map'
    };
    
    const url = routes[column.type];
    if (url) {
      let targetUrl = `${url}?columnId=${column.id}&columnName=${column.name}`;
      
      // 如果是列表类型且有displayMode配置，传递displayMode参数
      if (column.type === 'list' && column.displayMode) {
        targetUrl += `&displayMode=${column.displayMode}`;
      }
      
      console.log('📋 index.ts goToColumn - column:', column);
      console.log('📋 index.ts goToColumn - targetUrl:', targetUrl);
      
      wx.navigateTo({
        url: targetUrl,
        fail: (err) => {
          console.error('跳转失败:', err);
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '暂未开放',
        icon: 'none'
      });
    }
  },

  /**
   * 跳转到品牌故事列表
   */
  goToBrandList(displayMode?: string) {
    let url = '/pages/enterprise/brand-list';
    if (displayMode) {
      url += `?displayMode=${displayMode}`;
    }
    
    console.log('📋 index.ts goToBrandList - url:', url);
    
    wx.navigateTo({
      url,
      fail: (err) => {
        console.error('跳转品牌故事列表失败:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 海报加载成功
   */
  onBannerLoad() {
    console.log('海报加载成功');
  },

  /**
   * 海报加载失败
   */
  onBannerError() {
    console.error('海报加载失败');
    
    // 设置默认占位图
    this.setData({
      'config.bannerImageUrl': '/images/default-banner.jpg'
    });
    
    wx.showToast({
      title: '图片加载失败',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 重新加载
   */
  onRetry() {
    this.loadConfig();
    this.loadColumns();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadConfig();
    this.loadColumns();
    // 延迟停止刷新，给请求一些时间
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
