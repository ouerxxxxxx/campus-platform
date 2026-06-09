// ============================================================
// AppLayout - 整体布局包裹器
// 包含Header + 主内容区 + BottomNav + Toast
// ============================================================

import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { ToastContainer } from '../common/Toast'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="max-w-6xl mx-auto pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <ToastContainer />
    </div>
  )
}
