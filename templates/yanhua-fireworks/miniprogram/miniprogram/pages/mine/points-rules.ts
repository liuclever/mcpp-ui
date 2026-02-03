// pages/mine/points-rules.ts
import { getPointsRules, PointsRules } from '../../utils/points-api'

interface PageData {
  content: string
  htmlContent: string
  loading: boolean
  error: boolean
}

Page<PageData, {}>({
  data: {
    content: '',
    htmlContent: '',
    loading: true,
    error: false
  },

  /**
   * 页面加载
   * 需求：4.2 - 当用户点击积分规则入口时，小程序应导航到规则显示页面
   */
  onLoad() {
    this.loadRules()
  },

  /**
   * 下拉刷新
   * 需求：4.3 - 小程序从后端检索最新积分规则
   */
  onPullDownRefresh() {
    this.loadRules()
  },

  /**
   * 加载积分规则
   * 需求：4.3 - 小程序从后端检索最新积分规则
   * 需求：4.4 - 小程序应显示带有适当格式的规则内容
   */
  async loadRules() {
    try {
      this.setData({ 
        loading: true,
        error: false
      })

      const rules: PointsRules = await getPointsRules()
      
      // 将Markdown/HTML内容转换为rich-text可以渲染的格式
      // 需求：4.5 - 当规则内容包含Markdown或HTML时，小程序应正确渲染
      const htmlContent = this.processContent(rules.content)
      
      this.setData({
        content: rules.content,
        htmlContent: htmlContent,
        loading: false
      })
    } catch (error) {
      console.error('加载积分规则失败:', error)
      this.setData({ 
        loading: false,
        error: true
      })
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 处理内容格式
   * 将Markdown转换为HTML，或直接使用HTML
   * 需求：4.5 - 当规则内容包含Markdown或HTML时，小程序应正确渲染
   */
  processContent(content: string): string {
    if (!content) return ''
    
    // 简单的Markdown到HTML转换
    // 处理标题
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // 处理粗体和斜体
    html = html
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // 处理列表
    html = html
      .replace(/^\d+\.\s+(.*)$/gim, '<li>$1</li>')
      .replace(/^-\s+(.*)$/gim, '<li>$1</li>')
    
    // 包装连续的<li>标签
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      return '<ul>' + match + '</ul>'
    })
    
    // 处理换行
    html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')
    
    // 包装段落
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>'
    }
    
    return html
  },

  /**
   * 重试加载
   */
  retryLoad() {
    this.loadRules()
  },

  /**
   * 分享
   * 需求：6.1 - 小程序应在"我的"页面上显示积分规则的明确标记入口
   */
  onShareAppMessage() {
    return {
      title: '积分成长规则',
      path: '/pages/mine/points-rules'
    }
  }
})
