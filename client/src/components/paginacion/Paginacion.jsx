import React from "react";
import "./Paginacion.css";

const Paginacion = ({paginaActual, totalDePaginas, cambioDePagina}) => {
    return(
        <div className="paginacion">
            <button 
            disabled={paginaActual === 1} 
            onClick={()=>cambioDePagina(paginaActual-1)}>
                ‹
            </button>

            {Array.from( {length:totalDePaginas}, (_,i) => i+1).map(num=>(

                <button
                    key={num}
                    className={ paginaActual===num ? "pagina-activa" : ""}
                    onClick={()=>cambioDePagina(num)}>
                    {num}
                </button>
                ))
            }

            <button
            disabled={paginaActual===totalDePaginas}
            onClick={()=>cambioDePagina(paginaActual+1)}>
                ›
            </button>
          
        </div>
    )    
}

export default Paginacion