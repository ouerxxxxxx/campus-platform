// ============================================================
// Zustand 全局状态管理
// 对接 Supabase Auth → 无配置时自动降级为 Mock
// ============================================================

import { create } from 'zustand'
import type { Profile } from '@/types'
import { authApi, updateProfile as updateProfileApi } from './api'

interface ToastMsg {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AppState {
  // 认证状态
  isLoggedIn: boolean
  currentUser: Profile | null
  isAuthLoading: boolean

  // 登录/注册/登出
  login: (emailOrStudentId: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { studentId: string; name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  initAuth: () => Promise<void>

  // Toast消息
  toasts: ToastMsg[]
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void

  // PWA安装状态
  isPWAInstallable: boolean
  setPWAInstallable: (val: boolean) => void
}

let toastCounter = 0

export const useStore = create<AppState>((set, get) => ({
  // 认证初始状态
  isLoggedIn: false,
  currentUser: null,
  isAuthLoading: true,

  /** 初始化认证 - 检查已有会话 */
  initAuth: async () => {
    try {
      const user = await authApi.getSession()
      if (user) {
        set({ isLoggedIn: true, currentUser: user, isAuthLoading: false })
      } else {
        // 没有会话 → 显示登录/注册页
        set({ isAuthLoading: false })
      }
    } catch {
      set({ isAuthLoading: false })
    }
  },

  /** 登录 - 支持邮箱或学号 */
  login: async (emailOrStudentId: string, password: string) => {
    const result = await authApi.signIn(emailOrStudentId, password)
    if (result.success && result.user) {
      set({ isLoggedIn: true, currentUser: result.user, isAuthLoading: false })
      return { success: true }
    }
    return { success: false, error: result.error || '登录失败' }
  },

  /** 注册 - 学号 + 姓名 + 邮箱 + 密码 */
  register: async ({ studentId, name, email, password }) => {
    // 前端验证
    if (!/^\d{6,10}$/.test(studentId)) {
      return { success: false, error: '学号格式不正确，请输入6-10位数字' }
    }
    if (!email.endsWith('.edu.cn')) {
      return { success: false, error: '请使用学校邮箱注册（@*.edu.cn）' }
    }
    if (password.length < 6) {
      return { success: false, error: '密码至少6位' }
    }

    const result = await authApi.signUp({ studentId, name, email, password })
    if (result.success && result.user) {
      set({ isLoggedIn: true, currentUser: result.user, isAuthLoading: false })
      return { success: true }
    }
    return { success: false, error: result.error || '注册失败' }
  },

  /** 登出 */
  logout: async () => {
    await authApi.signOut()
    set({ isLoggedIn: false, currentUser: null })
  },

  /** 更新个人资料（乐观更新 + 失败回滚） */
  updateProfile: async (data) => {
    const user = get().currentUser
    if (!user) return
    const prevUser = { ...user }
    // 乐观更新
    set({ currentUser: { ...user, ...data, updated_at: new Date().toISOString() } })
    // 调用 API 持久化
    const result = await updateProfileApi(user.id, data)
    if (!result.success) {
      // 回滚
      set({ currentUser: prevUser })
      get().showToast('保存失败，请重试', 'error')
    }
  },

  // Toast管理
  toasts: [],
  showToast: (message, type = 'info') => {
    const id = `toast_${++toastCounter}`
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => get().removeToast(id), 3000)
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // PWA
  isPWAInstallable: false,
  setPWAInstallable: (val) => set({ isPWAInstallable: val }),
}))
