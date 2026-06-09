// ============================================================
// Supabase 客户端初始化
// 仅在 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 都有效时初始化
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/** 检查Supabase是否已配置（URL以https开头且Key长度>10） */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 10)
}

/** Supabase客户端 - 仅在已配置时创建，否则为null */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null
