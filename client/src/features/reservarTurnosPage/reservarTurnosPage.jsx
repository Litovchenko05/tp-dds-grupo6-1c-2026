import TurnSearchBar from '../../components/turnSearchBar/TurnSearchBar.jsx'
import TurnsGrid from '../../components/turnsGrid/TurnsGrid'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './reservarTurnosPage.css'

const ReservarTurnosPage = () => {
  const [filtros, setFiltros] = useState(null)
  const location = useLocation()
  const filtrosIniciales = location.state || null

  return (
    <>
      <div className="home-body">
        <TurnSearchBar onBuscar={setFiltros} filtrosIniciales={filtrosIniciales} />
      </div>

      <TurnsGrid filtros={filtros} />
    </>
  )
}

export default ReservarTurnosPage
