import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* 移动端紧凑 / 桌面端放宽 */}
      <main className="w-full max-w-md md:max-w-3xl mx-auto pb-[60px] md:pb-0 px-4 pt-3">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
