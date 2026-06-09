// ============================================================
// Supabase API 数据层 - 统一封装所有 CRUD 操作
// 检测到 Supabase 配置 → 真实 API；否则 → 本地 Mock 降级
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase'
import {
  mockMarketItems, mockLostFoundItems, mockErrandOrders,
  mockNewsArticles, mockTreeHolePosts, mockTreeHoleComments,
  mockNotifications, mockUsers,
  delay, getCurrentUser,
} from './mock-data'
import type {
  Profile, MarketItem, LostFoundItem, ErrandOrder,
  NewsArticle, TreeHolePost, TreeHoleComment, Notification,
  Favorite, Message, ErrandReview,
} from '@/types'

// ---- 辅助：判断是否使用 Mock ----
const useMock = () => !isSupabaseConfigured()

/** 获取Supabase客户端（仅在useMock()为false时调用） */
const db = () => supabase!

// ============================================================
// 用户认证
// ============================================================

export const authApi = {
  /** 注册：学号 + 姓名 + 邮箱 + 密码 */
  async signUp(params: { studentId: string; name: string; email: string; password: string }) {
    if (useMock()) {
      await delay(500)
      const exists = mockUsers.find(u => u.student_id === params.studentId)
      if (exists) return { success: false as const, error: '该学号已被注册' }
      if (!/^\d{6,10}$/.test(params.studentId)) return { success: false as const, error: '学号格式不正确' }
      if (!params.email.endsWith('.edu.cn')) return { success: false as const, error: '请使用学校邮箱' }
      const newUser: Profile = {
        id: `u${Date.now()}`, student_id: params.studentId, real_name: params.name,
        email: params.email, nickname: params.name, avatar_url: null,
        grade: '2025级', major: '', dormitory: '', bio: '', points: 100,
        verified: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
      return { success: true as const, user: newUser }
    }

    const { data, error } = await db().auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: { student_id: params.studentId, real_name: params.name },
      },
    })
    if (error) return { success: false as const, error: error.message }
    // 创建 profile
    const { error: profileError } = await db().from('profiles').insert({
      id: data.user!.id, student_id: params.studentId, real_name: params.name,
      email: params.email, nickname: params.name,
    })
    if (profileError) return { success: false as const, error: profileError.message }
    const profile = await getProfileById(data.user!.id)
    return { success: true as const, user: profile! }
  },

  /** 登录：邮箱 + 密码 */
  async signIn(email: string, password: string) {
    if (useMock()) {
      await delay(300)
      const user = mockUsers.find(u => u.email === email || u.student_id === email)
      if (user) return { success: true as const, user }
      return { success: false as const, error: '账号不存在或密码错误' }
    }

    const { data, error } = await db().auth.signInWithPassword({ email, password })
    if (error) return { success: false as const, error: error.message }
    const profile = await getProfileById(data.user.id)
    return { success: true as const, user: profile! }
  },

  /** 登出 */
  async signOut() {
    if (useMock()) return
    await db().auth.signOut()
  },

  /** 获取当前会话 */
  async getSession() {
    if (useMock()) return getCurrentUser()
    const { data } = await db().auth.getSession()
    if (!data.session?.user) return null
    return getProfileById(data.session.user.id)
  },
}

// ============================================================
// 用户 Profile CRUD
// ============================================================

export async function getProfileById(userId: string): Promise<Profile | null> {
  if (useMock()) {
    await delay(200)
    return mockUsers.find(u => u.id === userId) || null
  }
  const { data } = await db().from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  if (useMock()) return { success: true }
  const { error } = await db().from('profiles').update(updates).eq('id', userId)
  return { success: !error, error: error?.message }
}

// ============================================================
// 二手市场 API
// ============================================================

