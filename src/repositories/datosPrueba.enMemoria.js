import { Medico } from '../models/Medico.js'
import { Notificacion } from '../models/notificacion.model.js'
import { Paciente } from '../models/paciente.js'
import { Sede } from '../models/Sede.js'
import { Turno } from '../models/turno.js'
import { Practica } from '../models/practica.js'
import { MedicoRepository } from './medico.repository.js'
import { NotificacionRepository } from './notificacion.repository.js'
import { PacienteRepository } from './paciente.repository.js'
import { TurnoRepository } from './turno.repository.js'
import { DisponibilidadHoraria } from '../models/DisponibilidadHoraria.js'

export const medicoRepository = new MedicoRepository()
export const pacienteRepository = new PacienteRepository()
export const turnoRepository = new TurnoRepository()
export const notificacionRepository = new NotificacionRepository()

// function crearDatosDePrueba() {
//   const sedeCentral = new Sede(1, 'Sede Central', 'Av. Siempre Viva 123')
//   const sedeNorte = new Sede(2, 'Sede Norte', 'Calle Falsa 456')

//   const medicos = [
//     new Medico(1, 'medico_ana', 'MAT-001', 'Dra. Ana Perez', [], [], [sedeCentral]),
//     new Medico(2, 'medico_bruno', 'MAT-002', 'Dr. Bruno Diaz', [], [], [sedeNorte]),
//   ]

//   medicos[0].getDisponibilidades().push(new DisponibilidadHoraria('MARTES', '10:00', '11:00'))

//   const pacientes = [
//     new Paciente(
//       1,
//       'paciente_lucia',
//       '30111222',
//       'Lucia Gomez',
//       { nombre: 'OSDE' },
//       { nombre: '210' }
//     ),
//     new Paciente(
//       2,
//       'paciente_juan',
//       '28999888',
//       'Juan Torres',
//       { nombre: 'Swiss Medical' },
//       { nombre: 'SMG20' }
//     ),
//   ]

//   const practicaConsulta = new Practica(1, 'CONS001', 'Consulta general', 30, 25000)
//   const practicaControl = new Practica(2, 'CTRL001', 'Control clinico', 20, 18000)

//   const turnos = [
//     new Turno(1, medicos[0], new Date('2026-05-26T10:00:00'), sedeCentral, practicaConsulta),
//     new Turno(2, medicos[0], new Date('2026-05-26T10:30:00'), sedeCentral, practicaControl),
//     new Turno(3, medicos[1], new Date('2026-04-27T15:30:00'), sedeNorte, practicaConsulta),
//   ]

//   turnos[0].reservar(pacientes[0])

//   const notificaciones = [
//     new Notificacion({
//       destinatario: pacientes[0],
//       remitente: medicos[0].usuario,
//       mensaje: 'Recordatorio: mañana tenes turno a las 09:00',
//     }),
//     new Notificacion({
//       destinatario: pacientes[1],
//       remitente: medicos[1].usuario,
//       mensaje: 'Se generó un nuevo turno disponible para control clinico',
//     }),
//   ]

//   notificaciones[0].marcarComoLeida()

//   return { medicos, pacientes, turnos, notificaciones }
// }

// export function cargarDatosDePruebaEnMemoria() {
//   const { medicos, pacientes, turnos, notificaciones } = crearDatosDePrueba()

//   medicoRepository.limpiar()
//   pacienteRepository.limpiar()
//   turnoRepository.limpiar()
//   notificacionRepository.limpiar()

//   medicoRepository.cargar(medicos)
//   pacienteRepository.cargar(pacientes)
//   turnoRepository.cargar(turnos)
//   notificacionRepository.cargar(notificaciones)

//   return {
//     medicos: medicoRepository.obtenerTodos(),
//     pacientes: pacienteRepository.obtenerTodos(),
//     turnos: turnoRepository.obtenerTodos(),
//     notificaciones: notificacionRepository.obtenerTodos(),
//   }
// }
