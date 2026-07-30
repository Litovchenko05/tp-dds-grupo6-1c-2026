import React from 'react'
import { TextField } from '../../../components/forms/TextField/TextField'
import { PasswordField } from '../../../components/forms/PasswordField/PasswordField'
import { SegmentedTabs } from '../../../components/ui/SegmentedTabs/SegmentedTabs'

const USER_TYPE_OPTIONS = [
  { value: 'paciente', label: 'Soy Paciente' },
  { value: 'medico', label: 'Soy Médico' },
]

export function RegisterForm({
  fields,
  errors,
  touched,
  userType,
  setUserType,
  isLoading,
  isSuccess,
  showPassword,
  setShowPassword,
  showPassword2,
  setShowPassword2,
  onChange,
  onBlur,
  onUserTypeChange,
}) {
  return (
    <>
      <div className="auth-usertype-wrapper">
        <SegmentedTabs
          ariaLabel="Tipo de cuenta"
          value={userType}
          onChange={onUserTypeChange}
          options={USER_TYPE_OPTIONS}
        />
      </div>

      <TextField
        label="Nombre completo"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Ej: Ana Gómez"
        value={fields.name}
        error={touched.name && errors.name}
        onChange={onChange}
        onBlur={onBlur}
        disabled={isLoading || isSuccess}
      />

      {userType === 'paciente' ? (
        <TextField
          label="DNI"
          name="dni"
          type="text"
          placeholder="Sin puntos ni espacios"
          value={fields.dni}
          error={touched.dni && errors.dni}
          onChange={onChange}
          onBlur={onBlur}
          disabled={isLoading || isSuccess}
          maxLength={8}
        />
      ) : (
        <TextField
          label="Matrícula"
          name="matricula"
          type="text"
          placeholder="Número de matrícula"
          value={fields.matricula}
          error={touched.matricula && errors.matricula}
          onChange={onChange}
          onBlur={onBlur}
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
        onChange={onChange}
        onBlur={onBlur}
        disabled={isLoading || isSuccess}
      />

      <PasswordField
        label="Contraseña"
        name="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={fields.password}
        error={touched.password && errors.password}
        onChange={onChange}
        onBlur={onBlur}
        show={showPassword}
        toggle={() => setShowPassword((prev) => !prev)}
        disabled={isLoading || isSuccess}
      />

      <PasswordField
        label="Confirmar contraseña"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Repetí tu contraseña"
        value={fields.confirmPassword}
        error={touched.confirmPassword && errors.confirmPassword}
        onChange={onChange}
        onBlur={onBlur}
        show={showPassword2}
        toggle={() => setShowPassword2((prev) => !prev)}
        disabled={isLoading || isSuccess}
      />
    </>
  )
}
