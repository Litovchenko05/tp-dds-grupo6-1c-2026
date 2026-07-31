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
    <div className="">
      <div className="">
        <TurnSearchBar onBuscar={setFiltros} filtrosIniciales={filtrosIniciales} />
        <div className="">
          <TurnsGrid filtros={filtros} />
        </div>
      </div>
    </div>
  )
}

export default ReservarTurnosPage
