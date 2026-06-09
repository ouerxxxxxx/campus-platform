// ============================================================
// 资讯详情页
// ============================================================

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/common/Loading'
import { newsApi } from '@/lib/api'
import type { NewsArticle } from '@/types'
import { formatDate } from '@/lib/utils'

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    newsApi.getById(id).then(data => { setArticle(data); setLoading(false) })
  }, [id])

  if (loading) return <Loading text="加载资讯..." />
  if (!article) return <Loading text="资讯不存在" />

  return (
    <div className="space-y-4">
      {/* 标题区 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={article.is_official ? 'danger' : 'primary'}>{article.category}</Badge>
          {article.is_pinned && <Badge variant="warning">📌 置顶</Badge>}
        </div>
        <h1 className="text-xl font-bold text-text-primary leading-snug">{article.title}</h1>
        <div className="flex items-center gap-3 mt-3 text-xs text-text-tertiary">
          {article.author && <span>✍️ {article.author}</span>}
          {article.source && <span>📌 {article.source}</span>}
          <span>🕐 {formatDate(article.created_at)}</span>
          <span>👁 {article.views}</span>
        </div>
      </div>

      {/* 摘要 */}
      {article.summary && (
        <Card className="!p-4 bg-blue-50 border-blue-100">
          <p className="text-sm text-text-secondary">{article.summary}</p>
        </Card>
      )}

      {/* 正文 */}
      <Card className="!p-5">
        <div
          className="prose prose-sm max-w-none text-text-primary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </Card>

      {/* 来源 */}
      <div className="text-center pb-4">
        <p className="text-xs text-text-tertiary">
          来源：{article.source || '校园综合服务平台'}
          {article.author && ` · 作者：${article.author}`}
        </p>
      </div>
    </div>
  )
}
