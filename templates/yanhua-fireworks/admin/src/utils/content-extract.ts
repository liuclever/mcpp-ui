/**
 * 内容提取工具函数
 * 用于从富文本HTML中提取摘要和封面图
 */

/**
 * 从HTML内容中提取纯文本摘要
 * @param htmlContent HTML内容
 * @param maxLength 最大长度(默认200字)
 * @returns 纯文本摘要
 */
export function extractSummary(htmlContent: string, maxLength: number = 200): string {
  if (!htmlContent || htmlContent.trim() === '') {
    return ''
  }
  
  // 创建临时DOM元素
  const div = document.createElement('div')
  div.innerHTML = htmlContent
  
  // 提取纯文本
  let text = div.textContent || div.innerText || ''
  
  // 去除多余空格
  text = text.replace(/\s+/g, ' ').trim()
  
  // 截取指定长度
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...'
  }
  
  return text
}

/**
 * 从HTML内容中提取第一张图片的URL
 * @param htmlContent HTML内容
 * @returns 图片URL，如果没有图片则返回空字符串
 */
export function extractCoverImage(htmlContent: string): string {
  if (!htmlContent || htmlContent.trim() === '') {
    return ''
  }
  
  // 创建临时DOM元素
  const div = document.createElement('div')
  div.innerHTML = htmlContent
  
  // 查找第一个img标签
  const img = div.querySelector('img')
  
  if (img && img.src) {
    return img.src
  }
  
  return ''
}

/**
 * 从HTML内容中提取所有图片的URL
 * @param htmlContent HTML内容
 * @returns 图片URL列表
 */
export function extractAllImages(htmlContent: string): string[] {
  if (!htmlContent || htmlContent.trim() === '') {
    return []
  }
  
  // 创建临时DOM元素
  const div = document.createElement('div')
  div.innerHTML = htmlContent
  
  // 查找所有img标签
  const images = div.querySelectorAll('img')
  
  const imageUrls: string[] = []
  images.forEach(img => {
    if (img.src) {
      imageUrls.push(img.src)
    }
  })
  
  return imageUrls
}
