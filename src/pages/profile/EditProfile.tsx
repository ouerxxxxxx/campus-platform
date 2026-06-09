// ============================================================
// 编辑个人资料
// ============================================================

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const nav = useNavigate()
  const { currentUser, updateProfile, showToast } = useStore()

  const [form, setForm] = useState({
    nickname: currentUser?.nickname || '',
    grade: currentUser?.grade || '',
    major: currentUser?.major || '',
    dormitory: currentUser?.dormitory || '',
    bio: currentUser?.bio || '',
  })

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = () => {
    updateProfile(form)
    showToast('资料更新成功！', 'success')
    nav(-1)
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* 头像区域 */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white mb-2">
          {(currentUser?.nickname || currentUser?.real_name || '我').slice(0, 1)}
        </div>
        <button onClick={() => showToast('头像上传功能即将上线', 'info')} className="text-sm text-primary font-medium">更换头像</button>
      </div>

      <Input label="昵称" placeholder="给自己起个昵称" value={form.nickname} onChange={update('nickname')} />
      <Input label="年级" placeholder="如：2024级" value={form.grade} onChange={update('grade')} />
      <Input label="专业" placeholder="如：计算机科学与技术" value={form.major} onChange={update('major')} />
      <Input label="宿舍" placeholder="如：北区3号楼512" value={form.dormitory} onChange={update('dormitory')} />
      <Input label="个人简介" placeholder="介绍一下自己吧" value={form.bio} onChange={update('bio')} />

      <Button onClick={handleSave} className="w-full" size="lg">保存修改</Button>
    </div>
  )
}
