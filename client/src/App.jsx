import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

// Contextos
import { CarritoProvider } from './context/CarritoContext.jsx'
import { UsuarioProvider } from './context/UsuarioContext.jsx'
import { NotificacionesProvider } from './context/NotificacionesContext.jsx'

// Componentes / Features paciente
import Layout from './features/layout/Layout.jsx'
import HomeSwitcher from './features/home/HomeSwitcher.jsx'
import TurnDetailPage from './features/turn/turnDetailPage.jsx'
import Checkout from './features/checkout/Checkout.jsx'
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx'
import HistorialTurnosPage from './features/historial/historial.jsx'
import MisTurnosPage from './features/misTurnos/misTurnosPage.jsx'
import AuthScreen from './features/auth/AuthScreen.jsx'
import NotificacionesScreen from './features/NotificacionesScreen/NotificacionesScreen.jsx'
import PerfilScreen from './features/perfil/PerfilScreen.jsx'
import BusquedaServiciosPage from './features/busquedaDeServicios/BusquedaServiciosPage.jsx'

// Componentes / Features médico
import MedicoAgenda from './features/medico/agenda/MedicoAgenda'

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function GuestRoute() {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <Navigate to="/" replace /> : <AuthScreen />
}

function App() {
  return (
    <CarritoProvider>
      <UsuarioProvider>
        <NotificacionesProvider>
          <Routes>
            <Route path="/login" element={<GuestRoute />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomeSwitcher />} />
                <Route path="home" element={<HomeSwitcher />} />
                <Route path="turnos/:id" element={<TurnDetailPage />} />
                <Route path="reserva-de-turnos" element={<ReservarTurnosPage />} />
                <Route path="busqueda-de-servicios" element={<BusquedaServiciosPage />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="historial" element={<HistorialTurnosPage />} />
                <Route path="mis-turnos" element={<MisTurnosPage />} />
                <Route path="notificaciones" element={<NotificacionesScreen />} />
                <Route path="perfil" element={<PerfilScreen />} />
              </Route>

              <Route path="/medico/home" element={<Navigate to="/home" replace />} />

              <Route path="/medico/agenda" element={<Layout />}>
                <Route index element={<MedicoAgenda />} />
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
