import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './features/home/Home.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './features/layout/Layout.jsx';
import TurnDetailPage from './features/turn/turnDetailPage.jsx';
import Checkout from './features/checkout/Checkout.jsx';
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx';
function App() {
  return (
  <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/turnos/:id" element={<TurnDetailPage />} />
        <Route path="/reservar-turnos" element={<ReservarTurnosPage />} />
        <Route path="/checkout" element={<Checkout/>}></Route>
      </Route>
  </Routes>
  );
}

export default App;
