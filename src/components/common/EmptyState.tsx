interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-base font-semibold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-text-tertiary text-center max-w-xs mb-4">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark active:scale-95 transition-all">
          {action.label}
        </button>
      )}
    </div>
  )
}
