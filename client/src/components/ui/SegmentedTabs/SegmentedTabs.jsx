import './SegmentedTabs.css'

export function SegmentedTabs({ ariaLabel, value, onChange, options, className = '' }) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={`segmented-tabs ${className}`.trim()}>
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={['segmented-tabs__button', isActive ? 'segmented-tabs__button--active' : '']
              .filter(Boolean)
              .join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
