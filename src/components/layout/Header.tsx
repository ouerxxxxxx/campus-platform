// ============================================================
// 顶部导航栏
// ============================================================

import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: { icon: string; onClick: () => void; badge?: number }
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()
  const { currentUser } = useStore()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/50 safe-top">
      <div className="flex items-center justify-between h-12 px-4 max-w-6xl mx-auto">
        {/* 左侧 */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-xl hover:bg-gray-100 active:scale-90 transition-all">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-text-primary truncate">{title}</span>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-text-primary min-w-0 max-w-[40%] truncate md:hidden">
          {title}
        </h1>

        {/* 右侧 */}
        <div className="flex items-center gap-1">
          {rightAction && (
            <button onClick={rightAction.onClick} className="relative p-1.5 rounded-xl hover:bg-gray-100 active:scale-90 transition-all">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={rightAction.icon} />
              </svg>
              {rightAction.badge && rightAction.badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {rightAction.badge > 9 ? '9+' : rightAction.badge}
                </span>
              )}
            </button>
          )}
          {currentUser && (
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-gray-100 transition-all">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {currentUser.nickname?.slice(0, 1) || currentUser.real_name?.slice(0, 1) || '我'}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