export const marketApi = {
  async list(params?: { category?: string; keyword?: string; status?: string }) {
    if (useMock()) {
      await delay(200)
      let list = [...mockMarketItems]
      if (params?.category && params.category !== 'all') list = list.filter(i => i.category === params.category)
      if (params?.keyword) list = list.filter(i => i.title.includes(params.keyword!) || i.description.includes(params.keyword!))
      if (params?.status) list = list.filter(i => i.status === params.status)
      return list
    }

    let query = db().from('market_items').select('*, seller:profiles(*)').order('created_at', { ascending: false })
    if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
    if (params?.keyword) query = query.or(`title.ilike.%${params.keyword}%,description.ilike.%${params.keyword}%`)
    if (params?.status) query = query.eq('status', params.status)
    const { data } = await query
    return data || []
  },

  async getById(id: string) {
    if (useMock()) {
      await delay(150)
      const item = mockMarketItems.find(i => i.id === id)
      if (item) {
        // 模拟增加浏览量
        return item
      }
      return null
    }
    // 先增加浏览量
    await db().rpc('increment_view', { table_name: 'market_items', row_id: id })
    const { data } = await db().from('market_items').select('*, seller:profiles(*)').eq('id', id).single()
    return data
  },

  async create(item: Omit<MarketItem, 'id' | 'created_at' | 'updated_at' | 'views' | 'favorites_count' | 'seller'>) {
    if (useMock()) return { success: true, id: `m${Date.now()}` }
    const { data, error } = await db().from('market_items').insert(item).select('id').single()
    return { success: !error, id: data?.id, error: error?.message }
  },

  async update(id: string, updates: Partial<MarketItem>) {
    if (useMock()) return { success: true }
    const { error } = await db().from('market_items').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
    return { success: !error, error: error?.message }
  },

  async remove(id: string) {
    if (useMock()) return { success: true }
    const { error } = await db().from('market_items').update({ status: 'removed', updated_at: new Date().toISOString() }).eq('id', id)
    return { success: !error, error: error?.message }
  },
}

// ============================================================
// 失物招领 API
// ============================================================

export const lostFoundApi = {
  async list(params?: { type?: string; keyword?: string }) {
    if (useMock()) {
      await delay(200)
      let list = [...mockLostFoundItems]
      if (params?.type && params.type !== 'all') list = list.filter(i => i.type === params.type)
      if (params?.keyword) list = list.filter(i => i.item_name.includes(params.keyword!) || i.location.includes(params.keyword!))
      return list
    }
    let query = db().from('lost_found_items').select('*, user:profiles(*)').order('created_at', { ascending: false })
    if (params?.type && params.type !== 'all') query = query.eq('type', params.type)
    if (params?.keyword) query = query.or(`item_name.ilike.%${params.keyword}%,location.ilike.%${params.keyword}%`)
    const { data } = await query
    return data || []
  },

  async getById(id: string) {
    if (useMock()) {
      await delay(150)
      return mockLostFoundItems.find(i => i.id === id) || null
    }
    await db().rpc('increment_view', { table_name: 'lost_found_items', row_id: id })
    const { data } = await db().from('lost_found_items').select('*, user:profiles(*)').eq('id', id).single()
    return data
  },

  async create(item: Omit<LostFoundItem, 'id' | 'created_at' | 'updated_at' | 'views' | 'user'>) {
    if (useMock()) return { success: true, id: `l${Date.now()}` }
    const { data, error } = await db().from('lost_found_items').insert(item).select('id').single()
    return { success: !error, id: data?.id, error: error?.message }
  },

  async markResolved(id: string) {
    if (useMock()) return { success: true }
    const { error } = await db().from('lost_found_items').update({ status: 'resolved', updated_at: new Date().toISOString() }).eq('id', id)
    return { success: !error }
  },
}

// ============================================================
// 跑腿服务 API
// ============================================================

