import { Turno } from "./turno.js";
import {Paciente} from "./paciente.js"
import {Plan} from "./plan.js"
import { NivelDeCobertura } from "./NivelDeCobertura.js";
import { Practica } from "./practica.js"
import { Especialidad } from "./especialidad.js"
class FuncionTurno{
costoFinal(turno){
    const planes = turno.getPaciente().getObraSocial().getPlanes()
    if(planes.find((plan)=>this.obtenerNivelCobertura(turno.getPractica(),plan)===NivelDeCobertura.TOTAL)){
        return 0
    }
    else if(planes.find((plan)=>this.obtenerNivelCobertura(turno.getPractica(),plan)===NivelDeCobertura.PARCIAL)){
        return turno.getCosto()/2
    }else{
        return turno.getCosto()
    }
  
}

obtenerNivelCobertura(servicio,plan){
      if(servicio instanceof Practica){
        return plan.obtenerCoberturaPractica(servicio)
    }else{
        return plan.obtenerCoberturaEspecialidad(servicio)
    }
}


}