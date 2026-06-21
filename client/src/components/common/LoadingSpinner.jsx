import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const LoadingSpinner = ({ size = 22, color = 'inherit', className = '' }) => {
  return (
    <span className={className} aria-live="polite" aria-label="Cargando">
      <CircularProgress size={size} color={color} />
    </span>
  )
}

export default LoadingSpinner
