import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col">
      <main className="flex-1 w-full max-w-md md:max-w-3xl mx-auto pb-[60px] md:pb-0 px-4 pt-3">
        <Outlet />
      </main>
      {/* 底部品牌标识（桌面端可见） */}
      <footer className="hidden md:flex items-center justify-center gap-2 py-4 text-xs text-text-tertiary/50">
        <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-[8px] font-bold">苏</span>
        </div>
        苏州科技大学校园综合服务平台
      </footer>
      <BottomNav />
    </div>
  )
}
