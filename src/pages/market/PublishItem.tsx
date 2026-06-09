// ============================================================
// 发布二手物品页 - 完整的表单验证
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { marketApi } from '@/lib/api'
import type { MarketCategory, MarketItem } from '@/types'

const categories: { key: MarketCategory; label: string }[] = [
  { key: '数码', label: '💻 数码' },
  { key: '书籍', label: '📚 书籍' },
  { key: '衣物', label: '👔 衣物' },
  { key: '生活用品', label: '🏠 生活用品' },
  { key: '运动', label: '⚽ 运动' },
  { key: '其他', label: '📌 其他' },
]

const conditions = ['全新', '几乎全新', '良好', '一般']

export default function PublishItem() {
  const nav = useNavigate()
  const { showToast } = useStore()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '', category: '' as MarketCategory | '', condition: '良好',
    price: '', originalPrice: '', location: '', description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = '请输入商品标题'
    if (!form.category) errs.category = '请选择分类'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = '请输入有效价格'
    if (!form.location.trim()) errs.location = '请输入交易地点'
    if (!form.description.trim()) errs.description = '请输入商品描述（至少10字）'
    else if (form.description.trim().length < 10) errs.description = '描述至少10个字'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const { currentUser } = useStore.getState()
    if (!currentUser?.id) {
      showToast('请先登录', 'error')
      setLoading(false)
      return
    }
    const result = await marketApi.create({
      seller_id: currentUser.id,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      original_price: form.originalPrice ? Number(form.originalPrice) : null,
      category: form.category as MarketCategory,
      condition: form.condition as MarketItem['condition'],
      location: form.location.trim(),
      images: [],
      status: 'active',
    })
    setLoading(false)
    if (result.success) {
      showToast('发布成功！', 'success')
      nav('/market', { replace: true })
    } else {
      showToast(result.error || '发布失败', 'error')
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <Card className="!p-5">
        <h2 className="text-base font-bold text-text-primary mb-4">📦 发布二手物品</h2>

        <div className="space-y-4">
          {/* 图片上传区 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">商品图片（最多9张）</label>
            <div className="grid grid-cols-3 gap-2">
              <button className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-text-tertiary hover:border-primary hover:text-primary transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span className="text-xs mt-1">添加图片</span>
              </button>
            </div>
          </div>

          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">商品标题 <span className="text-danger">*</span></label>
            <input className={inputClass} placeholder="如：九成新 iPad Air 5 64G" value={form.title} onChange={update('title')} />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </div>

          {/* 分类 + 成色 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">分类 <span className="text-danger">*</span></label>
              <select className={inputClass} value={form.category} onChange={update('category')}>
                <option value="">选择分类</option>
                {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">成色</label>
              <select className={inputClass} value={form.condition} onChange={update('condition')}>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* 价格 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">售价（元） <span className="text-danger">*</span></label>
              <input className={inputClass} type="number" placeholder="0.00" value={form.price} onChange={update('price')} />
              {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">原价（元）</label>
              <input className={inputClass} type="number" placeholder="选填" value={form.originalPrice} onChange={update('originalPrice')} />
            </div>
          </div>

          {/* 交易地点 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">交易地点 <span className="text-danger">*</span></label>
            <input className={inputClass} placeholder="如：图书馆一楼、北区食堂" value={form.location} onChange={update('location')} />
            {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">商品描述 <span className="text-danger">*</span></label>
            <textarea className={inputClass} rows={4} placeholder="请详细描述商品的使用情况、购买时间、配件等..." value={form.description} onChange={update('description')} />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
          </div>
        </div>
      </Card>

      <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
        {loading ? '发布中...' : '立即发布'}
      </Button>
    </div>
  )
}
