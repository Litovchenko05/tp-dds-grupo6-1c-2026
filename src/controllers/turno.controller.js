export class TurnoController {
  constructor({ turnoService }) {
    this.turnoService = turnoService
  }

  findAll = async (req, res) => {
    try {
      const resultado = await this.turnoService.obtenerTodos()

      return res.status(200).json({
        status: 'success',
        data: resultado,
      })
    } catch (error) {
      return res.status(400).json({
        data: error.message,
      })
    }
  }

  findById = async (req, res) => {
    try {
      const { id } = req.params

      const turno = this.turnoService.obtenerPorId(id)

      if (!turno) {
        return res.status(404).json({ status: 'error', message: 'Turno no encontrado' });
      }

      return res.status(200).json({ status: 'success', data: turno });

    } catch (error) {
      return res.status(400).json({ data: error.message });
    }
  }

  findTurnosByProfesional = async (req, res) => {
    try {
      const nombreDeProfesional = req.query.profesional; 
      if (!nombreDeProfesional) {
        const turnos = await this.turnoService.obtenerTodos();

        return res.status(200).json({status:'succes', data:turnos});
      }
      const turnosFiltradosPorProfesional = await this.turnoService.obtenerTurnosPorProfesional(nombreDeProfesional);
      
      return res.status(200).json({status:'success', data: turnosFiltradosPorProfesional});   
    }
    catch (error) {
      return res.status(400).json({ data: error.message })  
    }
  }

  findTurnosByEspecialidad = async (req, res) => {
    try{
        const nombreDeEspecialidad = req.query.especialidad;
        if (!nombreDeEspecialidad) {
          const turnos = await this.turnoService.obtenerTodos();
            return res.status(200).json({status:'succes', data:turnos});
        }

        const turnosFiltradosEspecialidad = await this.turnoService.obtenerTurnosPorEspecialidad(nombreDeEspecialidad);
        return res.status(200).json({status:'success', data: turnosFiltradosEspecialidad});
    }
    catch(error){
      return res.status(400).json({ data: error.message })  
    }
  }
  findTurnosByPractica = async (req, res) => {
      try{
        const nombreDePractica = req.query.practica;
        if (!nombreDePractica) {
          const turnos = await this.turnoService.obtenerTodos();
            return res.status(200).json({status:'succes', data:turnos});
        }

        const turnosFiltradosPractica = await this.turnoService.obtenerTurnosPorPractica(nombreDePractica);
        return res.status(200).json({status:'success', data: turnosFiltradosPractica});
      }catch(error){
        return res.status(400).json({ data: error.message })
      }
  }

  findTurnosBySede = async (req, res) => {
    try{
        const nombreDeSede = req.query.sede;
        if (!nombreDeSede) {
          const turnos = await this.turnoService.obtenerTodos();
            return res.status(200).json({status:'succes', data:turnos});
        }
        
        const turnosFiltradosSede = await this.turnoService.obtenerTurnosPorSede(nombreDeSede);
        return res.status(200).json({status:'success', data: turnosFiltradosSede});
      }catch(error){
        return res.status(400).json({ data: error.message })
      }
  }

  findTurnosByRangoDeFechas = async(req, res)=>{
    try{
        const fechaIncial = req.query.LI;
        const fechaFinal = req.query.FF;
        
          if (!fechaIncial || !fechaFinal) {
            const turnos = await this.turnoService.obtenerTodos();
              return res.status(200).json({status:'succes', data:turnos});
          }   
        const turnosFiltradosRango = await this.turnoService.obtenerTurnosPorRango(fechaIncial,fechaFinal);
        return res.status(200).json({status:'success', data: turnosFiltradosRango});
    }catch(error){
        return res.status(400).json({ data: error.message })
    }
  }

}
