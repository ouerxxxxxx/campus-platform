// ============================================================
// 注册页面 - 学号+姓名+学校邮箱验证
// ============================================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'

export default function Register() {
  const nav = useNavigate()
  const { register, showToast } = useStore()
  const [form, setForm] = useState({ studentId: '', name: '', email: '', password: '', confirmPw: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.studentId.trim()) errs.studentId = '请输入学号'
    else if (!/^\d{6,10}$/.test(form.studentId)) errs.studentId = '学号格式不正确'
    if (!form.name.trim()) errs.name = '请输入真实姓名'
    if (!form.email.trim()) errs.email = '请输入邮箱'
    else if (!form.email.endsWith('.edu.cn')) errs.email = '请使用学校邮箱（@*.edu.cn）'
    if (!form.password) errs.password = '请设置密码'
    else if (form.password.length < 6) errs.password = '密码至少6位'
    if (form.password !== form.confirmPw) errs.confirmPw = '两次密码不一致'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleRegister = async () => {
    if (!validate()) return
    setLoading(true)
    const result = await register({ studentId: form.studentId, name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (result.success) {
      showToast('注册成功！欢迎加入', 'success')
      nav('/', { replace: true })
    } else {
      showToast(result.error || '注册失败', 'error')
    }
  }

  return (
    <div className="max-w-sm mx-auto pt-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-sm shadow-primary/20">
          <span className="text-white text-2xl font-bold tracking-tighter">苏</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary">苏州科技大学</h1>
        <p className="text-sm text-text-primary/70 font-medium">校园综合服务平台</p>
        <p className="text-xs text-text-tertiary mt-1.5">仅限本校学生注册</p>
      </div>

      <div className="space-y-3">
        <Input label="学号" id="studentId" placeholder="请输入学号" value={form.studentId} onChange={update('studentId')} error={errors.studentId} />
        <Input label="真实姓名" id="name" placeholder="请输入真实姓名" value={form.name} onChange={update('name')} error={errors.name} />
        <Input label="学校邮箱" id="email" type="email" placeholder="xxx@university.edu.cn" value={form.email} onChange={update('email')} error={errors.email} />
        <Input label="设置密码" id="password" type="password" placeholder="至少6位密码" value={form.password} onChange={update('password')} error={errors.password} />
        <Input label="确认密码" id="confirmPw" type="password" placeholder="再次输入密码" value={form.confirmPw} onChange={update('confirmPw')} error={errors.confirmPw} />

        <Button onClick={handleRegister} disabled={loading} className="w-full" size="lg">
          {loading ? '注册中...' : '注册'}
        </Button>
      </div>

      <p className="text-center text-sm text-text-tertiary mt-4">
        已有账号？
        <Link to="/login" className="text-primary font-medium ml-1">立即登录</Link>
      </p>

      {/* 验证说明 */}
      <div className="mt-6 p-3 bg-blue-50 rounded-xl">
        <p className="text-xs text-blue-700">
          🔒 <strong>安全提示：</strong>仅允许本校学生通过学号+学校邮箱注册。系统会验证学号与姓名的匹配性，确保校园社区的安全和纯净。
        </p>
      </div>
    </div>
  )
}
