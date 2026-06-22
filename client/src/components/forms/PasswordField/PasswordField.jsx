import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import './PasswordField.css'

export function PasswordField({
  label,
  name,
  autoComplete,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  show,
  toggle,
  disabled,
}) {
  const id = `field-${name}`
  const errorId = `${id}-error`

  return (
    <div className="password-field">
      <label htmlFor={id} className="password-field__label">
        {label}
      </label>
      <div className="password-field__wrap">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={['password-field__input', error ? 'password-field__input--error' : '']
            .filter(Boolean)
            .join(' ')}
        />
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={show}
          className="password-field__toggle"
        >
          {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="password-field__error">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  )
}
