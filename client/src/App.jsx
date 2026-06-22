import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// Contextos
import { CarritoProvider } from './context/CarritoContext.jsx'

// Componentes de tu compañera
import Home from './features/home/Home.jsx'
import Layout from './features/layout/Layout.jsx'
import TurnDetailPage from './features/turn/turnDetailPage.jsx'
import Checkout from './features/checkout/Checkout.jsx'
import ReservarTurnosPage from './features/reservarTurnosPage/reservarTurnosPage.jsx'
import HistorialTurnosPage from './features/historial/historial.jsx'
import MisTurnosPage from './features/misTurnos/misTurnosPage.jsx'
import AuthScreen from './features/AuthScreen/AuthScreen.jsx'

function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <CarritoProvider>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthScreen />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="turnos/:id" element={<TurnDetailPage />} />
            <Route path="reserva-de-turnos" element={<ReservarTurnosPage />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="historial" element={<HistorialTurnosPage />} />
            <Route path="mis-turnos" element={<MisTurnosPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CarritoProvider>
  )
}

export default App
