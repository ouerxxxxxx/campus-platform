import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: boolean
}

export function Card({ children, className, onClick, padding = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[16px] border border-[#E5E5EA]',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:bg-[#F9F9FB] active:scale-[0.99]',
        padding && 'p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-center justify-between mb-3', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-semibold text-text-primary tracking-[-0.01em]', className)}>{children}</h3>
}
