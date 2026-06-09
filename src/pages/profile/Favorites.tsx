// ============================================================
// 收藏夹页面
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { favoriteApi, marketApi, newsApi, treeholeApi } from '@/lib/api'
import type { MarketItem, NewsArticle, TreeHolePost } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, formatDate, getCategoryColor } from '@/lib/utils'

type FavTab = 'market' | 'news' | 'treehole'

export default function Favorites() {
  const nav = useNavigate()
  const { currentUser } = useStore()
  const [tab, setTab] = useState<FavTab>('market')
  const [favMarket, setFavMarket] = useState<MarketItem[]>([])
  const [favNews, setFavNews] = useState<NewsArticle[]>([])
  const [favTreehole, setFavTreehole] = useState<TreeHolePost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?.id) return
    setLoading(true)
    // 获取收藏列表，然后获取对应的详情
    favoriteApi.list(currentUser.id).then(async (favs) => {
      const marketFavs = favs.filter(f => f.item_type === 'market_item')
      const newsFavs = favs.filter(f => f.item_type === 'news_article')
      const thFavs = favs.filter(f => f.item_type === 'treehole_post')

      const [market, news, th] = await Promise.all([
        Promise.all(marketFavs.map(f => marketApi.getById(f.item_id))),
        Promise.all(newsFavs.map(f => newsApi.getById(f.item_id))),
        Promise.all(thFavs.map(f => treeholeApi.getById(f.item_id))),
      ])
      setFavMarket(market.filter(Boolean) as MarketItem[])
      setFavNews(news.filter(Boolean) as NewsArticle[])
      setFavTreehole(th.filter(Boolean) as TreeHolePost[])
      setLoading(false)
    })
  }, [currentUser?.id])

  const tabs = [
    { key: 'market' as FavTab, label: '二手', count: favMarket.length },
    { key: 'news' as FavTab, label: '资讯', count: favNews.length },
    { key: 'treehole' as FavTab, label: '树洞', count: favTreehole.length },
  ]

  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? <Loading text="加载收藏..." /> : <>
      {tab === 'market' && (
        favMarket.length === 0 ? <EmptyState icon="❤️" title="还没有收藏二手物品" />
        : favMarket.map(item => (
          <Card key={item.id} onClick={() => nav(`/market/${item.id}`)} className="!p-3">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-danger">{formatPrice(item.price)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getCategoryColor(item.category)}`}>{item.category}</span>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}

      {tab === 'news' && (
        favNews.length === 0 ? <EmptyState icon="📰" title="还没有收藏资讯" />
        : favNews.map(n => (
          <Card key={n.id} onClick={() => nav(`/news/${n.id}`)} className="!p-3">
            <div className="flex items-start gap-2">
              <Badge variant={n.is_official ? 'danger' : 'primary'}>{n.category}</Badge>
              <div>
                <h3 className="text-sm font-medium text-text-primary">{n.title}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{formatDate(n.created_at)}</p>
              </div>
            </div>
          </Card>
        ))
      )}

      {tab === 'treehole' && (
        favTreehole.length === 0 ? <EmptyState icon="💬" title="还没有收藏树洞帖子" />
        : favTreehole.map(p => (
          <Card key={p.id} onClick={() => nav(`/treehole/${p.id}`)} className="!p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg">{p.mood === '开心' ? '😄' : '🤔'}</span>
              <div>
                <p className="text-sm text-text-primary line-clamp-2">{p.content}</p>
                <p className="text-xs text-text-tertiary mt-1">👍 {p.likes_count} · 💬 {p.comments_count}</p>
              </div>
            </div>
          </Card>
        ))
      )}
      </>}
    </div>
  )
}
