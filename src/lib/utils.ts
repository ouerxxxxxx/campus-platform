// ============================================================
// 通用工具函数
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合并Tailwind类名 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 格式化日期 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const min = Math.floor(diff / 60000)
  const hour = Math.floor(diff / 3600000)
  const day = Math.floor(diff / 86400000)

  if (min < 1) return '刚刚'
  if (min < 60) return `${min}分钟前`
  if (hour < 24) return `${hour}小时前`
  if (day < 7) return `${day}天前`

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/** 格式化价格 */
export function formatPrice(price: number): string {
  if (price >= 10000) return `${(price / 10000).toFixed(1)}万`
  return `¥${price.toFixed(price % 1 === 0 ? 0 : 2)}`
}

/** 获取分类颜色 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '数码': 'bg-blue-100 text-blue-700',
    '书籍': 'bg-green-100 text-green-700',
    '衣物': 'bg-purple-100 text-purple-700',
    '生活用品': 'bg-orange-100 text-orange-700',
    '运动': 'bg-teal-100 text-teal-700',
    '其他': 'bg-gray-100 text-gray-700',
    '官方公告': 'bg-red-100 text-red-700',
    '校园活动': 'bg-blue-100 text-blue-700',
    '社团招新': 'bg-green-100 text-green-700',
    '兼职信息': 'bg-orange-100 text-orange-700',
    '代取快递': 'bg-blue-100 text-blue-700',
    '代买饭': 'bg-orange-100 text-orange-700',
    '代办事情': 'bg-purple-100 text-purple-700',
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

/** 获取状态标签 */
export function getStatusLabel(status: string): { text: string; color: string } {
  const map: Record<string, { text: string; color: string }> = {
    active: { text: '在售', color: 'bg-green-100 text-green-700' },
    sold: { text: '已售', color: 'bg-gray-100 text-gray-500' },
    removed: { text: '已下架', color: 'bg-red-100 text-red-500' },
    open: { text: '进行中', color: 'bg-blue-100 text-blue-700' },
    resolved: { text: '已解决', color: 'bg-green-100 text-green-700' },
    accepted: { text: '已接单', color: 'bg-orange-100 text-orange-700' },
    in_progress: { text: '进行中', color: 'bg-blue-100 text-blue-700' },
    completed: { text: '已完成', color: 'bg-green-100 text-green-700' },
    cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-500' },
    lost: { text: '寻物启事', color: 'bg-red-100 text-red-700' },
    found: { text: '失物招领', color: 'bg-green-100 text-green-700' },
  }
  return map[status] || { text: status, color: 'bg-gray-100 text-gray-700' }
}

/** 截断文本 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

/** 生成随机ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/** 获取初始字母作为头像 */
export function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase()
}

/** 获取头像背景色 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
    'bg-red-500', 'bg-indigo-500', 'bg-yellow-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
