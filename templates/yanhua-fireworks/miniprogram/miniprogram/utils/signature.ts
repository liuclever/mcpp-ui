/**
 * 请求签名工具
 * 用于生成请求签名，验证请求来源和防止重放攻击
 * 需求: 5.2, 5.5
 */

// 注意：这里的secret应该与后端保持一致
// 实际生产环境中，建议使用更安全的方式管理密钥
const SECRET = 'zpyh-fireworks-secret-key-2024'

/**
 * 生成随机字符串（nonce）
 * @param length 长度
 * @returns 随机字符串
 */
export function generateNonce(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let nonce = ''
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return nonce
}

/**
 * 简单的MD5实现（用于签名）
 * 注意：这是一个简化版本，生产环境建议使用专业的加密库
 */
function simpleMD5(str: string): string {
  // 小程序环境下可以使用 wx.getFileSystemManager().digest() 或引入第三方库
  // 这里为了演示，使用一个简化的哈希函数
  let hash = 0
  if (str.length === 0) return hash.toString()
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16)
}

/**
 * 生成请求签名
 * 签名算法：MD5(timestamp + nonce + secret + sortedParams)
 * 
 * @param timestamp 时间戳（毫秒）
 * @param nonce 随机字符串
 * @param params 请求参数
 * @returns 签名字符串
 */
export function generateSignature(
  timestamp: number, 
  nonce: string, 
  params: Record<string, any> = {}
): string {
  // 1. 将参数按key排序
  const sortedKeys = Object.keys(params).sort()
  
  // 2. 拼接参数
  let signStr = `${timestamp}${nonce}${SECRET}`
  
  for (const key of sortedKeys) {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      signStr += `${key}=${value}`
    }
  }
  
  // 3. MD5加密
  const signature = simpleMD5(signStr)
  
  console.log('[签名生成]', {
    timestamp,
    nonce,
    signature,
    signStr: signStr.substring(0, 50) + '...' // 只显示前50个字符
  })
  
  return signature
}

/**
 * 为请求添加签名头
 * 
 * @param headers 原始请求头
 * @param params 请求参数
 * @returns 添加了签名的请求头
 */
export function addSignatureHeaders(
  headers: Record<string, string> = {},
  params: Record<string, any> = {}
): Record<string, string> {
  const timestamp = Date.now()
  const nonce = generateNonce()
  const signature = generateSignature(timestamp, nonce, params)
  
  return {
    ...headers,
    'X-Timestamp': timestamp.toString(),
    'X-Nonce': nonce,
    'X-Signature': signature
  }
}

/**
 * 验证签名是否有效（客户端验证，可选）
 * 
 * @param timestamp 时间戳
 * @param nonce 随机字符串
 * @param signature 签名
 * @param params 请求参数
 * @returns 是否有效
 */
export function verifySignature(
  timestamp: number,
  nonce: string,
  signature: string,
  params: Record<string, any> = {}
): boolean {
  // 1. 验证时间戳（防止重放攻击）
  const currentTime = Date.now()
  const timeDiff = Math.abs(currentTime - timestamp)
  if (timeDiff > 5 * 60 * 1000) { // 5分钟
    console.warn('[签名验证] 时间戳过期')
    return false
  }
  
  // 2. 验证nonce
  if (!nonce || nonce.length === 0) {
    console.warn('[签名验证] nonce为空')
    return false
  }
  
  // 3. 生成签名并比较
  const expectedSignature = generateSignature(timestamp, nonce, params)
  const isValid = expectedSignature === signature
  
  if (!isValid) {
    console.warn('[签名验证] 签名不匹配', {
      expected: expectedSignature,
      actual: signature
    })
  }
  
  return isValid
}

export default {
  generateNonce,
  generateSignature,
  addSignatureHeaders,
  verifySignature
}
