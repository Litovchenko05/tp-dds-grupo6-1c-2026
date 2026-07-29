import { createContext, useContext, useState } from 'react';

//creo el contexto del carrito, donde se almacenaran todos los datos del carrito
const CarritoContext = createContext(null);
//creamos el componente CarritoProvider, cuyo prop "children" representa todos los componentes tendran acceso al contexto del carrito
export const CarritoProvider = ({ children }) => {
  //creamos el estado del carrito, que al principio es un array vacio, que despues contendra los turnos comprados
  const [carrito, setCarrito] = useState([]);

  //verificar si ya esta el turno en el carrito
  const verificarTurno = (turno) => {
    return carrito.some(t => t.data._id === turno.data._id);
  }

  //esta funcion recibe un turno y lo agrega al carrito, utilizando los turnos que habitaban anteriormente (prev), más el nuevo turno, y a partir de ellos crea un nuevo array con los todos los turnos comprados
  const actualizarCarrito = (turno) => {
    if(verificarTurno(turno)){
      return;
    }
    setCarrito((prev) => [...prev, turno]);
  };

 //limpia el carrito, dejando vacio al array
  const limpiarCarrito = () => {
    setCarrito([]);
  };

  //para eliminar turnos del carrito
  const eliminarTurno = (id) => {
    setCarrito(carrito =>
        carrito.filter(turno => turno.data._id !== id)
    );
};

  //se establecen las funciones y la entidad a compartir, medinate el provider, a todos los componentes que esten dentro del provider
  return (
    <CarritoContext.Provider value={{ carrito, actualizarCarrito, limpiarCarrito, eliminarTurno, verificarTurno }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);