export const errandApi = {
  async list(params?: { category?: string; keyword?: string; status?: string }) {
    if (useMock()) {
      await delay(200)
      let list = [...mockErrandOrders]
      if (params?.category && params.category !== 'all') list = list.filter(i => i.category === params.category)
      if (params?.keyword) list = list.filter(i => i.title.includes(params.keyword!) || i.description.includes(params.keyword!))
      if (params?.status) list = list.filter(i => i.status === params.status)
      return list
    }
    let query = db().from('errand_orders').select('*, publisher:profiles!publisher_id(*), runner:profiles!runner_id(*)').order('created_at', { ascending: false })
    if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
    if (params?.status) query = query.eq('status', params.status)
    const { data } = await query
    return data || []
  },

  async getById(id: string) {
    if (useMock()) {
      await delay(150)
      return mockErrandOrders.find(o => o.id === id) || null
    }
    const { data } = await db().from('errand_orders').select('*, publisher:profiles!publisher_id(*), runner:profiles!runner_id(*)').eq('id', id).single()
    return data
  },

  async create(order: Omit<ErrandOrder, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'runner_id' | 'status' | 'publisher' | 'runner'>) {
    if (useMock()) return { success: true, id: `e${Date.now()}` }
    const { data, error } = await db().from('errand_orders').insert(order).select('id').single()
    return { success: !error, id: data?.id, error: error?.message }
  },

  async accept(id: string, runnerId: string) {
    if (useMock()) return { success: true }
    const { error } = await db().from('errand_orders').update({ status: 'accepted', runner_id: runnerId, updated_at: new Date().toISOString() }).eq('id', id).eq('status', 'open')
    return { success: !error, error: error?.message }
  },

  async complete(id: string) {
    if (useMock()) return { success: true }
    const { error } = await db().from('errand_orders').update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id)
    return { success: !error }
  },

  async cancel(id: string) {
    if (useMock()) return { success: true }
    const { error } = await db().from('errand_orders').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', id).eq('status', 'open')
    return { success: !error }
  },

  async getMyOrders(userId: string) {
    if (useMock()) {
      await delay(200)
      return {
        published: mockErrandOrders.filter(o => o.publisher_id === userId),
        accepted: mockErrandOrders.filter(o => o.runner_id === userId),
      }
    }
    const [{ data: published }, { data: accepted }] = await Promise.all([
      db().from('errand_orders').select('*, runner:profiles!runner_id(*)').eq('publisher_id', userId).order('created_at', { ascending: false }),
      db().from('errand_orders').select('*, publisher:profiles!publisher_id(*)').eq('runner_id', userId).order('created_at', { ascending: false }),
    ])
    return { published: published || [], accepted: accepted || [] }
  },

  async addReview(review: { order_id: string; reviewer_id: string; reviewee_id: string; rating: number; comment?: string }) {
    if (useMock()) return { success: true }
    const { error } = await db().from('errand_reviews').insert(review)
    return { success: !error }
  },
}

// ============================================================
// 资讯 API
// ============================================================

export const newsApi = {
  async list(params?: { category?: string; keyword?: string }) {
    if (useMock()) {
      await delay(200)
      let list = [...mockNewsArticles]
      if (params?.category && params.category !== 'all') list = list.filter(n => n.category === params.category)
      if (params?.keyword) list = list.filter(n => n.title.includes(params.keyword!) || (n.summary || '').includes(params.keyword!))
      return [...list].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
    }
    let query = db().from('news_articles').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
    if (params?.category && params.category !== 'all') query = query.eq('category', params.category)
    if (params?.keyword) query = query.or(`title.ilike.%${params.keyword}%,summary.ilike.%${params.keyword}%`)
    const { data } = await query
    return data || []
  },

  async getById(id: string) {
    if (useMock()) {
      await delay(150)
      return mockNewsArticles.find(n => n.id === id) || null
    }
    await db().rpc('increment_view', { table_name: 'news_articles', row_id: id })
    const { data } = await db().from('news_articles').select('*').eq('id', id).single()
    return data
  },
}

// ============================================================
// 树洞 API
// ============================================================

