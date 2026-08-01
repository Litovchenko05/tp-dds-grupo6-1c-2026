export function formatearFechaHora(isoString) {
  const date = new Date(isoString)

  const fecha = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const hora = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return { fecha, hora }
}
