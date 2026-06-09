// ============================================================
// 我的跑腿订单 - 我发布的 + 我接单的
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { errandApi } from '@/lib/api'
import type { ErrandOrder } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, formatDate, getStatusLabel } from '@/lib/utils'

type TabType = 'published' | 'accepted'

export default function MyOrders() {
  const nav = useNavigate()
  const { currentUser } = useStore()
  const [tab, setTab] = useState<TabType>('published')
  const [published, setPublished] = useState<ErrandOrder[]>([])
  const [accepted, setAccepted] = useState<ErrandOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?.id) return
    errandApi.getMyOrders(currentUser.id).then(data => {
      setPublished(data.published)
      setAccepted(data.accepted)
      setLoading(false)
    })
  }, [currentUser?.id])

  const tabs = [
    { key: 'published' as TabType, label: '我发布的', count: published.length },
    { key: 'accepted' as TabType, label: '我接单的', count: accepted.length },
  ]

  const renderOrders = (orders: typeof published, isPublisher: boolean) => {
    if (orders.length === 0) {
      return <EmptyState icon="📋" title={isPublisher ? '还没有发布跑腿需求' : '还没有接过单'} description={isPublisher ? '去发布你的第一个跑腿需求吧' : '去跑腿首页看看有没有合适的订单'} action={isPublisher ? { label: '发布需求', onClick: () => nav('/errand/publish') } : undefined} />
    }

    return orders.map(order => {
      const statusInfo = getStatusLabel(order.status)
      return (
        <Card key={order.id} onClick={() => nav(`/errand/${order.id}`)} className="!p-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">{order.category === '代取快递' ? '📦' : order.category === '代买饭' ? '🍱' : '📝'}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary">{order.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-warning">{formatPrice(order.reward)}</span>
                <Badge variant={order.status === 'completed' ? 'success' : order.status === 'open' ? 'primary' : 'warning'}>
                  {statusInfo.text}
                </Badge>
              </div>
              {!isPublisher && order.publisher && (
                <p className="text-xs text-text-tertiary mt-0.5">发布者: {order.publisher.nickname}</p>
              )}
              {isPublisher && order.runner && (
                <p className="text-xs text-text-tertiary mt-0.5">接单者: {order.runner.nickname}</p>
              )}
              <p className="text-xs text-text-tertiary">{formatDate(order.created_at)}</p>
            </div>
          </div>
        </Card>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {loading ? <Loading text="加载订单..." /> : (
      <div className="space-y-2">
        {tab === 'published' ? renderOrders(published, true) : renderOrders(accepted, false)}
      </div>)}
    </div>
  )
}
