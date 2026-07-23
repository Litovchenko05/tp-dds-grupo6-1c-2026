import { MedicoRepository } from '../repositories/medico.repository.js'
import { NotificacionRepository } from '../repositories/notificacion.repository.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { EspecialidadRepository } from '../repositories/especialidad.repository.js'
import { PracticaRepository } from '../repositories/practica.repository.js'
import { SedeRepository } from '../repositories/sede.repository.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { UsuarioRepository } from '../repositories/usuario.repository.js'
import { ServicioRepository } from '../repositories/servicios.repository.js'

import { AgendaService } from '../services/agenda.service.js'
import { MedicoService } from '../services/medico.service.js'
import { NotificacionService } from '../services/notificacion.service.js'
import { PacienteService } from '../services/paciente.service.js'
import { TurnoService } from '../services/turno.service.js'
import { UsuarioService } from '../services/usuario.service.js'
import { AuthService } from '../services/auth.service.js'

import { MedicoController } from '../controllers/medico.controller.js'
import { NotificacionController } from '../controllers/notificacion.controller.js'
import { PacienteController } from '../controllers/paciente.controller.js'
import { TurnoController } from '../controllers/turno.controller.js'
import { AuthController } from '../controllers/auth.controller.js'

import { RecordatorioTask } from '../tasks/recordatorio.task.js'

const medicoRepository = new MedicoRepository()
const notificacionRepository = new NotificacionRepository()
const pacienteRepository = new PacienteRepository()
const especialidadRepository = new EspecialidadRepository()
const practicaRepository = new PracticaRepository()
const sedeRepository = new SedeRepository()
const turnoRepository = new TurnoRepository()
const usuarioRepository = new UsuarioRepository()
const servicioRepository = new ServicioRepository()

const notificacionService = new NotificacionService({ notificacionRepository })
const turnoService = new TurnoService({
  turnoRepository,
  notificacionService,
})
const agendaService = new AgendaService({ turnoRepository })
const pacienteService = new PacienteService({
  pacienteRepository,
  turnoRepository,
  medicoRepository,
  turnoService,
})
const usuarioService = new UsuarioService({ usuarioRepository })
const medicoService = new MedicoService({
  medicoRepository,
  agendaService,
  especialidadRepository,
  practicaRepository,
  sedeRepository,
  turnoService,
})
const authService = new AuthService({
  usuarioService,
  pacienteService,
  medicoService,
  pacienteRepository,
  medicoRepository,
})

const notificacionController = new NotificacionController({ notificacionService })
const turnoController = new TurnoController({ turnoService })
const pacienteController = new PacienteController({ pacienteService })
const medicoController = new MedicoController({
  medicoService,
  turnoService,
  pacienteService,
})
const authController = new AuthController({ authService })
const recordatorioTask = new RecordatorioTask({
  turnoRepository,
  notificacionService,
})

export {
  medicoRepository,
  notificacionRepository,
  pacienteRepository,
  especialidadRepository,
  practicaRepository,
  sedeRepository,
  turnoRepository,
  usuarioRepository,
  servicioRepository,
  notificacionService,
  turnoService,
  agendaService,
  pacienteService,
  usuarioService,
  medicoService,
  notificacionController,
  turnoController,
  pacienteController,
  medicoController,
  authController,
  recordatorioTask,
}
