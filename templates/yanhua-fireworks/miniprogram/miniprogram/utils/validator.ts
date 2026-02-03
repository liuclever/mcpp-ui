/**
 * 验证工具函数
 * 提供标题、描述、评论、视频时长等验证功能
 */

/**
 * 验证结果接口
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 验证标题
 * 规则：非空，长度≤50字
 * @param title 标题
 * @returns 验证结果
 * 
 * @example
 * validateTitle('') // { valid: false, message: '标题不能为空' }
 * validateTitle('正常标题') // { valid: true }
 * validateTitle('a'.repeat(51)) // { valid: false, message: '标题不能超过50个字符' }
 */
export function validateTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      valid: false,
      message: '标题不能为空'
    }
  }

  const trimmedTitle = title.trim()
  
  if (trimmedTitle.length > 50) {
    return {
      valid: false,
      message: '标题不能超过50个字符'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证描述
 * 规则：可选，长度≤200字
 * @param description 描述
 * @returns 验证结果
 * 
 * @example
 * validateDescription('') // { valid: true }
 * validateDescription('正常描述') // { valid: true }
 * validateDescription('a'.repeat(201)) // { valid: false, message: '描述不能超过200个字符' }
 */
export function validateDescription(description: string): ValidationResult {
  // 描述是可选的，空字符串也是有效的
  if (!description) {
    return {
      valid: true
    }
  }

  const trimmedDescription = description.trim()
  
  if (trimmedDescription.length > 200) {
    return {
      valid: false,
      message: '描述不能超过200个字符'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证评论
 * 规则：非空，长度≤200字
 * @param comment 评论内容
 * @returns 验证结果
 * 
 * @example
 * validateComment('') // { valid: false, message: '评论内容不能为空' }
 * validateComment('   ') // { valid: false, message: '评论内容不能为空' }
 * validateComment('正常评论') // { valid: true }
 * validateComment('a'.repeat(201)) // { valid: false, message: '评论内容不能超过200个字符' }
 */
export function validateComment(comment: string): ValidationResult {
  if (!comment || comment.trim().length === 0) {
    return {
      valid: false,
      message: '评论内容不能为空'
    }
  }

  const trimmedComment = comment.trim()
  
  if (trimmedComment.length > 200) {
    return {
      valid: false,
      message: '评论内容不能超过200个字符'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证视频时长
 * 规则：时长≤60秒
 * @param duration 视频时长（秒）
 * @returns 验证结果
 * 
 * @example
 * validateVideoDuration(30) // { valid: true }
 * validateVideoDuration(60) // { valid: true }
 * validateVideoDuration(61) // { valid: false, message: '视频时长不能超过60秒' }
 * validateVideoDuration(0) // { valid: false, message: '视频时长无效' }
 * validateVideoDuration(-1) // { valid: false, message: '视频时长无效' }
 */
export function validateVideoDuration(duration: number): ValidationResult {
  if (duration <= 0) {
    return {
      valid: false,
      message: '视频时长无效'
    }
  }

  if (duration > 60) {
    return {
      valid: false,
      message: '视频时长不能超过60秒'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证手机号
 * 规则：11位数字，1开头
 * @param phone 手机号
 * @returns 验证结果
 * 
 * @example
 * validatePhone('13800138000') // { valid: true }
 * validatePhone('1380013800') // { valid: false, message: '手机号格式不正确' }
 * validatePhone('23800138000') // { valid: false, message: '手机号格式不正确' }
 */
export function validatePhone(phone: string): ValidationResult {
  const phoneRegex = /^1[3-9]\d{9}$/
  
  if (!phoneRegex.test(phone)) {
    return {
      valid: false,
      message: '手机号格式不正确'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证验证码
 * 规则：6位数字
 * @param code 验证码
 * @returns 验证结果
 * 
 * @example
 * validateVerifyCode('123456') // { valid: true }
 * validateVerifyCode('12345') // { valid: false, message: '验证码格式不正确' }
 * validateVerifyCode('abcdef') // { valid: false, message: '验证码格式不正确' }
 */
export function validateVerifyCode(code: string): ValidationResult {
  const codeRegex = /^\d{6}$/
  
  if (!codeRegex.test(code)) {
    return {
      valid: false,
      message: '验证码格式不正确'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证URL
 * 规则：http或https开头的有效URL
 * @param url URL地址
 * @returns 验证结果
 * 
 * @example
 * validateUrl('https://example.com') // { valid: true }
 * validateUrl('http://example.com') // { valid: true }
 * validateUrl('example.com') // { valid: false, message: 'URL格式不正确' }
 */
export function validateUrl(url: string): ValidationResult {
  const urlRegex = /^https?:\/\/.+/
  
  if (!urlRegex.test(url)) {
    return {
      valid: false,
      message: 'URL格式不正确'
    }
  }

  return {
    valid: true
  }
}

/**
 * 验证密码
 * 规则：至少8位，包含字母和数字
 * @param password 密码
 * @returns 验证结果
 * 
 * @example
 * validatePassword('abc123') // { valid: false, message: '密码至少需要8位' }
 * validatePassword('12345678') // { valid: false, message: '密码必须包含字母和数字' }
 * validatePassword('abcdefgh') // { valid: false, message: '密码必须包含字母和数字' }
 * validatePassword('abc12345') // { valid: true }
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: '密码至少需要8位'
    }
  }

  // 检查是否同时包含字母和数字
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      message: '密码必须包含字母和数字'
    }
  }

  return {
    valid: true
  }
}

/**
 * 获取密码强度
 * @param password 密码
 * @returns 密码强度：weak（弱）、medium（中）、strong（强）
 * 
 * @example
 * getPasswordStrength('abc123') // 'weak'
 * getPasswordStrength('abc12345') // 'medium'
 * getPasswordStrength('Abc@12345') // 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password || password.length < 8) {
    return 'weak'
  }

  let strength = 0
  
  // 长度加分
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++
  
  // 包含数字
  if (/\d/.test(password)) strength++
  
  // 包含特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
}
