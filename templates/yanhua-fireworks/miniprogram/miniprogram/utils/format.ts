/**
 * 格式化工具函数
 * 提供时间、数字、时长等格式化功能
 */

/**
 * 格式化时间
 * @param time 时间戳（毫秒）或日期字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 * 
 * @example
 * formatTime(1609459200000) // '2021-01-01 00:00:00'
 * formatTime('2021-01-01', 'YYYY/MM/DD') // '2021/01/01'
 * formatTime(Date.now(), 'MM-DD HH:mm') // '01-01 12:30'
 */
export function formatTime(time: number | string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const date = new Date(time)
  
  if (isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const pad = (n: number): string => n < 10 ? '0' + n : '' + n

  return format
    .replace('YYYY', year.toString())
    .replace('MM', pad(month))
    .replace('DD', pad(day))
    .replace('HH', pad(hour))
    .replace('mm', pad(minute))
    .replace('ss', pad(second))
}

/**
 * 格式化相对时间（刚刚、几分钟前、几小时前等）
 * @param time 时间戳（毫秒）或日期字符串
 * @returns 相对时间字符串
 * 
 * @example
 * formatRelativeTime(Date.now() - 30000) // '刚刚'
 * formatRelativeTime(Date.now() - 300000) // '5分钟前'
 * formatRelativeTime(Date.now() - 7200000) // '2小时前'
 */
export function formatRelativeTime(time: number | string | Date): string {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 0) {
    return formatTime(time, 'MM-DD HH:mm')
  }

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else if (months < 12) {
    return `${months}个月前`
  } else {
    return `${years}年前`
  }
}

/**
 * 格式化数字（大数字转换为k、w等单位）
 * @param num 数字
 * @param precision 精度，默认1位小数
 * @returns 格式化后的数字字符串
 * 
 * @example
 * formatNumber(123) // '123'
 * formatNumber(1234) // '1.2k'
 * formatNumber(12345) // '1.2w'
 * formatNumber(123456) // '12.3w'
 * formatNumber(1234567) // '123.5w'
 */
export function formatNumber(num: number, precision: number = 1): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 10000) {
    // 1k - 9.9k
    return (num / 1000).toFixed(precision) + 'k'
  } else if (num < 100000000) {
    // 1w - 9999.9w
    return (num / 10000).toFixed(precision) + 'w'
  } else {
    // 1亿+
    return (num / 100000000).toFixed(precision) + '亿'
  }
}

/**
 * 格式化时长（秒转换为 mm:ss 或 HH:mm:ss）
 * @param seconds 秒数
 * @returns 格式化后的时长字符串
 * 
 * @example
 * formatDuration(30) // '00:30'
 * formatDuration(90) // '01:30'
 * formatDuration(3661) // '01:01:01'
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) {
    return '00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const pad = (n: number): string => n < 10 ? '0' + n : '' + n

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  } else {
    return `${pad(minutes)}:${pad(secs)}`
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param precision 精度，默认2位小数
 * @returns 格式化后的文件大小字符串
 * 
 * @example
 * formatFileSize(1024) // '1.00 KB'
 * formatFileSize(1048576) // '1.00 MB'
 * formatFileSize(1073741824) // '1.00 GB'
 */
export function formatFileSize(bytes: number, precision: number = 2): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return (bytes / Math.pow(k, i)).toFixed(precision) + ' ' + sizes[i]
}
