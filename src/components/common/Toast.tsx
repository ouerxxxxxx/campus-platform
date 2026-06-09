// ============================================================
// Toast 消息提示组件
// ============================================================

import { useStore } from '@/lib/store'

const iconMap = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const colorMap = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  info: 'bg-text-primary text-white',
}

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm safe-top">
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`animate-slide-in flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg cursor-pointer ${colorMap[toast.type]}`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[toast.type]} />
          </svg>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
