// ============================================================
// 校园树洞首页 - 匿名发帖 + 浏览 + 心情筛选
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { treeholeApi } from '@/lib/api'
import type { TreeHolePost } from '@/types'
import { useStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'

const moods = [
  { key: 'all', label: '全部', icon: '💬' },
  { key: '开心', label: '开心', icon: '😄' },
  { key: '难过', label: '难过', icon: '😢' },
  { key: '吐槽', label: '吐槽', icon: '😤' },
  { key: '求助', label: '求助', icon: '🤔' },
]

const sortOptions = [
  { key: 'latest', label: '最新' },
  { key: 'hot', label: '最热' },
]

export default function TreeHoleHome() {
  const nav = useNavigate()
  const { currentUser, showToast } = useStore()
  const [mood, setMood] = useState('all')
  const [sort, setSort] = useState<'latest' | 'hot'>('latest')
  const [content, setContent] = useState('')
  const [showPublish, setShowPublish] = useState(false)
  const [posts, setPosts] = useState<TreeHolePost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const data = await treeholeApi.list({ mood: mood === 'all' ? undefined : mood, sort })
    setPosts(data)
    setLoading(false)
  }, [mood, sort])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handlePublish = async () => {
    if (!content.trim()) {
      showToast('请输入内容', 'error')
      return
    }
    if (!currentUser?.id) return
    await treeholeApi.create({ user_id: currentUser.id, content: content.trim(), is_anonymous: true })
    showToast('发布成功！匿名已保护', 'success')
    setContent('')
    setShowPublish(false)
    fetchPosts() // 刷新列表
  }

  return (
    <div className="space-y-4">
      {/* 树洞说明 */}
      <Card className="!p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌳</span>
          <div>
            <h2 className="text-sm font-bold text-text-primary">校园树洞</h2>
            <p className="text-xs text-text-tertiary">匿名发帖，畅所欲言。请保持友善，尊重他人。</p>
          </div>
        </div>
      </Card>

      {/* 心情筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {moods.map(m => (
          <button key={m.key} onClick={() => setMood(m.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all active:scale-95 ${
              mood === m.key ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-secondary border border-border/50'
            }`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* 排序 + 发布切换 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {sortOptions.map(s => (
            <button key={s.key} onClick={() => setSort(s.key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                sort === s.key ? 'bg-gray-200 text-text-primary' : 'text-text-tertiary'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowPublish(!showPublish)}
          className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition-all">
          {showPublish ? '收起' : '✍️ 发帖'}
        </button>
      </div>

      {/* 发布框 */}
      {showPublish && (
        <Card className="!p-3">
          <textarea
            className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            rows={3}
            placeholder="匿名分享你的心情、吐槽或求助..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {['😄', '😢', '😤', '🤔', '😊'].map(emoji => (
                <button key={emoji} className="text-sm px-1.5 py-0.5 rounded hover:bg-gray-100">{emoji}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">🛡️ 匿名保护</span>
              <Button size="sm" onClick={handlePublish}>发布</Button>
            </div>
          </div>
        </Card>
      )}

      {/* 帖子列表 */}
      {loading ? <Loading text="加载帖子..." /> :
      posts.length === 0 ? (
        <EmptyState icon="💬" title="暂无相关帖子" description="来发布第一条树洞吧" />
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <Card key={post.id} onClick={() => nav(`/treehole/${post.id}`)} className="!p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">
                  {post.mood === '开心' ? '😄' : post.mood === '难过' ? '😢' : post.mood === '吐槽' ? '😤' : post.mood === '求助' ? '🤔' : '💬'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-3 leading-relaxed">{post.content}</p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-text-tertiary">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-text-tertiary">👍 {post.likes_count}</span>
                    <span className="text-xs text-text-tertiary">💬 {post.comments_count}</span>
                    <span className="text-xs text-text-tertiary">{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
