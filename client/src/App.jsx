import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import MedicoDrawer from './components/menuLateral/MedicoDrawer'
import MedicoAgenda from './features/medico/agenda/MedicoAgenda'
import MedicoHome from './features/medico/home/MedicoHome'

function App() {
  return (
    <>
      <MedicoDrawer />
      <Routes>
        <Route path="/" element={<Navigate to="/medico/home" replace />} />
        <Route path="/medico/home" element={<MedicoHome />} />
        <Route path="/medico/agenda" element={<MedicoAgenda />} />
      </Routes>
    </>
  )
}

export default App
