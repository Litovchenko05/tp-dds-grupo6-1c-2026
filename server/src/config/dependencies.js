import { MedicoRepository } from '../repositories/medico.repository.js'
import { NotificacionRepository } from '../repositories/notificacion.repository.js'
import { PacienteRepository } from '../repositories/paciente.repository.js'
import { EspecialidadRepository } from '../repositories/especialidad.repository.js'
import { PracticaRepository } from '../repositories/practica.repository.js'
import { SedeRepository } from '../repositories/sede.repository.js'
import { TurnoRepository } from '../repositories/turno.repository.js'
import { UsuarioRepository } from '../repositories/usuario.repository.js'
import { ServicioRepository } from '../repositories/servicios.repository.js'
import { ObraSocialRepository } from '../repositories/obraSocial.repository.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import { CoberturaRepository } from '../repositories/cobertura.repository.js'

import { AgendaService } from '../services/agenda.service.js'
import { MedicoService } from '../services/medico.service.js'
import { NotificacionService } from '../services/notificacion.service.js'
import { PacienteService } from '../services/paciente.service.js'
import { TurnoService } from '../services/turno.service.js'
import { UsuarioService } from '../services/usuario.service.js'
import { AuthService } from '../services/auth.service.js'
import { ServicioService } from '../services/servicio.service.js'
import { SedeService } from '../services/sede.service.js'
import { ObraSocialService } from '../services/obraSocial.service.js'
import { PlanService } from '../services/plan.service.js'

import { MedicoController } from '../controllers/medico.controller.js'
import { NotificacionController } from '../controllers/notificacion.controller.js'
import { PacienteController } from '../controllers/paciente.controller.js'
import { TurnoController } from '../controllers/turno.controller.js'
import { AuthController } from '../controllers/auth.controller.js'
import { ServicioController } from '../controllers/servicio.controller.js'
import { SedeController } from '../controllers/sede.controller.js'
import { ObraSocialController } from '../controllers/obraSocial.controller.js'
import { PlanController } from '../controllers/plan.controller.js'
import { RecordatorioTask } from '../tasks/recordatorio.task.js'

const medicoRepository = new MedicoRepository()
const notificacionRepository = new NotificacionRepository()
const pacienteRepository = new PacienteRepository()
const especialidadRepository = new EspecialidadRepository()
const practicaRepository = new PracticaRepository()
const sedeRepository = new SedeRepository()
const usuarioRepository = new UsuarioRepository()
const servicioRepository = new ServicioRepository()
const obraSocialRepository = new ObraSocialRepository()
const planRepository = new PlanRepository()
const coberturaRepository = new CoberturaRepository()
const turnoRepository = new TurnoRepository(
  medicoRepository,
  pacienteRepository,
  planRepository,
  coberturaRepository
)

const planService = new PlanService({ planRepository })
const obraSocialService = new ObraSocialService({ obraSocialRepository })
const servicioService = new ServicioService({ servicioRepository })
const sedeService = new SedeService({ sedeRepository })
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
  notificacionService,
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
const sedeController = new SedeController({ sedeService })
const servicioController = new ServicioController({ servicioService })
const obraSocialController = new ObraSocialController({ obraSocialService })
const planController = new PlanController({ planService })

export {
  coberturaRepository,
  medicoRepository,
  notificacionRepository,
  pacienteRepository,
  especialidadRepository,
  practicaRepository,
  sedeRepository,
  turnoRepository,
  usuarioRepository,
  servicioRepository,
  obraSocialRepository,
  planRepository,
  notificacionService,
  sedeService,
  servicioService,
  turnoService,
  agendaService,
  pacienteService,
  usuarioService,
  medicoService,
  obraSocialService,
  planService,
  sedeController,
  servicioController,
  obraSocialController,
  planController,
  notificacionController,
  turnoController,
  pacienteController,
  medicoController,
  authController,
  recordatorioTask,
}
