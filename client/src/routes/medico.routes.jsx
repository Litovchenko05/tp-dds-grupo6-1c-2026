import React from 'react'
import { Route } from 'react-router-dom'
import { MedicoTurnosPage } from '../features/medico'

export const medicoRoutes = [
  <Route key="medico-turnos" path="/medico/turnos" element={<MedicoTurnosPage />} />,
]
