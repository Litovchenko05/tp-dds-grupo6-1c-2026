import React from "react";
import  { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useCarrito } from '../../context/CarritoContext.jsx';

const inicializarCampo = (requerido = true) => ({ valor: '', requerido });

const inicializarCampos = () => ({
  nombre: inicializarCampo(),
  apellido: inicializarCampo(),
  dni: inicializarCampo(),
});


 const Checkout = () => {
    
    const { carrito, limpiarCarrito } = useCarrito();
    const navigate = useNavigate();
    const [campos, setCampos] = useState(inicializarCampos());
    const valorDe = (nombreCampo) => campos[nombreCampo].valor;

    const setValorDe = (nombreCampo) => (e) => {
        const nuevoValor = e.target.value;
        setCampos({
        ...campos,
        [nombreCampo]: {
            ...campos[nombreCampo],
            valor: nuevoValor
        }
        });
    };

    const camposCompletos = Object.values(campos).every(campo =>
        !campo.requerido || campo.valor.length
    );

    const handleGuardar = () => {
        const totalTurnos = carrito.reduce((acc, c) => acc + c.unidades, 0);
        alert(`${valorDe('nombre')} ${valorDe('apellido')}, compraste ${totalTurnos} turnos.`);
        limpiarCarrito();
        navigate('/');
    };

    const handleCancelar = () => {
        navigate('/');
    };
        
    return(
        <div className="conteiner">
            <div className="root">

            <div className="form-container">
                 <h1> Confirma las reservas de tu carrito</h1>
            </div>

            <div className="carrito-resumen">
                {carrito.length === 0 ? (
                    <p>El carrito está vacío</p>
                ) : (
                carrito.map((turno, index) => (
                    <div key={index} className="carrito-item">
                        {turno.servicio}: {turno.unidades} unidades
                    </div>
                    ))
                )}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>

                <div className="input-div">
                    <label>Nombre</label>
                    <input 
                    type="text"
                    value={valorDe('nombre')}
                    onChange={setValorDe('nombre')}
                    required ></input>
                </div>

                <div className="input-div">
                    <label>Apellido</label>
                    <input 
                    type="text"
                    value={valorDe('apellido')}
                    onChange={setValorDe('apellido')}
                    required 
                    ></input>
                </div>

                <div className="input-div">
                    <label>DNI</label>
                    <input 
                    type="text"
                    value={valorDe('dni')}
                    onChange={setValorDe('dni')}
                    required 
                    ></input>
                </div>


                <div className="actions">
                    <button className="btn" onClick={handleCancelar}>Cancelar</button>
                    <button 
                    disabled={!camposCompletos || carrito.length === 0}
                    variant="contained"
                    onClick={handleGuardar}
                    className="btn"
                    >
                    Guardar
                    </button>
                </div>
            </form>
            
        </div>
        </div>

    )
}
export default Checkout;