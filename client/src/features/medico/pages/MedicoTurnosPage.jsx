import React from 'react'
import '../styles/medicoTurnosPage.css'
import TurnosMedicoTable from '../components/TurnosMedicoTable'

function MedicoTurnosPage() {
  return (
    <main className="medico-turnos-page">
      <h1 className="medico-turnos-page__title">Turnos del médico</h1>
      <p className="medico-turnos-page__subtitle">
        Aquí podrás visualizar, cancelar y marcar turnos como realizados.
      </p>
      <TurnosMedicoTable />
    </main>
  )
}

export default MedicoTurnosPage
