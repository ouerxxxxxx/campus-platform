// ============================================================
// 树洞帖子详情页 - 查看帖子 + 匿名评论 + 点赞
// ============================================================

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/common/Loading'
import { treeholeApi } from '@/lib/api'
import type { TreeHolePost, TreeHoleComment } from '@/types'
import { useStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'

export default function TreeHoleDetail() {
  const { id } = useParams<{ id: string }>()
  const { currentUser, showToast } = useStore()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comment, setComment] = useState('')
  const [post, setPost] = useState<TreeHolePost | null>(null)
  const [comments, setComments] = useState<TreeHoleComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      treeholeApi.getById(id),
      treeholeApi.getComments(id),
    ]).then(([p, c]) => {
      setPost(p)
      setComments(c)
      setLoading(false)
    })
  }, [id])

  if (loading) return <Loading text="加载帖子..." />
  if (!post) return <Loading text="帖子不存在" />

  const totalLikes = post.likes_count + likesCount

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikesCount(c => c - 1)
    } else {
      setLiked(true)
      setLikesCount(c => c + 1)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) {
      showToast('请输入评论内容', 'error')
      return
    }
    if (!currentUser?.id || !id) return
    await treeholeApi.addComment({ post_id: id, user_id: currentUser.id, content: comment.trim(), is_anonymous: true })
    showToast('评论发布成功（匿名）', 'success')
    setComment('')
    // 刷新评论
    treeholeApi.getComments(id).then(setComments)
  }

  return (
    <div className="space-y-4">
      {/* 帖子内容 */}
      <Card className="!p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">
            {post.mood === '开心' ? '😄' : post.mood === '难过' ? '😢' : post.mood === '吐槽' ? '😤' : post.mood === '求助' ? '🤔' : '💬'}
          </span>
          <Badge variant={post.mood === '吐槽' ? 'danger' : post.mood === '求助' ? 'warning' : 'primary'}>
            {post.mood}
          </Badge>
          <span className="text-xs text-text-tertiary">🛡️ 匿名</span>
        </div>

        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.tags.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-text-tertiary">#{tag}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
          <button onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-all active:scale-90 ${liked ? 'text-primary font-medium' : 'text-text-tertiary'}`}>
            <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            赞 {totalLikes}
          </button>
          <span className="text-xs text-text-tertiary">💬 {comments.length} 条评论</span>
          <span className="text-xs text-text-tertiary">{formatDate(post.created_at)}</span>
        </div>
      </Card>

      {/* 评论区 */}
      <Card className="!p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          评论 ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-4">暂无评论，来发表第一条吧</p>
        ) : (
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-2 pb-3 border-b border-border/30 last:border-0">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-purple-500 font-bold">匿</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary">匿名用户</span>
                    <span className="text-xs text-text-tertiary">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-text-primary mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 评论输入 */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-purple-500 font-bold">匿</span>
          </div>
          <div className="flex-1 relative">
            <input
              className="w-full pl-3 pr-16 py-2 rounded-xl bg-gray-100 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all"
              placeholder="匿名评论..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-all">
              发送
            </button>
          </div>
        </div>
      </Card>

      <div className="pb-4 text-center">
        <p className="text-xs text-text-tertiary">🛡️ 树洞内容均为匿名发布，请保持友善</p>
      </div>
    </div>
  )
}
