const turnosAgendaMock = [
  {
    id: 'T-1001',
    fecha: '2026-06-21',
    hora: '09:00 - 09:30',
    paciente: 'Juan Pérez',
    servicio: 'Cardiología',
    sede: 'Sede Centro',
    estado: 'CONFIRMADO',
  },
  {
    id: 'T-1002',
    fecha: '2026-06-21',
    hora: '10:30 - 11:00',
    paciente: 'María Gómez',
    servicio: 'Clínica Médica',
    sede: 'Sede Norte',
    estado: 'CONFIRMADO',
  },
  {
    id: 'T-1003',
    fecha: '2026-06-22',
    hora: '11:15 - 11:45',
    servicio: 'Dermatología',
    sede: 'Sede Centro',
    estado: 'DISPONIBLE',
  },
  {
    id: 'T-1004',
    fecha: '2026-06-23',
    hora: '08:45 - 09:15',
    paciente: 'Carlos López',
    servicio: 'Traumatología',
    sede: 'Sede Sur',
    estado: 'CANCELADO',
    permiteReactivarDisponible: true,
  },
]

export default turnosAgendaMock
