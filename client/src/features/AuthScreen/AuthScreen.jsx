import { useEffect, useRef, useState } from 'react'
import { AlertCircle, HeartPulse, CheckCircle2, Loader2 } from 'lucide-react'
import { PasswordField } from '../../components/forms/PasswordField/PasswordField'
import { SegmentedTabs } from '../../components/ui/SegmentedTabs/SegmentedTabs'
import { StatusBanner } from '../../components/ui/StatusBanner/StatusBanner'
import { TextField } from '../../components/forms/TextField/TextField'
import './AuthScreen.css'
import axios from 'axios'

const MODE_OPTIONS = [
  { value: 'login', label: 'Iniciar sesión' },
  { value: 'register', label: 'Crear cuenta' },
]

const USER_TYPE_OPTIONS = [
  { value: 'paciente', label: 'Soy Paciente' },
  { value: 'medico', label: 'Soy Médico' },
]

export default function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [userType, setUserType] = useState('paciente')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')

  const [fields, setFields] = useState({
    name: '',
    username: '',
    dni: '',
    matricula: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const liveRegionRef = useRef(null)

  useEffect(() => {
    if (!liveRegionRef.current) return

    if (status === 'loading') {
      liveRegionRef.current.textContent =
        mode === 'login' ? 'Iniciando sesión...' : 'Creando tu cuenta...'
    } else if (status === 'success') {
      liveRegionRef.current.textContent =
        mode === 'login' ? 'Sesión iniciada correctamente.' : 'Cuenta creada correctamente.'
    } else if (status === 'error') {
      liveRegionRef.current.textContent = serverError || 'Ocurrió un error.'
    }
  }, [status, mode, serverError])

  function validateField(name, value, currentMode, allFields, currentUserType) {
    switch (name) {
      case 'name':
        if (currentMode === 'register' && !value.trim()) return 'Ingresá tu nombre completo.'
        return ''

      case 'username':
        if (!value.trim()) return 'Ingresá tu usuario.'
        if (value.length < 4) return 'El usuario debe tener al menos 4 caracteres.'
        return ''

      case 'dni':
        if (currentMode === 'register' && currentUserType === 'paciente') {
          if (!value.trim()) return 'Ingresá tu DNI.'
          if (!/^\d{7,8}$/.test(value)) {
            return 'El DNI debe tener 7 u 8 números, sin puntos.'
          }
        }
        return ''

      case 'matricula':
        if (currentMode === 'register' && currentUserType === 'medico') {
          if (!value.trim()) return 'Ingresá tu matrícula.'
          if (value.length < 4) return 'Ingresá una matrícula válida.'
        }
        return ''

      case 'password':
        if (!value) return 'Ingresá tu contraseña.'
        if (currentMode === 'register' && value.length < 8) {
          return 'La contraseña debe tener al menos 8 caracteres.'
        }
        return ''

      case 'confirmPassword':
        if (currentMode === 'register' && value !== allFields.password) {
          return 'Las contraseñas no coinciden.'
        }
        return ''

      default:
        return ''
    }
  }

  function handleChange(e) {
    const { name, value } = e.target

    setFields((current) => {
      const nextFields = { ...current, [name]: value }

      if (touched[name]) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          [name]: validateField(name, value, mode, nextFields, userType),
        }))
      }

      if (name === 'password' && touched.confirmPassword) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          confirmPassword: validateField(
            'confirmPassword',
            nextFields.confirmPassword,
            mode,
            nextFields,
            userType
          ),
        }))
      }

      return nextFields
    })
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched((currentTouched) => ({ ...currentTouched, [name]: true }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: validateField(name, value, mode, fields, userType),
    }))
  }

  function validateAll() {
    let fieldsToCheck = []

    if (mode === 'login') {
      fieldsToCheck = ['username', 'password']
    } else {
      if (userType === 'paciente') {
        fieldsToCheck = ['name', 'dni', 'username', 'password', 'confirmPassword']
      } else {
        fieldsToCheck = ['name', 'matricula', 'username', 'password', 'confirmPassword']
      }
    }

    const nextErrors = {}
    fieldsToCheck.forEach((name) => {
      const error = validateField(name, fields[name], mode, fields, userType)
      if (error) nextErrors[name] = error
    })

    setErrors(nextErrors)
    setTouched((currentTouched) => ({
      ...currentTouched,
      ...fieldsToCheck.reduce((acc, name) => ({ ...acc, [name]: true }), {}),
    }))

    return Object.keys(nextErrors).length === 0
  }

  function handleAuthError(error) {
    setStatus('error')

    if (!error.response) {
      setServerError('No pudimos procesar tu solicitud. Intentá de nuevo.')
      return
    }

    // Diccionario de estrategias según codigo HTTP
    const errorHandlers = {
      401: () => {
        setServerError('Usuario o contraseña incorrectos.')
      },
      409: () => {
        const backendErrors = error.response.data?.fields
        if (backendErrors) {
          setErrors((currentErrors) => ({ ...currentErrors, ...backendErrors }))

          const newTouched = Object.keys(backendErrors).reduce((acc, key) => {
            acc[key] = true
            return acc
          }, {})
          setTouched((currentTouched) => ({ ...currentTouched, ...newTouched }))

          setServerError('Por favor, revisá los campos marcados en rojo.')
        } else {
          setServerError('Ese nombre de usuario ya está registrado.')
        }
      },
      // Fallback para cualquier otro código (500, 400, etc.)
      default: () => {
        setServerError(error.response.data?.message || 'Error de conexión con el servidor.')
      },
    }
    const statusCode = error.response.status
    const handler = errorHandlers[statusCode] || errorHandlers.default

    handler()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    if (!validateAll()) {
      setStatus('error')
      setServerError('Revisá los campos marcados antes de continuar.')
      return
    }

    setStatus('loading')

    try {
      if (mode === 'login') {
        const params = new URLSearchParams()
        params.append('client_id', 'sweet-medical-front')
        params.append('grant_type', 'password')
        params.append('username', fields.username)
        params.append('password', fields.password)

        const response = await axios.post(
          `${process.env.REACT_APP_KEYCLOAK_URL}/realms/sweet-medical/protocol/openid-connect/token`,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        localStorage.setItem('token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
      } else {
        const payload = {
          username: fields.username,
          password: fields.password,
          name: fields.name,
          role: userType,
          ...(userType === 'paciente' ? { dni: fields.dni } : { matricula: fields.matricula }),
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/registro`, payload)

        // Auto-Login
        const authParams = new URLSearchParams()
        authParams.append('client_id', 'sweet-medical-front')
        authParams.append('grant_type', 'password')
        authParams.append('username', fields.username)
        authParams.append('password', fields.password)

        const tokenResponse = await axios.post(
          `${process.env.REACT_APP_KEYCLOAK_URL}/realms/sweet-medical/protocol/openid-connect/token`,
          authParams,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        localStorage.setItem('token', tokenResponse.data.access_token)
        localStorage.setItem('refresh_token', tokenResponse.data.refresh_token)
      }

      setStatus('success')
      // Redirección tras un breve delay para que se vea el banner verde
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch (error) {
      handleAuthError(error)
    }
  }

  function switchMode(nextMode) {
    if (nextMode === mode) return
    setMode(nextMode)
    setStatus('idle')
    setServerError('')
    setErrors({})
    setTouched({})
    setShowPassword(false)
    setShowPassword2(false)
  }

  // Si se cambia entre Médico y Paciente, limpiamos los errores para evitar mensajes residuales
  function handleUserTypeChange(type) {
    setUserType(type)
    setErrors({})
    setTouched({})
  }

  const isLogin = mode === 'login'
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  return (
    <div className="auth-root">
      <div ref={liveRegionRef} role="status" aria-live="polite" className="auth-live-region" />

      <aside className="auth-brand" aria-hidden="true">
        <div className="auth-brand__content--centered">
          <div className="auth-brand__logo-icon">
            <HeartPulse size={56} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 className="auth-brand__headline">Sweet Medical</h2>
          <p className="auth-brand__copy">
            Acompañándote en cada paso hacia una vida más saludable.
          </p>
        </div>

        <div className="auth-brand__features auth-brand__features--centered">
          <span>Atención rápida</span>
          <span>Historial clínico online</span>
          <span>Gestión 100% segura</span>
        </div>

        <div className="auth-brand__orb auth-brand__orb--one" />
        <div className="auth-brand__orb auth-brand__orb--two" />
      </aside>

      <main className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__icon">
              <HeartPulse size={20} color="var(--color-primary)" aria-hidden="true" />
            </div>
            <span className="auth-mobile-logo__title">Sweet Medical</span>
          </div>

          <SegmentedTabs
            ariaLabel="Seleccionar acción"
            value={mode}
            onChange={switchMode}
            options={MODE_OPTIONS}
            className="auth-mode-toggle"
          />

          <h1 className="auth-header">{isLogin ? 'Bienvenido de nuevo' : 'Creá tu cuenta'}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Ingresá tus credenciales para ver y gestionar tus turnos.'
              : 'Completá tus datos para empezar a operar en el sistema.'}
          </p>

          {isSuccess && (
            <StatusBanner
              tone="success"
              icon={CheckCircle2}
              className="auth-status-banner"
              message={
                isLogin
                  ? '¡Listo! Iniciaste sesión correctamente. Redirigiendote a tu dashboard...'
                  : '¡Cuenta creada con éxito! Ya podés acceder a tu panel.'
              }
            />
          )}

          {status === 'error' && serverError && (
            <StatusBanner
              tone="error"
              icon={AlertCircle}
              className="auth-status-banner"
              message={serverError}
            />
          )}

          <form onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <SegmentedTabs
                  ariaLabel="Tipo de cuenta"
                  value={userType}
                  onChange={handleUserTypeChange}
                  options={USER_TYPE_OPTIONS}
                />
              </div>
            )}

            {!isLogin && (
              <TextField
                label="Nombre completo"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ej: Ana Gómez"
                value={fields.name}
                error={touched.name && errors.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || isSuccess}
              />
            )}

            {!isLogin && userType === 'paciente' && (
              <TextField
                label="DNI"
                name="dni"
                type="text"
                placeholder="Sin puntos ni espacios"
                value={fields.dni}
                error={touched.dni && errors.dni}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || isSuccess}
                maxLength={8}
              />
            )}

            {!isLogin && userType === 'medico' && (
              <TextField
                label="Matrícula"
                name="matricula"
                type="text"
                placeholder="Número de matrícula"
                value={fields.matricula}
                error={touched.matricula && errors.matricula}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || isSuccess}
                maxLength={13}
              />
            )}

            <TextField
              label="Usuario"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Nombre de usuario"
              value={fields.username}
              error={touched.username && errors.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading || isSuccess}
            />

            <PasswordField
              label="Contraseña"
              name="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              placeholder="Mínimo 8 caracteres"
              value={fields.password}
              error={touched.password && errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
              show={showPassword}
              toggle={() => setShowPassword((current) => !current)}
              disabled={isLoading || isSuccess}
            />

            {!isLogin && (
              <PasswordField
                label="Confirmar contraseña"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Repetí tu contraseña"
                value={fields.confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                show={showPassword2}
                toggle={() => setShowPassword2((current) => !current)}
                disabled={isLoading || isSuccess}
              />
            )}

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={[
                'auth-submit',
                isSuccess ? 'auth-submit--success' : 'auth-submit--idle',
                isLoading ? 'auth-submit--loading' : '',
                isLoading || isSuccess ? 'auth-submit--disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isLoading && (
                <Loader2 size={18} className="auth-submit__spinner" aria-hidden="true" />
              )}
              {isSuccess && <CheckCircle2 size={18} aria-hidden="true" />}
              {isLoading
                ? isLogin
                  ? 'Iniciando sesión...'
                  : 'Creando cuenta...'
                : isSuccess
                  ? '¡Listo!'
                  : isLogin
                    ? 'Iniciar sesión'
                    : 'Crear cuenta'}
            </button>

            <p className="auth-footer">
              {isLogin ? (
                <>
                  ¿No tenés cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="auth-link-button"
                  >
                    Creá una gratis
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tenés cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="auth-link-button"
                  >
                    Iniciá sesión
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
