// ============================================================
// 发布失物招领/寻物启事
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useStore } from '@/lib/store'
import { lostFoundApi } from '@/lib/api'

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"

export default function PublishLostFound() {
  const nav = useNavigate()
  const { showToast } = useStore()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'lost' | 'found'>('lost')

  const [form, setForm] = useState({
    itemName: '', location: '', date: new Date().toISOString().split('T')[0],
    contact: '', description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.itemName.trim()) errs.itemName = '请输入物品名称'
    if (!form.location.trim()) errs.location = '请输入地点'
    if (!form.contact.trim()) errs.contact = '请填写联系方式'
    if (!form.description.trim()) errs.description = '请填写详细描述'
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
    const result = await lostFoundApi.create({
      user_id: currentUser.id,
      type,
      item_name: form.itemName.trim(),
      description: form.description.trim(),
      images: [],
      location: form.location.trim(),
      location_coords: null,
      lost_found_date: form.date,
      contact_info: form.contact.trim(),
      status: 'open',
    })
    setLoading(false)
    if (result.success) {
      showToast('发布成功！', 'success')
      nav('/lostfound', { replace: true })
    } else {
      showToast(result.error || '发布失败', 'error')
    }
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* 类型选择 */}
      <Card className="!p-4">
        <label className="block text-sm font-medium text-text-primary mb-3">发布类型</label>
        <div className="flex gap-3">
          <button onClick={() => setType('lost')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
              type === 'lost' ? 'border-danger bg-red-50' : 'border-border hover:bg-gray-50'
            }`}>
            <span className="text-2xl">😢</span>
            <p className={`text-sm font-medium mt-1 ${type === 'lost' ? 'text-danger' : 'text-text-primary'}`}>寻物启事</p>
            <p className="text-xs text-text-tertiary mt-0.5">我丢了东西</p>
          </button>
          <button onClick={() => setType('found')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
              type === 'found' ? 'border-success bg-green-50' : 'border-border hover:bg-gray-50'
            }`}>
            <span className="text-2xl">😊</span>
            <p className={`text-sm font-medium mt-1 ${type === 'found' ? 'text-success' : 'text-text-primary'}`}>失物招领</p>
            <p className="text-xs text-text-tertiary mt-0.5">我捡到东西</p>
          </button>
        </div>
      </Card>

      {/* 表单 */}
      <Card className="!p-5">
        <h2 className="text-base font-bold text-text-primary mb-4">
          {type === 'lost' ? '😢 发布寻物启事' : '😊 发布失物招领'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">物品名称 <span className="text-danger">*</span></label>
            <input className={inputClass} placeholder={type === 'lost' ? '如：黑色钱包' : '如：校园卡'} value={form.itemName} onChange={update('itemName')} />
            {errors.itemName && <p className="text-xs text-danger mt-1">{errors.itemName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">地点 <span className="text-danger">*</span></label>
              <input className={inputClass} placeholder="如：图书馆二楼" value={form.location} onChange={update('location')} />
              {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">日期</label>
              <input className={inputClass} type="date" value={form.date} onChange={update('date')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">联系方式 <span className="text-danger">*</span></label>
            <input className={inputClass} placeholder="手机号/微信/QQ" value={form.contact} onChange={update('contact')} />
            {errors.contact && <p className="text-xs text-danger mt-1">{errors.contact}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">详细描述 <span className="text-danger">*</span></label>
            <textarea className={inputClass} rows={4}
              placeholder={type === 'lost' ? '请描述物品特征、丢失时间和经过...' : '请描述捡到物品的特征、时间和地点...'}
              value={form.description} onChange={update('description')} />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
          </div>

          {/* 地图选点提示 */}
          <button type="button" onClick={() => showToast('地图选点功能即将上线', 'info')}
            className="w-full p-3 bg-gray-50 rounded-xl text-sm text-text-secondary hover:bg-gray-100 transition-all flex items-center gap-2">
            <span>🗺️</span> 在地图上选择具体位置（可选）
          </button>
        </div>
      </Card>

      <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
        {loading ? '发布中...' : '立即发布'}
      </Button>
    </div>
  )
}
