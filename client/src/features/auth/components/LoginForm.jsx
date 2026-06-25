import React from 'react'
import { TextField } from '../../../components/forms/TextField/TextField'
import { PasswordField } from '../../../components/forms/PasswordField/PasswordField'

export function LoginForm({
  fields,
  errors,
  touched,
  isLoading,
  isSuccess,
  showPassword,
  setShowPassword,
  onChange,
  onBlur,
}) {
  return (
    <>
      <TextField
        label="Usuario"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Nombre de usuario"
        value={fields.username}
        error={touched.username && errors.username}
        onChange={onChange}
        onBlur={onBlur}
        disabled={isLoading || isSuccess}
      />

      <PasswordField
        label="Contraseña"
        name="password"
        autoComplete="current-password"
        placeholder="Mínimo 8 caracteres"
        value={fields.password}
        error={touched.password && errors.password}
        onChange={onChange}
        onBlur={onBlur}
        show={showPassword}
        toggle={() => setShowPassword((prev) => !prev)}
        disabled={isLoading || isSuccess}
      />
    </>
  )
}
