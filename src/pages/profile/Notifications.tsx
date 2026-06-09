// ============================================================
// 消息通知页面
// ============================================================

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { notificationApi } from '@/lib/api'
import type { Notification } from '@/types'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { formatDate } from '@/lib/utils'

export default function Notifications() {
  const { currentUser } = useStore()
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser?.id) return
    notificationApi.list(currentUser.id).then(data => { setNotifs(data); setLoading(false) })
  }, [currentUser?.id])

  const handleClick = (n: Notification) => {
    if (!n.is_read) {
      notificationApi.markRead([n.id])
      setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item))
    }
  }

  if (loading) return <Loading text="加载通知..." />
  if (notifs.length === 0) {
    return <EmptyState icon="🔔" title="暂无消息通知" description="当有新的交易消息或系统通知时，会在这里显示" />
  }

  const typeIcons: Record<string, string> = {
    system: '📢',
    market: '🛒',
    errand: '🏃',
    message: '💬',
  }

  return (
    <div className="space-y-2">
      {notifs.map(n => (
        <Card key={n.id} padding onClick={() => handleClick(n)} className={`!p-3 ${!n.is_read ? 'border-l-4 border-l-primary' : ''}`}>
          <div className="flex items-start gap-3">
            <span className="text-xl">{typeIcons[n.type] || '📌'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-text-primary">{n.title}</h3>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </div>
              {n.content && <p className="text-xs text-text-secondary mt-0.5">{n.content}</p>}
              <p className="text-xs text-text-tertiary mt-1">{formatDate(n.created_at)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
