// ============================================================
// 校园资讯首页 - 分类浏览公告、活动、社团、兼职
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/common/SearchBar'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { newsApi } from '@/lib/api'
import type { NewsArticle, NewsCategory } from '@/types'
import { formatDate } from '@/lib/utils'

const categories: { key: NewsCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '📰' },
  { key: '官方公告', label: '公告', icon: '📢' },
  { key: '校园活动', label: '活动', icon: '🎉' },
  { key: '社团招新', label: '社团', icon: '👥' },
  { key: '兼职信息', label: '兼职', icon: '💼' },
]

export default function NewsHome() {
  const nav = useNavigate()
  const [category, setCategory] = useState<NewsCategory | 'all'>('all')
  const [keyword, setKeyword] = useState('')
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    const data = await newsApi.list({ category: category === 'all' ? undefined : category, keyword: keyword || undefined })
    setArticles(data)
    setLoading(false)
  }, [category, keyword])

  useEffect(() => { fetchNews() }, [fetchNews])

  return (
    <div className="space-y-4">
      <SearchBar placeholder="搜索资讯..." onSearch={setKeyword} />

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

      {/* 列表 */}
      {loading ? <Loading text="加载资讯..." /> :
      articles.length === 0 ? (
        <EmptyState icon="📰" title="暂无相关资讯" />
      ) : (
        <div className="space-y-2">
          {articles.map(article => (
            <Card key={article.id} onClick={() => nav(`/news/${article.id}`)} className="!p-3">
              <div className="flex items-start gap-3">
                <Badge variant={article.is_official ? 'danger' : 'primary'}>{article.category}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {article.is_pinned && <span className="text-xs text-danger font-medium">📌 置顶</span>}
                    <h3 className="text-sm font-medium text-text-primary line-clamp-2">{article.title}</h3>
                  </div>
                  {article.summary && (
                    <p className="text-xs text-text-secondary line-clamp-1 mt-1">{article.summary}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {article.source && <span className="text-xs text-text-tertiary">📌 {article.source}</span>}
                    <span className="text-xs text-text-tertiary">{formatDate(article.created_at)}</span>
                    <span className="text-xs text-text-tertiary">👁 {article.views}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
