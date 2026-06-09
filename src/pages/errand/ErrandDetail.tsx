// ============================================================
// 跑腿订单详情页 - 查看详情、接单、评价
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/common/Loading'
import { errandApi } from '@/lib/api'
import type { ErrandOrder } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, formatDate, getStatusLabel, getAvatarColor, getInitials } from '@/lib/utils'

export default function ErrandDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { currentUser, showToast } = useStore()
  const [rating, setRating] = useState(0)
  const [order, setOrder] = useState<ErrandOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    errandApi.getById(id).then(data => { setOrder(data); setLoading(false) })
  }, [id])

  if (loading) return <Loading text="加载订单..." />
  if (!order) return <Loading text="订单不存在" />

  const isPublisher = currentUser?.id === order.publisher_id
  const isRunner = currentUser?.id === order.runner_id
  const statusInfo = getStatusLabel(order.status)

  const handleAccept = async () => {
    if (!currentUser?.id || !id) return
    const result = await errandApi.accept(id, currentUser.id)
    if (result.success) {
      setOrder(prev => prev ? { ...prev, status: 'accepted' as const, runner_id: currentUser.id } : null)
      showToast('接单成功！请尽快完成任务', 'success')
    } else {
      showToast('接单失败，请重试', 'error')
    }
  }

  const handleComplete = async () => {
    if (!id) return
    const result = await errandApi.complete(id)
    if (result.success) {
      setOrder(prev => prev ? { ...prev, status: 'completed' as const } : null)
      showToast('订单已确认完成', 'success')
    } else {
      showToast('操作失败，请重试', 'error')
    }
  }

  const handleCancel = async () => {
    if (!id) return
    const result = await errandApi.cancel(id)
    if (result.success) {
      setOrder(prev => prev ? { ...prev, status: 'cancelled' as const } : null)
      showToast('订单已取消', 'info')
    }
  }

  const handleReview = async () => {
    if (!currentUser?.id || !id || !order?.runner_id || rating === 0) return
    const revieweeId = isPublisher ? order.runner_id : order.publisher_id
    const result = await errandApi.addReview({
      order_id: id,
      reviewer_id: currentUser.id,
      reviewee_id: revieweeId,
      rating,
    })
    if (result.success) {
      showToast('评价已提交', 'success')
    }
  }

  return (
    <div className="space-y-4">
      {/* 状态 */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{order.category === '代取快递' ? '📦' : order.category === '代买饭' ? '🍱' : '📝'}</span>
        <div>
          <h1 className="text-lg font-bold text-text-primary">{order.title}</h1>
          <Badge variant={order.status === 'open' ? 'primary' : order.status === 'completed' ? 'success' : 'warning'}>
            {statusInfo.text}
          </Badge>
        </div>
      </div>

      {/* 赏金 */}
      <Card className="!p-4 bg-gradient-to-r from-warning/10 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-tertiary">任务酬劳</p>
            <p className="text-2xl font-bold text-warning">{formatPrice(order.reward)}</p>
          </div>
          {order.deadline && (
            <div className="text-right">
              <p className="text-xs text-text-tertiary">截止时间</p>
              <p className="text-sm font-medium text-text-primary">{formatDate(order.deadline)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* 详情 */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-3">📋 任务详情</h3>
        <div className="space-y-3">
          <div className="flex gap-3"><span className="text-text-tertiary text-sm w-16">分类</span><span className="text-sm text-text-primary">{order.category}</span></div>
          {order.pickup_location && <div className="flex gap-3"><span className="text-text-tertiary text-sm w-16">取件地点</span><span className="text-sm text-text-primary">📍 {order.pickup_location}</span></div>}
          {order.delivery_location && <div className="flex gap-3"><span className="text-text-tertiary text-sm w-16">送达地点</span><span className="text-sm text-text-primary">📍 {order.delivery_location}</span></div>}
          <div className="flex gap-3"><span className="text-text-tertiary text-sm w-16">发布时间</span><span className="text-sm text-text-primary">{formatDate(order.created_at)}</span></div>
        </div>
      </Card>

      {/* 描述 */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-2">详细描述</h3>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{order.description}</p>
      </Card>

      {/* 发布者 */}
      {order.publisher && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">发布者</h3>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(order.publisher.real_name)} flex items-center justify-center text-white font-bold`}>
              {getInitials(order.publisher.nickname || order.publisher.real_name)}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{order.publisher.nickname}</p>
              <p className="text-xs text-text-tertiary">信誉分: {order.publisher.points}</p>
            </div>
          </div>
        </Card>
      )}

      {/* 接单者 */}
      {order.runner && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">接单者</h3>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(order.runner.real_name)} flex items-center justify-center text-white font-bold`}>
              {getInitials(order.runner.nickname || order.runner.real_name)}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{order.runner.nickname}</p>
              <p className="text-xs text-text-tertiary">信誉分: {order.runner.points}</p>
            </div>
          </div>
        </Card>
      )}

      {/* 评价区 */}
      {order.status === 'completed' && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">⭐ 评价</h3>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)}
                className={`text-2xl transition-all ${s <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}>★</button>
            ))}
          </div>
          <textarea className="w-full px-3 py-2 rounded-xl border border-border text-sm" rows={2} placeholder="写下你的评价..." />
          <Button size="sm" className="mt-2" onClick={handleReview}>提交评价</Button>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 pb-4">
        {order.status === 'open' && !isPublisher && (
          <Button onClick={handleAccept} className="flex-1">接单</Button>
        )}
        {(isPublisher || isRunner) && order.status === 'in_progress' && (
          <Button onClick={handleComplete} className="flex-1">确认完成</Button>
        )}
        {isPublisher && order.status === 'open' && (
          <Button variant="outline" className="flex-1" onClick={handleCancel}>取消订单</Button>
        )}
        <Button variant="outline" onClick={() => nav('/errand')} className="flex-shrink-0">
          返回列表
        </Button>
      </div>
    </div>
  )
}
