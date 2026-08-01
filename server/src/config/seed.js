import { ServicioModel } from '../schemasBD/servicioSchema.js'
import { SedeModel } from '../schemasBD/sedeSchema.js'
import { ObraSocialModel } from '../schemasBD/obraSocialSchema.js'
import { PlanModel } from '../schemasBD/planSchema.js'
import { CoberturaModel } from '../schemasBD/coberturaSchema.js'

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

const ESTRUCTURA_OBRAS_SOCIALES = [
  {
    obraSocial: 'OSDE',
    planes: [
      { nombre: '210', nivelGlobal: 'PARCIAL' },
      { nombre: '310', nivelGlobal: 'TOTAL' },
      { nombre: '410', nivelGlobal: 'TOTAL' },
    ],
  },
  {
    obraSocial: 'Swiss Medical',
    planes: [
      { nombre: 'SMG20', nivelGlobal: 'PARCIAL' },
      { nombre: 'SMG30', nivelGlobal: 'TOTAL' },
    ],
  },
  {
    obraSocial: 'Galeno',
    planes: [
      { nombre: 'Plata 220', nivelGlobal: 'PARCIAL' },
      { nombre: 'Oro 330', nivelGlobal: 'TOTAL' },
    ],
  },
]

export const cargarDatosIniciales = async () => {
  try {
    console.log('🌱 Iniciando proceso de Seeding jerárquico...')

    const opsServicios = SERVICIOS_INICIALES.map((serv) => ({
      updateOne: {
        filter: { nombre: serv.nombre },
        update: { $setOnInsert: serv },
        upsert: true,
      },
    }))

    const opsSedes = SEDES_INICIALES.map((sede) => ({
      updateOne: {
        filter: { nombre: sede.nombre },
        update: { $setOnInsert: sede },
        upsert: true,
      },
    }))

    await ServicioModel.bulkWrite(opsServicios)
    await SedeModel.bulkWrite(opsSedes)

    const serviciosGuardados = await ServicioModel.find()

    for (const itemOS of ESTRUCTURA_OBRAS_SOCIALES) {
      const planIdsAsociados = []

      for (const infoPlan of itemOS.planes) {
        const coberturaIdsAsociadas = []

        for (const servicio of serviciosGuardados) {
          const coberturaDoc = await CoberturaModel.findOneAndUpdate(
            {
              servicio: servicio._id,
              'nivel.nivel': infoPlan.nivelGlobal,
            },
            {
              $setOnInsert: {
                servicio: servicio._id,
                nivel: { nivel: infoPlan.nivelGlobal },
              },
            },
            { upsert: true, returnDocument: 'after' }
          )
          coberturaIdsAsociadas.push(coberturaDoc._id)
        }
        const planDoc = await PlanModel.findOneAndUpdate(
          { nombre: infoPlan.nombre },
          {
            $setOnInsert: {
              nombre: infoPlan.nombre,
              coberturasDeServicios: coberturaIdsAsociadas,
            },
          },
          { upsert: true, returnDocument: 'after' }
        )

        planIdsAsociados.push(planDoc._id)
      }
      await ObraSocialModel.findOneAndUpdate(
        { nombre: itemOS.obraSocial },
        {
          $setOnInsert: { nombre: itemOS.obraSocial },
          $set: { planes: planIdsAsociados },
        },
        { upsert: true, returnDocument: 'after' }
      )
    }
  } catch (error) {
    console.error('❌ Error durante la ejecución del Seed:', error.message)
  }
}
