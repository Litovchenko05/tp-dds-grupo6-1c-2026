import { useState, useEffect, useRef } from 'react'
import { authService } from './authService.js'

export function useAuthForm() {
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
          if (!/^\d{7,8}$/.test(value)) return 'El DNI debe tener 7 u 8 números, sin puntos.'
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
        if (currentMode === 'register' && value.length < 8)
          return 'La contraseña debe tener al menos 8 caracteres.'
        return ''
      case 'confirmPassword':
        if (currentMode === 'register' && value !== allFields.password)
          return 'Las contraseñas no coinciden.'
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
    let fieldsToCheck =
      mode === 'login'
        ? ['username', 'password']
        : userType === 'paciente'
          ? ['name', 'dni', 'username', 'password', 'confirmPassword']
          : ['name', 'matricula', 'username', 'password', 'confirmPassword']

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

    const errorHandlers = {
      400: () => setServerError('Usuario o contraseña incorrectos.'),
      401: () => setServerError('Usuario o contraseña incorrectos.'),
      409: () => {
        const backendErrors = error.response.data?.fields
        if (backendErrors) {
          setErrors((currentErrors) => ({ ...currentErrors, ...backendErrors }))
          setTouched((currentTouched) => ({
            ...currentTouched,
            ...Object.keys(backendErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
          }))
          setServerError('Por favor, revisá los campos marcados en rojo.')
        } else {
          setServerError('Ese nombre de usuario ya está registrado.')
        }
      },
      default: () =>
        setServerError(
          error.response.data?.error_description ||
            error.response.data?.message ||
            'Error de conexión con el servidor.'
        ),
    }

    const handler = errorHandlers[error.response.status] || errorHandlers.default
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
        await authService.iniciarSesion({ username: fields.username, password: fields.password })
      } else {
        const payload = {
          username: fields.username,
          password: fields.password,
          name: fields.name,
          role: userType,
          ...(userType === 'paciente' ? { dni: fields.dni } : { matricula: fields.matricula }),
        }
        await authService.registrarUsuario(payload)
      }

      setStatus('success')
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

  function handleUserTypeChange(type) {
    setUserType(type)
    setErrors({})
    setTouched({})
  }

  return {
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
  }
}
