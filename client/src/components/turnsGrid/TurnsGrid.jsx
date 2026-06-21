import { useEffect, useState } from 'react'
import './TurnsGrid.css'
import { turnos } from '../../mockData/turnosMock'
import TurnItem from '../turnItem/TurnItem.jsx'
import TurnGridSkeleton from '../common/TurnGridSkeleton'

// import { productos } from "../../mockdata/Productos";
// import CarouselItem from "../productItem/CarouselItem";

export default function TurnsGrid() {
  // Loading State
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <TurnGridSkeleton items={6} />
  }

  return (
    <div className="contenedor-turnos">
      {turnos.map((turno) => (
        <TurnItem turno={turno} key={turno.id} />
      ))}
    </div>
  )
}
