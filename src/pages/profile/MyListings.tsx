// ============================================================
// 我的发布 - 查看我发布的所有物品、失物招领、跑腿订单
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { useStore } from '@/lib/store'
import { marketApi, lostFoundApi, errandApi } from '@/lib/api'
import type { MarketItem, LostFoundItem, ErrandOrder } from '@/types'
import { formatDate, getStatusLabel, formatPrice } from '@/lib/utils'

type TabType = 'market' | 'lostfound' | 'errand'

export default function MyListings() {
  const nav = useNavigate()
  const { currentUser } = useStore()
  const [tab, setTab] = useState<TabType>('market')
  const [myMarket, setMyMarket] = useState<MarketItem[]>([])
  const [myLF, setMyLF] = useState<LostFoundItem[]>([])
  const [myErrand, setMyErrand] = useState<ErrandOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?.id) return
    setLoading(true)
    Promise.all([
      marketApi.list({ status: undefined }),
      lostFoundApi.list(),
      errandApi.list(),
    ]).then(([market, lf, errand]) => {
      setMyMarket(market.filter(i => i.seller_id === currentUser.id))
      setMyLF(lf.filter(i => i.user_id === currentUser.id))
      setMyErrand(errand.filter(i => i.publisher_id === currentUser.id))
      setLoading(false)
    })
  }, [currentUser?.id])

  const tabs = [
    { key: 'market' as TabType, label: '二手物品', count: myMarket.length },
    { key: 'lostfound' as TabType, label: '失物招领', count: myLF.length },
    { key: 'errand' as TabType, label: '跑腿订单', count: myErrand.length },
  ]

  return (
    <div className="space-y-4">
      {/* Tab切换 */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* 二手物品 */}
      {tab === 'market' && (
        myMarket.length === 0 ? (
          <EmptyState icon="📦" title="还没有发布二手物品" description="去二手市场发布你的闲置物品吧" action={{ label: '去发布', onClick: () => nav('/market/publish') }} />
        ) : (
          <div className="space-y-2">
            {myMarket.map(item => {
              const status = getStatusLabel(item.status)
              return (
                <Card key={item.id} onClick={() => nav(`/market/${item.id}`)} className="!p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.category === '数码' ? '💻' : item.category === '书籍' ? '📚' : '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-danger">{formatPrice(item.price)}</span>
                        <Badge variant={item.status === 'active' ? 'success' : 'default'}>{status.text}</Badge>
                      </div>
                      <p className="text-xs text-text-tertiary mt-0.5">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )
      )}

      {/* 失物招领 */}
      {tab === 'lostfound' && (
        myLF.length === 0 ? (
          <EmptyState icon="🔍" title="还没有发布失物招领" action={{ label: '去发布', onClick: () => nav('/lostfound/publish') }} />
        ) : (
          <div className="space-y-2">
            {myLF.map(item => (
              <Card key={item.id} onClick={() => nav(`/lostfound/${item.id}`)} className="!p-3">
                <div className="flex items-start gap-2">
                  <Badge variant={item.type === 'lost' ? 'danger' : 'success'}>
                    {item.type === 'lost' ? '寻物' : '招领'}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-primary">{item.item_name}</h3>
                    <p className="text-xs text-text-tertiary">{item.location} · {formatDate(item.created_at)}</p>
                  </div>
                  <Badge variant={item.status === 'open' ? 'primary' : 'success'}>{item.status === 'open' ? '进行中' : '已解决'}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {/* 跑腿 */}
      {tab === 'errand' && (
        myErrand.length === 0 ? (
          <EmptyState icon="🏃" title="还没有发布跑腿需求" action={{ label: '去发布', onClick: () => nav('/errand/publish') }} />
        ) : (
          <div className="space-y-2">
            {myErrand.map(order => (
              <Card key={order.id} onClick={() => nav(`/errand/${order.id}`)} className="!p-3">
                <div className="flex items-start gap-2">
                  <Badge>{order.category}</Badge>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-primary">{order.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-warning">{formatPrice(order.reward)}</span>
                      <Badge variant={order.status === 'open' ? 'primary' : order.status === 'completed' ? 'success' : 'warning'}>
                        {getStatusLabel(order.status).text}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
