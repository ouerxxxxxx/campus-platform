import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store'
import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: { icon: string; onClick: () => void; badge?: number }
}

/** 苏州科技大学 Logo */
function SustLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <img src="/favicon.svg" alt="苏州科技大学" className="w-7 h-7 rounded-lg shadow-sm shadow-primary/20" />
      <span className="text-[11px] font-semibold text-text-primary tracking-tight">苏州科技大学</span>
    </div>
  )
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()
  const { currentUser } = useStore()

  return (
    <header className="sticky top-0 z-40 bg-white/[0.92] backdrop-blur-xl border-b border-[#E5E5EA] safe-top">
      <div className="flex items-center justify-between h-11 px-4 max-w-6xl mx-auto">
        {/* 左侧 */}
        <div className="flex items-center gap-1 min-w-0">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-gray-100 active:scale-95 transition-all">
              <ChevronLeft className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </button>
          ) : (
            <SustLogo />
          )}
        </div>

        {/* 中间标题 */}
        <h1 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em] truncate text-center flex-1 px-2">
          {title}
        </h1>

        {/* 右侧 */}
        <div className="flex items-center gap-0.5 justify-end">
          {rightAction && (
            <button onClick={rightAction.onClick} className="relative p-1 rounded-lg hover:bg-gray-100 active:scale-95 transition-all">
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
            <button onClick={() => navigate('/profile')} className="flex items-center gap-1 p-0.5 rounded-lg hover:bg-gray-100 transition-all">
              <div className="w-6 h-6 rounded-full bg-primary-bg flex items-center justify-center">
                <span className="text-[11px] font-semibold text-primary">
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
