import { useStore } from '@/lib/store'
import { CheckCircle, XCircle, Info } from 'lucide-react'

const config = {
  success: { Icon: CheckCircle, className: 'bg-success text-white' },
  error:   { Icon: XCircle,  className: 'bg-danger text-white' },
  info:    { Icon: Info,     className: 'bg-text-primary text-white' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm safe-top pointer-events-none">
      {toasts.map(toast => {
        const { Icon, className } = config[toast.type]
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`animate-slide-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm cursor-pointer ${className}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
          </div>
        )
      })}
    </div>
  )
}
