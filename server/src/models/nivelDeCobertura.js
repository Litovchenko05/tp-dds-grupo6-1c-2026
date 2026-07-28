export const NivelDeCobertura = Object.freeze({
  TOTAL: {
    nombre: 'TOTAL',
    calcularDescuento: (costo) => costo,
  },
  PARCIAL: {
    nombre: 'PARCIAL',
    calcularDescuento: (costo) => costo * 0.5,
  },
  NO_CUBIERTO: {
    nombre: 'NO_CUBIERTO',
    calcularDescuento: (_) => 0,
  },
})
