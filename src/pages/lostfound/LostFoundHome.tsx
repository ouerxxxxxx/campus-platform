// ============================================================
// 失物招领首页 - 分类浏览 + 搜索 + 校园地图入口
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/common/SearchBar'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { lostFoundApi } from '@/lib/api'
import { useStore } from '@/lib/store'
import type { LostFoundItem } from '@/types'
import { formatDate, getStatusLabel } from '@/lib/utils'

export default function LostFoundHome() {
  const nav = useNavigate()
  const { showToast } = useStore()
  const [tab, setTab] = useState<'all' | 'lost' | 'found'>('all')
  const [keyword, setKeyword] = useState('')
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [loading, setLoading] = useState(true)

  const counts = { all: items.length, lost: items.filter(i => i.type === 'lost').length, found: items.filter(i => i.type === 'found').length }

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const data = await lostFoundApi.list({ type: tab === 'all' ? undefined : tab, keyword: keyword || undefined })
    setItems(data)
    setLoading(false)
  }, [tab, keyword])

  useEffect(() => { fetchItems() }, [fetchItems])

  return (
    <div className="space-y-4">
      {/* 搜索 + 发布 */}
      <div className="flex items-center gap-2">
        <div className="flex-1"><SearchBar placeholder="搜索物品或地点..." onSearch={setKeyword} /></div>
        <button onClick={() => nav('/lostfound/publish')}
          className="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-2xl text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          发布
        </button>
      </div>

      {/* Tab切换 */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {(['all', 'lost', 'found'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t ? 'bg-white text-primary shadow-sm' : 'text-text-tertiary'
            }`}>
            {t === 'all' ? `全部 (${counts.all})` : t === 'lost' ? `寻物启事 (${counts.lost})` : `失物招领 (${counts.found})`}
          </button>
        ))}
      </div>

      {/* 校园地图入口 */}
      <button onClick={() => showToast('校园地图功能即将上线', 'info')}
        className="w-full p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl text-left flex items-center gap-3 hover:shadow-md transition-all active:scale-[0.98]">
        <span className="text-2xl">🗺️</span>
        <div>
          <p className="text-sm font-medium text-text-primary">校园地图</p>
          <p className="text-xs text-text-tertiary">查看失物招领的地点分布</p>
        </div>
      </button>

      {/* 列表 */}
      {loading ? <Loading text="加载中..." /> :
      items.length === 0 ? (
        <EmptyState icon="🔍" title="暂无相关信息" description="去发布失物招领或寻物启事吧" action={{ label: '立即发布', onClick: () => nav('/lostfound/publish') }} />
      ) : (
        <div className="space-y-2">
          {items.map(item => {
            const status = getStatusLabel(item.type)
            return (
              <Card key={item.id} onClick={() => nav(`/lostfound/${item.id}`)} className="!p-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.type === 'lost' ? '😢' : '😊'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text-primary">{item.item_name}</h3>
                      <Badge variant={item.type === 'lost' ? 'danger' : 'success'}>{status.text}</Badge>
                      {item.status === 'resolved' && <Badge variant="success">已解决</Badge>}
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-text-tertiary">📍 {item.location}</span>
                      <span className="text-xs text-text-tertiary">🕐 {formatDate(item.created_at)}</span>
                      <span className="text-xs text-text-tertiary">👁 {item.views}</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
