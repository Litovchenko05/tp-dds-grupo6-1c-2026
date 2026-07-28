import {turnos} from "../mockData/turnosMock";
import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const getTurnsSlowly = () => new Promise((resolve) =>
{
    setTimeout(() => {
        resolve(turnos)
    }, 5000
    )
}
)

export const getTurns = async (page) => {
    try{
        const response = await axios.get(`${REACT_APP_API_URL}/turnos?page=${page}&limit=8`, {headers:{'Cache-Control':'no-cache'}});

        return response.data;
    }
    catch(error){
        console.error("Error en el fetching de turnos:", error);
        throw error;
    }
}

export const getTurnById = async(id) => {
    try{
        const response = await axios.get(`${REACT_APP_API_URL}/turnos/${id}`);
        return response.data;

    } catch(error){
        console.error("Error en el fetching de turnos by id: ", error);
        throw error;
    }
}

export const crearReserva = async (idPaciente,idTurno,Nombre,Apellido) =>{
    try{
        const response = await axios.post(`${REACT_APP_API_URL}/${idPaciente}/turnos/${idTurno}`,
            {}
        );
        return response.data;
    }
    catch(error){
        console.error("Error creando reservación: ", error);
        throw error;
    }
}