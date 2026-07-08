import { HeartPulse, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { SegmentedTabs } from '../../components/ui/SegmentedTabs/SegmentedTabs'
import { StatusBanner } from '../../components/ui/StatusBanner/StatusBanner'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { useAuthForm } from './useAuthForm'
import './AuthScreen.css'

const MODE_OPTIONS = [
  { value: 'login', label: 'Iniciar sesión' },
  { value: 'register', label: 'Crear cuenta' },
]

export default function AuthScreen() {
  const {
    mode,
    userType,
    showPassword,
    setShowPassword,
    showPassword2,
    setShowPassword2,
    status,
    serverError,
    fields,
    errors,
    touched,
    liveRegionRef,
    handleChange,
    handleBlur,
    handleSubmit,
    switchMode,
    handleUserTypeChange,
  } = useAuthForm()

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
            {isLogin ? (
              <LoginForm
                fields={fields}
                errors={errors}
                touched={touched}
                isLoading={isLoading}
                isSuccess={isSuccess}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ) : (
              <RegisterForm
                fields={fields}
                errors={errors}
                touched={touched}
                userType={userType}
                isLoading={isLoading}
                isSuccess={isSuccess}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showPassword2={showPassword2}
                setShowPassword2={setShowPassword2}
                onChange={handleChange}
                onBlur={handleBlur}
                onUserTypeChange={handleUserTypeChange}
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
