import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './features/layout/Layout.jsx'
import Home from './features/home/Home.jsx'
import TurnDetailPage from './features/turn/turnDetailPage.jsx'
import Checkout from './features/checkout/Checkout.jsx'
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx'
import HistorialTurnosPage from './features/historial/historial.jsx'
import MisTurnosPage from './features/misTurnos/misTurnosPage.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import MedicoDrawer from './components/menuLateral/MedicoDrawer'
import MedicoAgenda from './features/medico/agenda/MedicoAgenda'
import MedicoHome from './features/medico/home/MedicoHome'

function App() {
  const location = useLocation()
  const isMedicoRoute = location.pathname.startsWith('/medico')
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// Contextos
import { CarritoProvider } from './context/CarritoContext.jsx'
import { UsuarioProvider } from './context/UsuarioContext.jsx'
import { NotificacionesProvider } from './context/NotificacionesContext.jsx'

// Componentes
import Home from './features/home/Home.jsx'
import Layout from './features/layout/Layout.jsx'
import TurnDetailPage from './features/turn/turnDetailPage.jsx'
import Checkout from './features/checkout/Checkout.jsx'
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx'
import HistorialTurnosPage from './features/historial/historial.jsx'
import MisTurnosPage from './features/misTurnos/misTurnosPage.jsx'
import AuthScreen from './features/AuthScreen/AuthScreen.jsx'
import NotificacionesScreen from './features/NotificacionesScreen/NotificacionesScreen.jsx'

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function GuestRoute() {
  const isAuthenticated = !!localStorage.getItem('token')
  // Si tiene token, lo mandamos al home. Si no, mostramos el login.
  return isAuthenticated ? <Navigate to="/" replace /> : <AuthScreen />
}

function App() {
  return (
    <CarritoProvider>
      {isMedicoRoute && <MedicoDrawer />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/turnos/:id" element={<TurnDetailPage />} />
          <Route path="/reserva-de-turnos" element={<ReservarTurnosPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/historial" element={<HistorialTurnosPage />} />
          <Route path="/mis-turnos" element={<MisTurnosPage />} />
        </Route>

        <Route path="/medico/home" element={<MedicoHome />} />
        <Route path="/medico/agenda" element={<MedicoAgenda />} />
      </Routes>
      <UsuarioProvider>
        <NotificacionesProvider>
          <Routes>
            <Route path="/login" element={<GuestRoute />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="turnos/:id" element={<TurnDetailPage />} />
                <Route path="reserva-de-turnos" element={<ReservarTurnosPage />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="historial" element={<HistorialTurnosPage />} />
                <Route path="mis-turnos" element={<MisTurnosPage />} />
                <Route path="notificaciones" element={<NotificacionesScreen />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificacionesProvider>
      </UsuarioProvider>
    </CarritoProvider>
  )
}

export default App
