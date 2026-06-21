import React from 'react'
import Skeleton from '@mui/material/Skeleton'

const TurnGridSkeleton = ({ items = 6 }) => {
  return (
    <div className="turns-grid" aria-live="polite" aria-label="Cargando turnos">
      {Array.from({ length: items }).map((_, index) => (
        <article key={`turn-skeleton-${index}`} className="turn-item-card">
          <Skeleton variant="rounded" height={18} width="50%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={22} width="75%" />
          <Skeleton variant="text" height={20} width="60%" />
          <Skeleton variant="rounded" height={36} width="100%" sx={{ mt: 2 }} />
        </article>
      ))}
    </div>
  )
}

export default TurnGridSkeleton
