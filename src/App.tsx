// ============================================================
// App.tsx - 根组件，配置所有路由
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Header } from '@/components/layout/Header'
import { ToastContainer } from '@/components/common/Toast'
import { useStore } from '@/lib/store'

import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Profile from '@/pages/profile/Profile'
import EditProfile from '@/pages/profile/EditProfile'
import MyListings from '@/pages/profile/MyListings'
import Notifications from '@/pages/profile/Notifications'
import Favorites from '@/pages/profile/Favorites'
import MarketHome from '@/pages/market/MarketHome'
import MarketDetail from '@/pages/market/MarketDetail'
import PublishItem from '@/pages/market/PublishItem'
import LostFoundHome from '@/pages/lostfound/LostFoundHome'
import LostFoundDetail from '@/pages/lostfound/LostFoundDetail'
import PublishLostFound from '@/pages/lostfound/PublishLostFound'
import ErrandHome from '@/pages/errand/ErrandHome'
import ErrandDetail from '@/pages/errand/ErrandDetail'
import PublishErrand from '@/pages/errand/PublishErrand'
import MyOrders from '@/pages/errand/MyOrders'
import NewsHome from '@/pages/news/NewsHome'
import NewsDetail from '@/pages/news/NewsDetail'
import TreeHoleHome from '@/pages/treehole/TreeHoleHome'
import TreeHoleDetail from '@/pages/treehole/TreeHoleDetail'

/** 带Header的页面包裹器 */
function PageWrap({ title, showBack, rightAction, children }: {
  title: string; showBack?: boolean; children: React.ReactNode
  rightAction?: { icon: string; onClick: () => void; badge?: number }
}) {
  return (
    <>
      <Header title={title} showBack={showBack} rightAction={rightAction} />
      <div className="px-4 py-3">{children}</div>
    </>
  )
}

export default function App() {
  const { isLoggedIn, initAuth } = useStore()

  // 初始化认证：优先恢复会话，失败则自动用演示账号
  useEffect(() => {
    if (!isLoggedIn) {
      initAuth()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* 认证页 */}
        <Route path="/login" element={<PageWrap title="登录" showBack><Login /></PageWrap>} />
        <Route path="/register" element={<PageWrap title="注册" showBack><Register /></PageWrap>} />

        {/* 主应用布局 */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<PageWrap title="校园平台"><Home /></PageWrap>} />
          <Route path="market" element={<PageWrap title="二手市场"><MarketHome /></PageWrap>} />
          <Route path="market/:id" element={<PageWrap title="商品详情" showBack><MarketDetail /></PageWrap>} />
          <Route path="market/publish" element={<PageWrap title="发布物品" showBack><PublishItem /></PageWrap>} />
          <Route path="lostfound" element={<PageWrap title="失物招领"><LostFoundHome /></PageWrap>} />
          <Route path="lostfound/:id" element={<PageWrap title="详情" showBack><LostFoundDetail /></PageWrap>} />
          <Route path="lostfound/publish" element={<PageWrap title="发布信息" showBack><PublishLostFound /></PageWrap>} />
          <Route path="errand" element={<PageWrap title="校园跑腿"><ErrandHome /></PageWrap>} />
          <Route path="errand/:id" element={<PageWrap title="订单详情" showBack><ErrandDetail /></PageWrap>} />
          <Route path="errand/publish" element={<PageWrap title="发布需求" showBack><PublishErrand /></PageWrap>} />
          <Route path="errand/orders" element={<PageWrap title="我的订单" showBack><MyOrders /></PageWrap>} />
          <Route path="news" element={<PageWrap title="校园资讯"><NewsHome /></PageWrap>} />
          <Route path="news/:id" element={<PageWrap title="资讯详情" showBack><NewsDetail /></PageWrap>} />
          <Route path="treehole" element={<PageWrap title="校园树洞"><TreeHoleHome /></PageWrap>} />
          <Route path="treehole/:id" element={<PageWrap title="帖子详情" showBack><TreeHoleDetail /></PageWrap>} />
          <Route path="profile" element={<PageWrap title="个人中心"><Profile /></PageWrap>} />
          <Route path="profile/edit" element={<PageWrap title="编辑资料" showBack><EditProfile /></PageWrap>} />
          <Route path="profile/listings" element={<PageWrap title="我的发布" showBack><MyListings /></PageWrap>} />
          <Route path="profile/notifications" element={<PageWrap title="消息通知" showBack><Notifications /></PageWrap>} />
          <Route path="profile/favorites" element={<PageWrap title="我的收藏" showBack><Favorites /></PageWrap>} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
