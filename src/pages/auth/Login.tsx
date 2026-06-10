// ============================================================
// 登录页面 - 支持学号+密码登录
// ============================================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'

export default function Login() {
  const nav = useNavigate()
  const { login, showToast } = useStore()
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ id?: string; pw?: string }>({})

  const handleLogin = async () => {
    const errs: typeof errors = {}
    if (!studentId.trim()) errs.id = '请输入学号'
    if (!password.trim()) errs.pw = '请输入密码'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const result = await login(studentId, password)
    setLoading(false)
    if (result.success) {
      showToast('登录成功！', 'success')
      nav('/', { replace: true })
    } else {
      showToast(result.error || '登录失败', 'error')
    }
  }

  return (
    <div className="max-w-sm mx-auto pt-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-sm shadow-primary/20">
          <span className="text-white text-2xl font-bold tracking-tighter">苏</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary">苏州科技大学</h1>
        <p className="text-sm text-text-primary/70 font-medium">校园综合服务平台</p>
        <p className="text-xs text-text-tertiary mt-1.5">使用学号登录</p>
      </div>

      <div className="space-y-4">
        <Input
          label="学号" id="studentId" placeholder="请输入学号（如：2024001）"
          value={studentId} onChange={e => setStudentId(e.target.value)}
          error={errors.id}
        />
        <Input
          label="密码" id="password" type="password" placeholder="请输入密码"
          value={password} onChange={e => setPassword(e.target.value)}
          error={errors.pw}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <Button onClick={handleLogin} disabled={loading} className="w-full" size="lg">
          {loading ? '登录中...' : '登录'}
        </Button>
      </div>

      <p className="text-center text-sm text-text-tertiary mt-6">
        还没有账号？
        <Link to="/register" className="text-primary font-medium ml-1">立即注册</Link>
      </p>
    </div>
  )
}