export const treeholeApi = {
  async list(params?: { mood?: string; sort?: 'latest' | 'hot' }) {
    if (useMock()) {
      await delay(200)
      let list = [...mockTreeHolePosts]
      if (params?.mood && params.mood !== 'all') list = list.filter(p => p.mood === params.mood)
      if (params?.sort === 'hot') list.sort((a, b) => b.likes_count - a.likes_count)
      else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      return list
    }
    let query = db().from('treehole_posts').select('*')
    if (params?.mood && params.mood !== 'all') query = query.eq('mood', params.mood)
    if (params?.sort === 'hot') query = query.order('likes_count', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const { data } = await query
    return data || []
  },

  async getById(id: string) {
    if (useMock()) {
      await delay(150)
      return mockTreeHolePosts.find(p => p.id === id) || null
    }
    const { data } = await db().from('treehole_posts').select('*').eq('id', id).single()
    return data
  },

  async create(post: { user_id: string; content: string; mood?: string; tags?: string[]; is_anonymous?: boolean }) {
    if (useMock()) return { success: true, id: `t${Date.now()}` }
    const { data, error } = await db().from('treehole_posts').insert(post).select('id').single()
    return { success: !error, id: data?.id, error: error?.message }
  },

  async toggleLike(postId: string, userId: string) {
    if (useMock()) return { success: true }
    // 此处可扩展为独立的 likes 表
    const { error } = await db().rpc('toggle_treehole_like', { post_id: postId, user_id: userId })
    return { success: !error }
  },

  async getComments(postId: string) {
    if (useMock()) {
      await delay(150)
      return mockTreeHoleComments.filter(c => c.post_id === postId)
    }
    const { data } = await db().from('treehole_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
    return data || []
  },

  async addComment(comment: { post_id: string; user_id: string; content: string; is_anonymous?: boolean }) {
    if (useMock()) return { success: true }
    const { error } = await db().from('treehole_comments').insert(comment)
    // 同时更新帖子的评论计数
    if (!error) {
      await db().rpc('increment_comment_count', { post_id: comment.post_id })
    }
    return { success: !error }
  },
}

// ============================================================
// 通知 API
// ============================================================

export const notificationApi = {
  async list(userId: string) {
    if (useMock()) {
      await delay(200)
      return mockNotifications.filter(n => n.user_id === userId)
    }
    const { data } = await db().from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
    return data || []
  },

  async markRead(ids: string[]) {
    if (useMock()) return
    const { error } = await db().from('notifications').update({ is_read: true }).in('id', ids)
    if (error) console.error('Mark read failed:', error)
  },
}

// ============================================================
// 收藏 API
// ============================================================

export const favoriteApi = {
  async list(userId: string, itemType?: string) {
    if (useMock()) {
      await delay(200)
      // 返回模拟数据中的收藏信息
      const favIds = mockMarketItems.slice(0, 2).map(i => i.id)
      return favIds.map(id => ({ id: `fav_${id}`, user_id: userId, item_type: 'market_item', item_id: id, created_at: new Date().toISOString() }))
    }
    let query = db().from('favorites').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (itemType) query = query.eq('item_type', itemType)
    const { data } = await query
    return data || []
  },

  async toggle(userId: string, itemType: string, itemId: string, isFavorited: boolean) {
    if (useMock()) return { success: true }
    if (isFavorited) {
      const { error } = await db().from('favorites').delete().eq('user_id', userId).eq('item_type', itemType).eq('item_id', itemId)
      return { success: !error }
    } else {
      const { error } = await db().from('favorites').insert({ user_id: userId, item_type: itemType, item_id: itemId })
      return { success: !error }
    }
  },
}

// ============================================================
// 消息/私信 API
// ============================================================

export const messageApi = {
  async list(userId: string) {
    if (useMock()) {
      await delay(200)
      return []
    }
    const { data } = await db().from('messages').select('*, sender:profiles!sender_id(*)').eq('receiver_id', userId).order('created_at', { ascending: false })
    return data || []
  },

  async send(message: { sender_id: string; receiver_id: string; content: string; related_item_id?: string }) {
    if (useMock()) return { success: true }
    const { error } = await db().from('messages').insert(message)
    return { success: !error }
  },
}

// ============================================================
// 用户列表 API（用于查找卖家/跑腿者信息）
// ============================================================

export async function getUserById(userId: string): Promise<Profile | null> {
  if (useMock()) {
    return mockUsers.find(u => u.id === userId) || null
  }
  const { data } = await db().from('profiles').select('*').eq('id', userId).single()
  return data
}
