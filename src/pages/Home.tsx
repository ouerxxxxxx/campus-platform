// ============================================================
// 首页 - 校园综合服务平台入口
// 展示快捷入口、最新资讯、热门二手、树洞热帖
// ============================================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { marketApi, newsApi, treeholeApi } from '@/lib/api'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import type { MarketItem, NewsArticle, TreeHolePost } from '@/types'
import { formatPrice, formatDate, getCategoryColor } from '@/lib/utils'

/** 快捷入口卡片 */
function QuickEntry({ icon, label, color, path }: { icon: string; label: string; color: string; path: string }) {
  const nav = useNavigate()
  return (
    <button onClick={() => nav(path)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${color} transition-all active:scale-95`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-text-primary">{label}</span>
    </button>
  )
}

export default function Home() {
  const nav = useNavigate()
  const { isLoggedIn, currentUser } = useStore()
  const [marketItems, setMarketItems] = useState<MarketItem[]>([])
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([])
  const [treeholeItems, setTreeholeItems] = useState<TreeHolePost[]>([])

  useEffect(() => {
    // 并行加载首页数据
    Promise.all([
      marketApi.list({ status: 'active' }),
      newsApi.list(),
      treeholeApi.list({ sort: 'hot' }),
    ]).then(([market, news, treehole]) => {
      setMarketItems(market.slice(0, 3))
      setNewsItems(news.slice(0, 3))
      setTreeholeItems(treehole.slice(0, 2))
    })
  }, [])

  return (
    <div className="space-y-5">
      {/* 顶部Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light p-5 text-white">
        <div className="relative z-10">
          {isLoggedIn && currentUser ? (
            <>
              <h1 className="text-lg font-bold mb-1">👋 欢迎回来，{currentUser.nickname || currentUser.real_name}</h1>
              <p className="text-sm text-white/80">{currentUser.major} · {currentUser.grade} · 信誉分 {currentUser.points}</p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-bold mb-1">🎓 校园综合服务平台</h1>
              <p className="text-sm text-white/80 mb-3">一站式校园生活服务，请先登录或注册</p>
              <div className="flex gap-2">
                <button onClick={() => nav('/login')} className="px-4 py-1.5 bg-white text-primary rounded-xl text-sm font-bold hover:bg-white/90 active:scale-95 transition-all">登录</button>
                <button onClick={() => nav('/register')} className="px-4 py-1.5 bg-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/30 active:scale-95 transition-all">注册</button>
              </div>
            </>
          )}
        </div>
        <div className="absolute right-2 top-2 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute right-8 bottom-2 w-12 h-12 rounded-full bg-white/5" />
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-4 gap-3">
        <QuickEntry icon="🛒" label="二手市场" color="bg-blue-50" path="/market" />
        <QuickEntry icon="🔍" label="失物招领" color="bg-green-50" path="/lostfound" />
        <QuickEntry icon="🏃" label="校园跑腿" color="bg-orange-50" path="/errand" />
        <QuickEntry icon="💬" label="树洞" color="bg-purple-50" path="/treehole" />
        <QuickEntry icon="📢" label="校园资讯" color="bg-red-50" path="/news" />
        <QuickEntry icon="📦" label="发布物品" color="bg-teal-50" path="/market/publish" />
        <QuickEntry icon="📝" label="发布跑腿" color="bg-pink-50" path="/errand/publish" />
        <QuickEntry icon="🔔" label="失物招领发布" color="bg-indigo-50" path="/lostfound/publish" />
      </div>

      {/* 最新资讯 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary">📢 最新资讯</h2>
          <button onClick={() => nav('/news')} className="text-xs text-primary font-medium">查看全部 →</button>
        </div>
        <div className="space-y-2">
          {newsItems.map(n => (
            <Card key={n.id} onClick={() => nav(`/news/${n.id}`)} padding className="!p-3">
              <div className="flex items-start gap-3">
                <Badge variant={n.is_official ? 'danger' : 'primary'}>{n.category}</Badge>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary line-clamp-2">{n.title}</h3>
                  <p className="text-xs text-text-tertiary mt-1">{n.source} · {formatDate(n.created_at)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 热门二手 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary">🛒 热门二手</h2>
          <button onClick={() => nav('/market')} className="text-xs text-primary font-medium">查看全部 →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {marketItems.map(item => (
            <Card key={item.id} onClick={() => nav(`/market/${item.id}`)} padding className="!p-3">
              <div className="h-24 bg-gray-100 rounded-xl mb-2 flex items-center justify-center text-3xl">
                {item.images[0] ? '📷' : item.category === '数码' ? '💻' : item.category === '书籍' ? '📚' : '📦'}
              </div>
              <h3 className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-sm font-bold text-danger">{formatPrice(item.price)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>{item.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 树洞热帖 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary">💬 树洞热帖</h2>
          <button onClick={() => nav('/treehole')} className="text-xs text-primary font-medium">查看全部 →</button>
        </div>
        <div className="space-y-2">
          {treeholeItems.map(post => (
            <Card key={post.id} onClick={() => nav(`/treehole/${post.id}`)} padding className="!p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">{post.mood === '开心' ? '😄' : post.mood === '吐槽' ? '😤' : post.mood === '难过' ? '😢' : '🤔'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-text-tertiary">{formatDate(post.created_at)}</span>
                    <span className="text-xs text-text-tertiary">👍 {post.likes_count}</span>
                    <span className="text-xs text-text-tertiary">💬 {post.comments_count}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="h-4" />
    </div>
  )
}
