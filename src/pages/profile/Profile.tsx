// ============================================================
// 个人中心 - 用户信息展示、功能入口
// ============================================================

import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/lib/store'
import { getAvatarColor, getInitials } from '@/lib/utils'

export default function Profile() {
  const nav = useNavigate()
  const { currentUser, logout, showToast } = useStore()

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-5xl mb-4">👤</span>
        <h3 className="text-base font-semibold text-text-primary mb-2">请先登录</h3>
        <p className="text-sm text-text-tertiary mb-4">登录后即可查看个人中心</p>
        <button onClick={() => nav('/login')} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all">
          去登录
        </button>
      </div>
    )
  }

  const menuGroups = [
    {
      title: '我的服务',
      items: [
        { icon: '📦', label: '我的发布', desc: '二手物品、跑腿订单', path: '/profile/listings' },
        { icon: '🔔', label: '消息通知', desc: '系统通知、交易消息', path: '/profile/notifications', badge: 2 },
        { icon: '❤️', label: '我的收藏', desc: '收藏的物品和帖子', path: '/profile/favorites' },
      ]
    },
    {
      title: '订单管理',
      items: [
        { icon: '🏃', label: '跑腿订单', desc: '我发布和接单的跑腿', path: '/errand/orders' },
      ]
    }
  ]

  const handleLogout = () => {
    logout()
    showToast('已退出登录', 'info')
    nav('/login')
  }

  return (
    <div className="space-y-5">
      {/* 用户信息卡片 */}
      <Card className="!p-5 bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${getAvatarColor(currentUser.real_name)} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
            {getInitials(currentUser.nickname || currentUser.real_name)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{currentUser.nickname || currentUser.real_name}</h2>
            <p className="text-sm text-white/80">{currentUser.major} · {currentUser.grade}</p>
            <p className="text-xs text-white/60 mt-0.5">🏠 {currentUser.dormitory || '未设置宿舍'}</p>
          </div>
          <button onClick={() => nav('/profile/edit')} className="px-3 py-1.5 bg-white/20 rounded-xl text-xs font-medium hover:bg-white/30 transition-all">
            编辑
          </button>
        </div>
        {/* 信誉评分 */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-bold">{currentUser.points}</div>
            <div className="text-xs text-white/70">信誉分</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">✅</div>
            <div className="text-xs text-white/70">已认证</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{currentUser.student_id}</div>
            <div className="text-xs text-white/70">学号</div>
          </div>
        </div>
      </Card>

      {/* 功能菜单 */}
      {menuGroups.map(group => (
        <section key={group.title}>
          <h3 className="text-sm font-semibold text-text-secondary mb-2 px-1">{group.title}</h3>
          <Card className="!p-0 divide-y divide-border/50">
            {group.items.map(item => (
              <button
                key={item.path}
                onClick={() => nav(item.path)}
                className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 active:bg-gray-100 transition-all text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">{item.label}</div>
                  <div className="text-xs text-text-tertiary">{item.desc}</div>
                </div>
                {item.badge ? (
                  <span className="w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">{item.badge}</span>
                ) : (
                  <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </Card>
        </section>
      ))}

      {/* 退出登录 */}
      <Button variant="outline" onClick={handleLogout} className="w-full border-danger/30 text-danger hover:bg-danger hover:text-white">
        退出登录
      </Button>

      <div className="text-center pb-4 pt-2">
        <img src="/logo.png" alt="苏州科技大学" className="w-10 h-10 mx-auto mb-2 rounded-xl shadow-sm shadow-primary/10" />
        <p className="text-xs text-text-tertiary">苏州科技大学校园综合服务平台</p>
        <p className="text-[10px] text-text-tertiary/60">v1.0.0</p>
      </div>
    </div>
  )
}
