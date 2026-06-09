// ============================================================
// 发布跑腿需求页
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import type { ErrandCategory } from '@/types'

const categories: { key: ErrandCategory; label: string; icon: string }[] = [
  { key: '代取快递', label: '代取快递', icon: '📦' },
  { key: '代买饭', label: '代买饭', icon: '🍱' },
  { key: '代办事情', label: '代办事情', icon: '📝' },
  { key: '其他', label: '其他', icon: '📌' },
]

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"

export default function PublishErrand() {
  const nav = useNavigate()
  const { showToast } = useStore()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '', category: '' as ErrandCategory | '', reward: '',
    pickup: '', delivery: '', deadline: '', description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = '请输入需求标题'
    if (!form.category) errs.category = '请选择分类'
    if (!form.reward || isNaN(Number(form.reward)) || Number(form.reward) <= 0) errs.reward = '请输入有效酬劳金额'
    if (!form.description.trim() || form.description.trim().length < 10) errs.description = '描述至少10个字'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    showToast('发布成功！等待同学接单', 'success')
    nav('/errand', { replace: true })
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* 分类选择 */}
      <Card className="!p-4">
        <label className="block text-sm font-medium text-text-primary mb-3">任务类型</label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => setForm(p => ({ ...p, category: cat.key }))}
              className={`p-3 rounded-2xl border-2 transition-all text-center ${
                form.category === cat.key ? 'border-primary bg-blue-50' : 'border-border hover:bg-gray-50'
              }`}>
              <span className="text-xl">{cat.icon}</span>
              <p className={`text-sm font-medium mt-0.5 ${form.category === cat.key ? 'text-primary' : 'text-text-primary'}`}>{cat.label}</p>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-xs text-danger mt-2">{errors.category}</p>}
      </Card>

      {/* 表单 */}
      <Card className="!p-5">
        <h2 className="text-base font-bold text-text-primary mb-4">🏃 填写需求</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">需求标题 <span className="text-danger">*</span></label>
            <input className={inputClass} placeholder="如：帮忙取个中通快递" value={form.title} onChange={update('title')} />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">酬劳（元） <span className="text-danger">*</span></label>
            <input className={inputClass} type="number" placeholder="如：5" value={form.reward} onChange={update('reward')} />
            {errors.reward && <p className="text-xs text-danger mt-1">{errors.reward}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">取件/起点</label>
              <input className={inputClass} placeholder="如：菜鸟驿站" value={form.pickup} onChange={update('pickup')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">送达/终点</label>
              <input className={inputClass} placeholder="如：北区3号楼" value={form.delivery} onChange={update('delivery')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">截止时间</label>
            <input className={inputClass} type="datetime-local" value={form.deadline} onChange={update('deadline')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">详细描述 <span className="text-danger">*</span></label>
            <textarea className={inputClass} rows={4}
              placeholder="详细描述需要做什么、有什么注意事项..." value={form.description} onChange={update('description')} />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
          </div>
        </div>
      </Card>

      <div className="p-3 bg-orange-50 rounded-xl text-xs text-orange-700">
        💡 <strong>提示：</strong>请合理设置酬劳，交易完成后双方可互相评价。请遵守校园规定，不发布违规内容。
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
        {loading ? '发布中...' : '发布跑腿需求'}
      </Button>
    </div>
  )
}
