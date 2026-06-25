import { AlertCircle } from 'lucide-react'
import './TextField.css'

export function TextField({
  label,
  name,
  type,
  autoComplete,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  disabled,
  maxLength, // 1. Agregamos maxLength acá
}) {
  const id = `field-${name}`
  const errorId = `${id}-error`

  return (
    <div className="text-field">
      <label htmlFor={id} className="text-field__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={['text-field__input', error ? 'text-field__input--error' : '']
          .filter(Boolean)
          .join(' ')}
      />
      {error && (
        <p id={errorId} role="alert" className="text-field__error">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}
