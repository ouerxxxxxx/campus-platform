// ============================================================
// 校园综合服务平台 - 全局类型定义
// ============================================================

/** 用户资料 */
export interface Profile {
  id: string
  student_id: string
  real_name: string
  email: string
  nickname: string
  avatar_url: string | null
  grade: string
  major: string
  dormitory: string
  bio: string
  points: number
  verified: boolean
  created_at: string
  updated_at: string
}

/** 二手物品 */
export interface MarketItem {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  original_price: number | null
  category: MarketCategory
  images: string[]
  condition: '全新' | '几乎全新' | '良好' | '一般'
  status: 'active' | 'sold' | 'removed'
  location: string
  views: number
  favorites_count: number
  created_at: string
  updated_at: string
  // 关联数据
  seller?: Profile
  is_favorited?: boolean
}

export type MarketCategory = '数码' | '书籍' | '衣物' | '生活用品' | '运动' | '其他'

/** 失物招领 */
export interface LostFoundItem {
  id: string
  user_id: string
  type: 'lost' | 'found'
  item_name: string
  description: string
  images: string[]
  location: string
  location_coords: { lat: number; lng: number } | null
  lost_found_date: string
  contact_info: string
  status: 'open' | 'resolved'
  views: number
  created_at: string
  updated_at: string
  user?: Profile
}

/** 跑腿订单 */
export interface ErrandOrder {
  id: string
  publisher_id: string
  title: string
  description: string
  category: ErrandCategory
  reward: number
  pickup_location: string | null
  pickup_coords: { lat: number; lng: number } | null
  delivery_location: string | null
  delivery_coords: { lat: number; lng: number } | null
  deadline: string | null
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  runner_id: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  publisher?: Profile
  runner?: Profile
  review?: ErrandReview
}

export type ErrandCategory = '代取快递' | '代买饭' | '代办事情' | '其他'

/** 跑腿评价 */
export interface ErrandReview {
  id: string
  order_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

/** 资讯文章 */
export interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string | null
  cover_image: string | null
  category: NewsCategory
  source: string | null
  author: string | null
  is_official: boolean
  is_pinned: boolean
  views: number
  created_at: string
  updated_at: string
}

export type NewsCategory = '官方公告' | '校园活动' | '社团招新' | '兼职信息'

/** 树洞帖子 */
export interface TreeHolePost {
  id: string
  user_id: string | null
  content: string
  images: string[]
  tags: string[]
  likes_count: number
  comments_count: number
  is_anonymous: boolean
  mood: '开心' | '难过' | '吐槽' | '求助' | '其他'
  created_at: string
  user?: Profile | null
  is_liked?: boolean
}

/** 树洞评论 */
export interface TreeHoleComment {
  id: string
  post_id: string
  user_id: string | null
  content: string
  is_anonymous: boolean
  created_at: string
  user?: Profile | null
}

/** 通知 */
export interface Notification {
  id: string
  user_id: string
  type: 'system' | 'market' | 'errand' | 'message'
  title: string
  content: string | null
  related_id: string | null
  is_read: boolean
  created_at: string
}

/** 收藏 */
export interface Favorite {
  id: string
  user_id: string
  item_type: 'market_item' | 'news_article' | 'treehole_post'
  item_id: string
  created_at: string
}

/** 私信 */
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  related_item_id: string | null
  is_read: boolean
  created_at: string
  sender?: Profile
}

/** 导航菜单项 */
export interface NavItem {
  path: string
  label: string
  icon: string
}
