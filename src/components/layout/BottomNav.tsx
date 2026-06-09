import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { House, ShoppingBag, Bike, MessageCircleMore, User } from 'lucide-react'

const tabs = [
  { path: '/', label: '首页', Icon: House },
  { path: '/market', label: '二手', Icon: ShoppingBag },
  { path: '/errand', label: '跑腿', Icon: Bike },
  { path: '/treehole', label: '树洞', Icon: MessageCircleMore },
  { path: '/profile', label: '我的', Icon: User },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  // 子页面隐藏底部导航
  const hideNav = /^\/(market|errand|lostfound|treehole|news|profile|auth)\/([^/]+)/.test(currentPath)
  if (hideNav) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/[0.92] backdrop-blur-xl border-t border-[#E5E5EA] safe-bottom md:hidden">
      <div className="flex items-center justify-around h-[52px] max-w-lg mx-auto">
        {tabs.map(tab => {
          const isActive = tab.path === '/'
            ? currentPath === '/'
            : currentPath.startsWith(tab.path)
          const Icon = tab.Icon
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center h-full px-3 min-w-0 flex-1 relative',
                'transition-all duration-200',
                isActive ? 'text-primary' : 'text-[#8E8E93]'
              )}
            >
              <Icon className="w-[22px] h-[22px] mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn('text-[10px]', isActive && 'font-semibold')}>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary nav-dot-active" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
