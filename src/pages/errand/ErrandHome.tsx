// ============================================================
// 跑腿服务首页 - 浏览需求 + 接单
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/common/SearchBar'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { errandApi } from '@/lib/api'
import { useStore } from '@/lib/store'
import type { ErrandOrder, ErrandCategory } from '@/types'
import { formatPrice, formatDate, getStatusLabel } from '@/lib/utils'

const categories: { key: ErrandCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: '代取快递', label: '代取快递', icon: '📦' },
  { key: '代买饭', label: '代买饭', icon: '🍱' },
  { key: '代办事情', label: '代办', icon: '📝' },
  { key: '其他', label: '其他', icon: '📌' },
]

export default function ErrandHome() {
  const nav = useNavigate()
  const { currentUser, showToast } = useStore()
  const [category, setCategory] = useState<ErrandCategory | 'all'>('all')
  const [keyword, setKeyword] = useState('')
  const [orders, setOrders] = useState<ErrandOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const data = await errandApi.list({ category: category === 'all' ? undefined : category, keyword: keyword || undefined })
    setOrders(data)
    setLoading(false)
  }, [category, keyword])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const openOrders = orders.filter(o => o.status === 'open')

  return (
    <div className="space-y-4">
      {/* 搜索 + 发布 */}
      <div className="flex items-center gap-2">
        <div className="flex-1"><SearchBar placeholder="搜索跑腿需求..." onSearch={setKeyword} /></div>
        <button onClick={() => nav('/errand/publish')}
          className="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-2xl text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          发布
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button key={cat.key} onClick={() => setCategory(cat.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95 ${
              category === cat.key ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-secondary border border-border/50'
            }`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-3 text-center bg-gradient-to-br from-orange-50 to-yellow-50">
          <p className="text-2xl font-bold text-warning">{openOrders.length}</p>
          <p className="text-xs text-text-tertiary">可接单</p>
        </Card>
        <Card className="!p-3 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === 'accepted' || o.status === 'in_progress').length}</p>
          <p className="text-xs text-text-tertiary">进行中</p>
        </Card>
        <Card className="!p-3 text-center bg-gradient-to-br from-green-50 to-emerald-50">
          <p className="text-2xl font-bold text-success">{orders.filter(o => o.status === 'completed').length}</p>
          <p className="text-xs text-text-tertiary">已完成</p>
        </Card>
      </div>

      {/* 我的订单入口 */}
      <button onClick={() => nav('/errand/orders')}
        className="w-full p-3 bg-white rounded-2xl border border-border/50 flex items-center justify-between hover:bg-gray-50 active:scale-[0.98] transition-all">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-sm font-medium text-text-primary">我的跑腿订单</span>
        </div>
        <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 订单列表 */}
      {loading ? <Loading text="加载订单..." /> :
      orders.length === 0 ? (
        <EmptyState icon="🏃" title="暂无跑腿订单" description="发布你的第一个跑腿需求吧" action={{ label: '发布需求', onClick: () => nav('/errand/publish') }} />
      ) : (
        <div className="space-y-2">
          {orders.map(order => {
            const statusInfo = getStatusLabel(order.status)
            return (
              <Card key={order.id} onClick={() => nav(`/errand/${order.id}`)} className="!p-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{order.category === '代取快递' ? '📦' : order.category === '代买饭' ? '🍱' : '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text-primary">{order.title}</h3>
                      <Badge variant={order.status === 'open' ? 'primary' : order.status === 'completed' ? 'success' : 'warning'}>
                        {statusInfo.text}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{order.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-sm font-bold text-warning">{formatPrice(order.reward)}</span>
                      {order.deadline && <span className="text-xs text-text-tertiary">⏰ {formatDate(order.deadline)}截止</span>}
                    </div>
                  </div>
                  {order.status === 'open' && (
                    <button onClick={async e => {
                      e.stopPropagation()
                      if (!currentUser?.id) return showToast('请先登录', 'error')
                      const result = await errandApi.accept(order.id, currentUser.id)
                      if (result.success) {
                        showToast('接单成功！请查看详情', 'success')
                        fetchOrders()
                      } else {
                        showToast(result.error || '接单失败', 'error')
                      }
                    }}
                      className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark active:scale-90 transition-all">
                      接单
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
