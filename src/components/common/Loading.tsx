/** 加载状态组件 */
export function Loading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-[3px] border-primary/15 border-t-primary rounded-full animate-spin" />
      <p className="mt-3 text-sm text-text-tertiary">{text}</p>
    </div>
  )
}

/** 骨架屏 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E5E5EA] rounded-lg ${className}`} />
}
