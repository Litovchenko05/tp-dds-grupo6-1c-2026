import TurnSearchBar from '../../components/turnSearchBar/TurnSearchBar.jsx'
import TurnsGrid from '../../components/turnsGrid/TurnsGrid'
import { useState } from 'react'
import './reservarTurnosPage.css'

const ReservarTurnosPage = () => {
  const [filtros, setFiltros] = useState(null)
  return (
    <>
      <div className="home-body">
        <TurnSearchBar onBuscar={setFiltros} />
      </div>

      <TurnsGrid filtros={filtros} />
    </>
  )
}

export default ReservarTurnosPage
