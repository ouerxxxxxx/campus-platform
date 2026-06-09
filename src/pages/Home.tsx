import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { marketApi, newsApi, treeholeApi } from '@/lib/api'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import type { MarketItem, NewsArticle, TreeHolePost } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { ShoppingBag, Search, Bike, MessageCircleMore, Newspaper, Package, ClipboardList, Megaphone, ChevronRight, Sparkles, GraduationCap } from 'lucide-react'

/** 快捷入口 */
function QuickEntry({ icon: Icon, label, path, color }: { icon: React.ElementType; label: string; path: string; color: string }) {
  const nav = useNavigate()
  return (
    <button onClick={() => nav(path)} className="flex flex-col items-center gap-2 group">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-all group-active:scale-95`}>
        <Icon className="w-6 h-6" strokeWidth={2} />
      </div>
      <span className="text-[11px] text-text-primary font-medium">{label}</span>
    </button>
  )
}

export default function Home() {
  const nav = useNavigate()
  const { isLoggedIn, currentUser } = useStore()
  const [marketItems, setMarketItems] = useState<MarketItem[]>([])
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([])
  const [treeholeItems, setTreeholeItems] = useState<TreeHolePost[]>([])

  useEffect(() => {
    Promise.all([
      marketApi.list({ status: 'active' }),
      newsApi.list(),
      treeholeApi.list({ sort: 'hot' }),
    ]).then(([market, news, treehole]) => {
      setMarketItems(market.slice(0, 4))
      setNewsItems(news.slice(0, 3))
      setTreeholeItems(treehole.slice(0, 3))
    })
  }, [])

  const moodIcons: Record<string, string> = {
    '开心': '😄', '难过': '😢', '吐槽': '😤', '求助': '🤔',
  }

  const catIcons: Record<string, string> = {
    '数码': '💻', '书籍': '📚', '衣物': '👔', '运动': '⚽', '生活用品': '🏠',
  }

  return (
    <div className="space-y-6 pb-2">
      {/* 顶部 Banner — 纯白卡片 */}
      <Card className="!p-5 !border-0 !rounded-[20px] bg-white">
        {isLoggedIn && currentUser ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-primary-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-[17px] font-bold text-text-primary leading-tight tracking-[-0.01em]">
                  你好，{currentUser.nickname || currentUser.real_name}
                </h1>
                <p className="text-xs text-text-tertiary">{currentUser.major} · {currentUser.grade}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-1 py-2 rounded-xl bg-[#F2F2F7]">
              <StatBadge label="信誉分" value={String(currentUser.points)} />
              <StatBadge label="已认证" value="✅" />
              <StatBadge label="学号" value={currentUser.student_id} />
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-bg flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-7 h-7 text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-[17px] font-bold text-text-primary mb-1">校园综合服务平台</h1>
            <p className="text-sm text-text-tertiary mb-4">一站式校园生活服务</p>
            <div className="flex gap-2 justify-center">
              <Button variant="primary" size="sm" onClick={() => nav('/login')}>登录</Button>
              <Button variant="outline" size="sm" onClick={() => nav('/register')}>注册</Button>
            </div>
          </div>
        )}
      </Card>

      {/* 快捷入口 — 圆形图标 */}
      <Section title="校园服务">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          <QuickEntry icon={ShoppingBag} label="二手市场" color="bg-[#FFF2E5] text-[#FF9500]" path="/market" />
          <QuickEntry icon={Search} label="失物招领" color="bg-[#E8FBF5] text-[#34C759]" path="/lostfound" />
          <QuickEntry icon={Bike} label="校园跑腿" color="bg-[#E8F2FF] text-[#007AFF]" path="/errand" />
          <QuickEntry icon={MessageCircleMore} label="树洞" color="bg-[#F3E8FF] text-[#AF52DE]" path="/treehole" />
          <QuickEntry icon={Newspaper} label="校园资讯" color="bg-[#FFE8E5] text-[#FF3B30]" path="/news" />
          <QuickEntry icon={Package} label="发布物品" color="bg-[#E8FAFF] text-[#5AC8FA]" path="/market/publish" />
          <QuickEntry icon={ClipboardList} label="发布跑腿" color="bg-[#FFF5E5] text-[#FF9500]" path="/errand/publish" />
          <QuickEntry icon={Megaphone} label="失物发布" color="bg-[#E8F5FF] text-[#5856D6]" path="/lostfound/publish" />
        </div>
      </Section>

      {/* 最新资讯 */}
      <Section title="最新资讯" action={() => nav('/news')}>
        <div className="space-y-2">
          {newsItems.map(n => (
            <Card key={n.id} onClick={() => nav(`/news/${n.id}`)} className="!p-3.5 !rounded-[14px]">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-10 rounded-full flex-shrink-0 ${n.is_official ? 'bg-danger' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-text-primary line-clamp-1">{n.title}</h3>
                  <p className="text-xs text-text-tertiary mt-0.5">{n.source} · {formatDate(n.created_at)}</p>
                </div>
                <Badge variant={n.is_official ? 'danger' : 'primary'} className="!text-[10px]">{n.category}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 热门二手 */}
      <Section title="热门二手" action={() => nav('/market')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {marketItems.map(item => (
            <Card key={item.id} onClick={() => nav(`/market/${item.id}`)} className="!p-0 !rounded-[14px] overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-[#F2F2F7] to-[#E5E5EA] flex items-center justify-center text-3xl">
                {catIcons[item.category] || '📦'}
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-medium text-text-primary line-clamp-1">{item.title}</h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-danger">{formatPrice(item.price)}</span>
                  <span className="text-[10px] text-text-tertiary">{item.views}次浏览</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 树洞热帖 */}
      <Section title="树洞热帖" action={() => nav('/treehole')}>
        <div className="space-y-2">
          {treeholeItems.map(post => (
            <Card key={post.id} onClick={() => nav(`/treehole/${post.id}`)} className="!p-3.5 !rounded-[14px]">
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0 mt-0.5">{moodIcons[post.mood] || '💬'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-xs text-text-tertiary">👍 {post.likes_count}</span>
                    <span className="text-xs text-text-tertiary">💬 {post.comments_count}</span>
                    <span className="text-xs text-text-tertiary">{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, action, children }: { title: string; action?: () => void; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-[15px] font-semibold text-text-primary tracking-[-0.01em]">{title}</h2>
        {action && (
          <button onClick={action} className="flex items-center gap-0.5 text-xs text-primary font-medium hover:opacity-80 transition-opacity">
            全部 <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-[15px] font-bold text-text-primary">{value}</div>
      <div className="text-[10px] text-text-tertiary">{label}</div>
    </div>
  )
}
