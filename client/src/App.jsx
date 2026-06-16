import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './features/home/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './features/layout/Layout.jsx';
import TurnDetailPage from './features/turn/turnDetailPage.jsx';
import Checkout from './features/checkout/Checkout.jsx';
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import HistorialTurnosPage from './features/historial/historial.jsx';
import MisTurnosPage from './features/misTurnos/misTurnosPage.jsx';

function App() {


  return (
  <CarritoProvider>
  <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home />} />
        <Route path="/turnos/:id" element={<TurnDetailPage/>} />
        <Route path="/reserva-de-turnos" element={<ReservarTurnosPage />} />
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/historial" element={<HistorialTurnosPage/>}/>
        <Route path="/mis-turnos" element={<MisTurnosPage/>}/>
        </Route>
  </Routes>
  </CarritoProvider>  
  );
}

export default App;
