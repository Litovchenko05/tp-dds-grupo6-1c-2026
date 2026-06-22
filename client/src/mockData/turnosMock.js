const turnos = [
  {
    id: 1,
    medico: "Julián Barrasi",
    servicio: "Cardiología",
    sede: "Av. Medrano 772",
    fecha: "13/06/2026",
    hora: "10:00",
    costo: "35000",
    estado: "DISPONIBLE"
  },
  {
    id: 2,
    medico: "María Fernández",
    servicio: "Electrocardiograma", 
    sede: "Av. Rivadavia 4500",
    fecha: "14/06/2026",
    hora: "09:30",
    costo: "28000",
    estado: "DISPONIBLE"
  },
  {
    id: 3,
    medico: "Carlos Gómez",
    servicio: "Pediatría",
    sede: "Av. Cabildo 1200",
    fecha: "15/06/2026",
    hora: "11:00",
    costo: "32000",
    estado: "DISPONIBLE"
  },
  {
    id: 4,
    medico: "Laura Martínez",
    servicio: "Radiografía de Tórax", 
    sede: "Av. Santa Fe 3200",
    fecha: "16/06/2026",
    hora: "14:00",
    costo: "22000",
    estado: "DISPONIBLE"
  },
  {
    id: 5,
    medico: "Roberto Sánchez",
    servicio: "Dermatología",
    sede: "Av. Corrientes 1800",
    fecha: "17/06/2026",
    hora: "16:30",
    costo: "30000",
    estado: "DISPONIBLE"
  },
  {
    id: 6,
    medico: "Ana López",
    servicio: "Ecografía Abdominal", 
    sede: "Av. Belgrano 950",
    fecha: "18/06/2026",
    hora: "08:45",
    costo: "40000",
   estado: "DISPONIBLE"
  },
  {
    id: 7,
    medico: "Fernando Ruiz",
    servicio: "Oftalmología",
    sede: "Av. Directorio 2100",
    fecha: "19/06/2026",
    hora: "13:15",
    costo: "33000",
    estado: "DISPONIBLE"
  },
  {
    id: 8,
    medico: "Valentina Castro",
    servicio: "Análisis Clínico", 
    sede: "Av. Callao 850",
    fecha: "20/06/2026",
    hora: "07:30",
    costo: "18000",
    estado: "DISPONIBLE"
  }
];

async function obtenerTurnos() {
  return turnos;
}

async function obtenerTurnoPorId(id) {
  return turnos.find((turno) => turno.id === id) ?? null;
}

export { turnos, obtenerTurnos, obtenerTurnoPorId };