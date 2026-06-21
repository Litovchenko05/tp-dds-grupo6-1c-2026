import './StatusBanner.css'

export function StatusBanner({ tone, icon: Icon, message, className = '' }) {
  const toneClass = tone === 'success' ? 'status-banner--success' : 'status-banner--error'

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`status-banner ${toneClass} ${className}`.trim()}
    >
      {Icon && <Icon size={18} className="status-banner__icon" aria-hidden="true" />}
      <span>{message}</span>
    </div>
  )
}
