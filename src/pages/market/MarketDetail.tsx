// ============================================================
// 商品详情页 - 查看详情、联系卖家、收藏
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/common/Loading'
import { marketApi, favoriteApi } from '@/lib/api'
import { useStore } from '@/lib/store'
import type { MarketItem } from '@/types'
import { formatPrice, formatDate, getCategoryColor, getStatusLabel, getAvatarColor, getInitials } from '@/lib/utils'

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { currentUser, showToast } = useStore()
  const [isFav, setIsFav] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [item, setItem] = useState<MarketItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    marketApi.getById(id).then(data => { setItem(data); setLoading(false) })
  }, [id])

  if (loading) return <Loading text="加载商品信息..." />
  if (!item) return <Loading text="商品不存在" />

  const isOwner = currentUser?.id === item.seller_id
  const seller = item.seller
  const statusInfo = getStatusLabel(item.status)

  const handleFavorite = async () => {
    if (!currentUser?.id || !id) return
    const result = await favoriteApi.toggle(currentUser.id, 'market_item', id, isFav)
    if (result.success) {
      setIsFav(!isFav)
      showToast(isFav ? '已取消收藏' : '已加入收藏', 'success')
    }
  }

  const handleContact = async () => {
    if (!currentUser?.id || !item.seller_id) return
    const { messageApi } = await import('@/lib/api')
    await messageApi.send({
      sender_id: currentUser.id,
      receiver_id: item.seller_id,
      content: `我对你的商品「${item.title}」感兴趣，请问还在吗？`,
      related_item_id: id,
    })
    setShowContact(true)
    showToast('已向卖家发送私信', 'info')
  }

  const handleMarkSold = async () => {
    if (!id) return
    const newStatus = item.status === 'active' ? 'sold' : 'active'
    const result = await marketApi.update(id, { status: newStatus })
    if (result.success) {
      setItem(prev => prev ? { ...prev, status: newStatus } : null)
      showToast(newStatus === 'sold' ? '已标记为已售出' : '已重新上架', 'success')
    }
  }

  return (
    <div className="space-y-4">
      {/* 图片区 */}
      <div className="h-64 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-6xl">
        {item.category === '数码' ? '💻' : item.category === '书籍' ? '📚' : item.category === '衣物' ? '👔' : item.category === '运动' ? '⚽' : '📦'}
      </div>
      {item.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {item.images.map((img, i) => (
            <div key={i} className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-sm">📷</div>
          ))}
        </div>
      )}

      {/* 基本信息 */}
      <Card>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-lg font-bold text-text-primary flex-1">{item.title}</h1>
          <button onClick={handleFavorite} className={`p-1.5 rounded-xl transition-all ${isFav ? 'text-danger' : 'text-text-tertiary'}`}>
            <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-danger">{formatPrice(item.price)}</span>
          {item.original_price && (
            <span className="text-sm text-text-tertiary line-through">{formatPrice(item.original_price)}</span>
          )}
          <Badge variant={item.status === 'active' ? 'success' : 'default'}>{statusInfo.text}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>{item.category}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-text-secondary">{item.condition}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-text-secondary">📍 {item.location}</span>
        </div>
      </Card>

      {/* 描述 */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-2">商品描述</h3>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{item.description}</p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-xs text-text-tertiary">
          <span>👁 {item.views} 次浏览</span>
          <span>❤️ {item.favorites_count} 人收藏</span>
          <span>📅 {formatDate(item.created_at)}</span>
        </div>
      </Card>

      {/* 卖家信息 */}
      {seller && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">卖家信息</h3>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(seller.real_name)} flex items-center justify-center text-white font-bold`}>
              {getInitials(seller.nickname || seller.real_name)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{seller.nickname}</p>
              <p className="text-xs text-text-tertiary">{seller.major} · {seller.grade}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-success font-medium">信誉分: {seller.points}</p>
              <p className="text-xs text-text-tertiary">✅ 已认证</p>
            </div>
          </div>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 pb-4">
        {isOwner ? (
          <Button variant="outline" onClick={handleMarkSold} className="flex-1">
            {item.status === 'active' ? '标记为已售出' : '重新上架'}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleFavorite} className="flex-1">
              {isFav ? '已收藏' : '收藏'}
            </Button>
            <Button onClick={handleContact} className="flex-1">
              {showContact ? '已联系卖家' : '联系卖家'}
            </Button>
          </>
        )}
      </div>

      {/* 联系提示 */}
      {showContact && seller && (
        <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
          💡 已通知卖家 <strong>{seller.nickname}</strong>，请留意私信回复。建议在公共场合交易，注意安全。
        </div>
      )}
    </div>
  )
}
