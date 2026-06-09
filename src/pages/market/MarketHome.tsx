// ============================================================
// 二手市场首页 - 分类浏览 + 搜索 + 商品列表
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { SearchBar } from '@/components/common/SearchBar'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { marketApi } from '@/lib/api'
import type { MarketItem, MarketCategory } from '@/types'
import { formatPrice, formatDate, getCategoryColor } from '@/lib/utils'

const categories: { key: MarketCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '📦' },
  { key: '数码', label: '数码', icon: '💻' },
  { key: '书籍', label: '书籍', icon: '📚' },
  { key: '衣物', label: '衣物', icon: '👔' },
  { key: '生活用品', label: '生活', icon: '🏠' },
  { key: '运动', label: '运动', icon: '⚽' },
  { key: '其他', label: '其他', icon: '📌' },
]

export default function MarketHome() {
  const nav = useNavigate()
  const [category, setCategory] = useState<MarketCategory | 'all'>('all')
  const [keyword, setKeyword] = useState('')
  const [items, setItems] = useState<MarketItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const data = await marketApi.list({ category: category === 'all' ? undefined : category, keyword: keyword || undefined, status: 'active' })
    setItems(data)
    setLoading(false)
  }, [category, keyword])

  useEffect(() => { fetchItems() }, [fetchItems])

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex items-center gap-2">
        <div className="flex-1"><SearchBar placeholder="搜索二手物品..." onSearch={setKeyword} /></div>
        <button onClick={() => nav('/market/publish')}
          className="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-2xl text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          发布
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95 ${
              category === cat.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-text-secondary border border-border/50 hover:bg-gray-50'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      {loading ? <Loading text="加载商品..." /> :
      items.length === 0 ? (
        <EmptyState icon="📦" title="暂无相关商品" description={keyword ? `没有找到与"${keyword}"相关的商品` : '该分类下暂无商品'} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map(item => (
            <Card key={item.id} onClick={() => nav(`/market/${item.id}`)} padding className="!p-0 overflow-hidden">
              {/* 商品图片（占位） */}
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-4xl relative">
                {item.category === '数码' ? '💻' : item.category === '书籍' ? '📚' : item.category === '衣物' ? '👔' : item.category === '运动' ? '⚽' : '📦'}
                <span className="absolute top-2 right-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>{item.category}</span>
                </span>
              </div>
              <div className="p-2.5">
                <h3 className="text-sm font-medium text-text-primary line-clamp-1">{item.title}</h3>
                <p className="text-xs text-text-tertiary line-clamp-1 mt-0.5">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-danger">{formatPrice(item.price)}</span>
                  <span className="text-xs text-text-tertiary">{item.views}次浏览</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
