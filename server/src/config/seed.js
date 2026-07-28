import { ServicioModel } from '../schemasBD/servicioSchema.js'
import { SedeModel } from '../schemasBD/sedeSchema.js'

const SERVICIOS_INICIALES = [
  { nombre: 'Cardiología', tipo: 'especialidad' },
  { nombre: 'Pediatría', tipo: 'especialidad' },
  { nombre: 'Ginecología', tipo: 'especialidad' },
  { nombre: 'Oftalmología', tipo: 'especialidad' },
  { nombre: 'Dermatología', tipo: 'especialidad' },
  { nombre: 'Traumatología', tipo: 'especialidad' },
  { nombre: 'Clinica Médica', tipo: 'especialidad' },

  { nombre: '[P001] Ecografía Abdominal', tipo: 'practica' },
  { nombre: '[P002] Electrocardiograma', tipo: 'practica' },
  { nombre: '[P003] Radiografía de Tórax', tipo: 'practica' },
  { nombre: '[P004] Análisis de Sangre Completo', tipo: 'practica' },
  { nombre: '[P005] Control Post-Operatorio', tipo: 'practica' },
]

const SEDES_INICIALES = [
  { nombre: 'Sede Palermo', direccion: 'Av. Coronel Díaz 1400' },
  { nombre: 'Sede Villa Urquiza', direccion: 'Av. Triunvirato 4100' },
]

export const cargarDatosIniciales = async () => {
  try {
    console.log('🌱 Iniciando la carga de datos iniciales (Seeding)...')

    const operacionesServicios = SERVICIOS_INICIALES.map((servicio) => ({
      updateOne: {
        filter: { nombre: servicio.nombre },
        update: { $setOnInsert: servicio },
        upsert: true,
      },
    }))

    const operacionesSedes = SEDES_INICIALES.map((sede) => ({
      updateOne: {
        filter: { nombre: sede.nombre },
        update: { $setOnInsert: sede },
        upsert: true,
      },
    }))

    await ServicioModel.bulkWrite(operacionesServicios)
    await SedeModel.bulkWrite(operacionesSedes)
    console.log('✅ Catálogo de servicios y sedes sincronizado correctamente.')
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error.message)
  }
}
