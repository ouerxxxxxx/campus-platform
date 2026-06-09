// ============================================================
// 失物招领详情页
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/common/Loading'
import { lostFoundApi } from '@/lib/api'
import type { LostFoundItem } from '@/types'
import { useStore } from '@/lib/store'
import { formatDate, getStatusLabel, getAvatarColor, getInitials } from '@/lib/utils'

export default function LostFoundDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { currentUser, showToast } = useStore()
  const [item, setItem] = useState<LostFoundItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    lostFoundApi.getById(id).then(data => { setItem(data); setLoading(false) })
  }, [id])

  if (loading) return <Loading text="加载中..." />
  if (!item) return <Loading text="信息不存在" />

  const isOwner = currentUser?.id === item.user_id
  const typeInfo = getStatusLabel(item.type)
  const user = item.user

  const handleResolve = () => {
    showToast('已标记为已解决', 'success')
  }

  return (
    <div className="space-y-4">
      {/* 类型标签 */}
      <div className="flex items-center gap-3">
        <Badge variant={item.type === 'lost' ? 'danger' : 'success'} className="!text-sm !px-3 !py-1">
          {typeInfo.text}
        </Badge>
        {item.status === 'resolved' ? (
          <Badge variant="success" className="!text-sm !px-3 !py-1">✅ 已解决</Badge>
        ) : (
          <Badge variant="primary" className="!text-sm !px-3 !py-1">进行中</Badge>
        )}
      </div>

      {/* 物品名称 */}
      <h1 className="text-xl font-bold text-text-primary">{item.item_name}</h1>

      {/* 详情卡片 */}
      <Card>
        <div className="space-y-3">
          <DetailRow icon="📍" label="地点" value={item.location} />
          <DetailRow icon="📅" label="日期" value={item.lost_found_date} />
          <DetailRow icon="📞" label="联系方式" value={item.contact_info} />
          <DetailRow icon="🕐" label="发布时间" value={formatDate(item.created_at)} />
          <DetailRow icon="👁" label="浏览" value={`${item.views} 次`} />
        </div>
      </Card>

      {/* 描述 */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-2">详细描述</h3>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{item.description}</p>
      </Card>

      {/* 地图位置 */}
      {item.location_coords && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-2">🗺️ 位置信息</h3>
          <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl">📍</span>
              <p className="text-xs text-text-tertiary mt-1">坐标: {item.location_coords.lat.toFixed(4)}, {item.location_coords.lng.toFixed(4)}</p>
            </div>
          </div>
        </Card>
      )}

      {/* 发布者信息 */}
      {user && (
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-3">发布者</h3>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.real_name)} flex items-center justify-center text-white font-bold`}>
              {getInitials(user.nickname || user.real_name)}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{user.nickname || user.real_name}</p>
              <p className="text-xs text-text-tertiary">{user.grade} · {user.major}</p>
            </div>
          </div>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-3 pb-4">
        {isOwner && item.status === 'open' ? (
          <Button onClick={handleResolve} variant="primary" className="flex-1">标记为已解决</Button>
        ) : (
          <Button onClick={() => showToast('已联系发布者', 'info')} className="flex-1">
            {item.type === 'found' ? '认领物品' : '我见过这个'}
          </Button>
        )}
        <Button variant="outline" onClick={() => nav('/lostfound/publish')} className="flex-shrink-0">
          我也要发布
        </Button>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6">{icon}</span>
      <span className="text-sm text-text-tertiary w-16">{label}</span>
      <span className="text-sm text-text-primary font-medium">{value}</span>
    </div>
  )
}
