import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './BusquedaServiciosPage.css';
import { Link } from "react-router-dom";

const BusquedaServiciosPage = () => {

    const serviciosMock = [
        {
            id: 1,
            medico: "Dra. Ana Gómez",
            sede: "Centro Médico Palermo",
            servicio: "Cardiológica",
            tipo: "Especialidad",
            costo: "$8500"
        },
        {
            id: 2,
            medico: "Dr. Juan Pérez",
            sede: "Clínica Belgrano",
            servicio: "Electrocardiograma",
            tipo: "Práctica",
            costo: "$5000"
        },
        {
            id: 3,
            medico: "Dra. Laura Díaz",
            sede: "Centro Médico Norte",
            servicio: "Dermatología",
            tipo: "Especialidad",
            costo: "$7000"
        },
        {
            id: 4,
            medico: "Dra. Laura Díaz",
            sede: "Centro Médico Norte",
            servicio: "Dermatología",
            tipo: "Especialidad",
            costo: "$7000"
        },
        {
            id: 5,
            medico: "Dra. Laura Díaz",
            sede: "Centro Médico Norte",
            servicio: "Dermatología",
            tipo: "Especialidad",
            costo: "$7000"
        }
    ];


    const especialidades = [
            "Cardiología",
            "Dermatología",
            "Pediatría"
        ];


    const practicas = [
            "Electrocardiograma",
            "Radiografía",
            "Análisis de sangre"
        ];

    const [menuAbierto, setMenuAbierto] = useState(null);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
    const [practicaSeleccionada, setPracticaSeleccionada] = useState("");
    const [paginaActual, setpaginaActual] = useState(1);
    const elementosPorPagina = 3;


    const abrirMenu = (id) => {
        setMenuAbierto(menuAbierto === id ? null : id);
    };

    const menuRef = useRef(null);
    
        useEffect(() => {
    
        function cerrarMenu(event) {
          if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuAbierto(false);
            }
    
        }
    
        document.addEventListener("mousedown", cerrarMenu);
    
        return () => {
            document.removeEventListener("mousedown", cerrarMenu);
        };
    
          }, []);
    
  
    
    const serviciosFiltrados = serviciosMock.filter((servicio)=>{


    const coincideEspecialidad =
        especialidadSeleccionada === "" ||
        (
            servicio.tipo === "Especialidad" &&
            servicio.servicio === especialidadSeleccionada
        );


    const coincidePractica =
        practicaSeleccionada === "" ||
        (
            servicio.tipo === "Práctica" &&
            servicio.servicio === practicaSeleccionada
        );


    return (

        coincideEspecialidad &&
        coincidePractica
    );

});
   
   
        const indiceUltimo = paginaActual * elementosPorPagina;
        const indicePrimero = indiceUltimo - elementosPorPagina;


        const serviciosPagina =
            serviciosFiltrados.slice(
                indicePrimero,
                indiceUltimo
            );


        const cantidadPaginas =
            Math.ceil(
                serviciosFiltrados.length / elementosPorPagina
            );


    return (
        <Box className="app-view-container">

            <Typography variant="h4" className="page-title">
                Búsqueda de servicios
            </Typography>

            <div className="filtros-container">

            <label className="filtro-label">
                   Filtrar por especialidad
            </label>
            <div className="input-wrapper">
                <select
                    className="filtro-select"
                    value={especialidadSeleccionada}
                    onChange={(e) => {
                    setEspecialidadSeleccionada(e.target.value);
                    setpaginaActual(1);
                    }}
                >
                    <option value="">Todas</option>

                    {especialidades.map((esp) => (
                    <option key={esp}>{esp}</option>
                    ))}
                </select>
            </div>


            <label className="filtro-label">
                   Filtrar por práctica
            </label>
            <div className="input-wrapper">
                <select
                    className="filtro-select"
                    value={practicaSeleccionada}
                    onChange={(e)=>{
                    setPracticaSeleccionada(e.target.value);
                    setpaginaActual(1);
                }}
                >
                <option value="">Todas</option>
                {practicas.map((prac)=>(
                    <option key={prac}>{prac}</option>
                ))
                }
                </select>
            </div>

            </div>

            <div className="servicios-container">
                <div className="tabla-container">
                    <table className="servicios-table">
                        <thead>
                            <tr>
                                <th>Médico</th>
                                <th>Sede</th>
                                <th>Servicio</th>
                                <th>Tipo</th>
                                <th>Costo</th>
                                <th></th>
                            </tr>
                        </thead>


                        <tbody>

                            {serviciosPagina.map((servicio) => (

                                <tr key={servicio.id}>

                                    <td>{servicio.medico}</td>

                                    <td>{servicio.sede}</td>

                                    <td>{servicio.servicio}</td>

                                    <td>
                                        <span className="tipo-badge">
                                            {servicio.tipo}
                                        </span>
                                    </td>

                                    <td className="precio">
                                        {servicio.costo}
                                    </td>


                                    <td className="acciones">
                                    <div ref={menuRef}>
                                        <button
                                            className="menu-button"
                                            onClick={() => abrirMenu(servicio.id)}
                                        >
                                            ⋮
                                        </button>

                                        {menuAbierto === servicio.id && (
                                        <div className="acciones-menu">
                                             {/* /* esto esta mal, tengo que reimplementarlo, pero por ahora lo dejo asi */}
                                             <Link to={`/turnos/${servicio.id}`} class="btn-reservar"> 
                                             <button>
                                                 Reservar
                                            </button>
                                            </Link>     
                                        </div>
                                        )}
                                    </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

           <div className="paginacion">
            <button
            disabled={paginaActual === 1}
            onClick={()=>setpaginaActual(paginaActual-1)}
            >
            ‹
            </button>


            {
            Array.from(
            {length:cantidadPaginas},
            (_,i)=>i+1
            )
            .map(num=>(

            <button
            key={num}
            className={
            paginaActual===num 
            ? "pagina-activa"
            : ""
            }
            onClick={()=>setpaginaActual(num)}
            >
            {num}
            </button>
            ))
            }

            <button
            disabled={paginaActual===cantidadPaginas}
            onClick={()=>setpaginaActual(paginaActual+1)}
            >
            ›
            </button>

            </div>
        </Box>
    );
};


export default BusquedaServiciosPage;