import { useState, useEffect } from 'react'
import { medicoService } from './medicoService'

export function useMedicoSection(idMedico) {
  const [servicios, setServicios] = useState([])
  const [catalogoServicios, setCatalogoServicios] = useState([])
  const [sedes, setSedes] = useState([])
  const [openPopup, setOpenPopup] = useState(false)
  const [cargando, setCargando] = useState(false)

  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [servicioObjeto, setServicioObjeto] = useState(null)
  const [duracionSeleccionada, setDuracionSeleccionada] = useState('')
  const [precioInput, setPrecioInput] = useState('')
  const [sedeObjeto, setSedeObjeto] = useState(null)

  const [diaSemana, setDiaSemana] = useState('')
  const [horaDesde, setHoraDesde] = useState('')
  const [horaHasta, setHoraHasta] = useState('')

  useEffect(() => {
    async function cargarDatosIniciales() {
      try {
        const resultados = await Promise.allSettled([
          medicoService.obtenerServicios(idMedico),
          medicoService.obtenerCatalogoServicios(),
          medicoService.obtenerSedes(),
        ])
        if (resultados[0].status === 'fulfilled') setServicios(resultados[0].value || [])
        if (resultados[1].status === 'fulfilled') setCatalogoServicios(resultados[1].value || [])
        if (resultados[2].status === 'fulfilled') setSedes(resultados[2].value || [])
      } catch (error) {
        console.error('Error al cargar datos del médico:', error)
      }
    }
    if (idMedico) cargarDatosIniciales()
  }, [idMedico])

  const serviciosFiltrados = catalogoServicios.filter(
    (s) => s.tipo?.toLowerCase() === tipoSeleccionado.toLowerCase()
  )

  const handleAbrirPopup = () => setOpenPopup(true)

  const handleCerrarPopup = () => {
    setOpenPopup(false)
    setTipoSeleccionado('')
    setServicioObjeto(null)
    setDuracionSeleccionada('')
    setPrecioInput('')
    setSedeObjeto(null)
    setDiaSemana('')
    setHoraDesde('')
    setHoraHasta('')
  }

  const handleAddServicioYDisponibilidad = async (e) => {
    e.preventDefault()
    if (
      !servicioObjeto ||
      !duracionSeleccionada ||
      !precioInput ||
      !sedeObjeto ||
      !diaSemana ||
      !horaDesde ||
      !horaHasta
    )
      return

    setCargando(true)
    try {
      const duracionMinutos = parseInt(duracionSeleccionada, 10)
      const tipoNormalizado = tipoSeleccionado
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      const nuevoServicioData = {
        servicioId: servicioObjeto._id,
        tipo: tipoNormalizado,
        costo: Number(precioInput),
        duracion: duracionMinutos,
        sede: sedeObjeto._id,
      }

      const servicioCreado = await medicoService.agregarServicio(idMedico, nuevoServicioData)

      const idCreado = servicioCreado?._id || servicioObjeto._id

      const diaSemanaFormateado = diaSemana
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      const tipoDisponibilidadEnum = tipoSeleccionado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      const nuevaDisponibilidadData = {
        diaSemana: diaSemanaFormateado,
        horaDesde,
        horaHasta,
        duracion: duracionMinutos,
        costo: Number(precioInput),
        sedeId: sedeObjeto._id,
        servicioId: idCreado,
        tipoDeServicio: tipoDisponibilidadEnum,
      }

      await medicoService.agregarDisponibilidad(idMedico, nuevaDisponibilidadData)

      const servicioParaVista = {
        _id: idCreado,
        nombre: servicioObjeto.nombre,
        tipo: tipoSeleccionado,
        sede: sedeObjeto.nombre,
        duracion: `${duracionMinutos} min`,
        precio: Number(precioInput),
        costo: Number(precioInput),
        diaSemana: diaSemana,
        horaDesde,
        horaHasta,
      }

      setServicios((prev) => [...prev, servicioParaVista])
      handleCerrarPopup()
    } catch (error) {
      console.error('Error en el proceso de creación:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleDeleteServicio = async (idServicio) => {
    try {
      await medicoService.eliminarServicio(idMedico, idServicio)
      setServicios((prev) => prev.filter((s) => s._id !== idServicio))
    } catch (error) {
      console.error('Error al eliminar servicio:', error)
    }
  }

  return {
    servicios,
    sedes,
    serviciosFiltrados,
    openPopup,
    cargando,

    tipoSeleccionado,
    setTipoSeleccionado,
    servicioObjeto,
    setServicioObjeto,
    duracionSeleccionada,
    setDuracionSeleccionada,
    precioInput,
    setPrecioInput,
    sedeObjeto,
    setSedeObjeto,

    diaSemana,
    setDiaSemana,
    horaDesde,
    setHoraDesde,
    horaHasta,
    setHoraHasta,

    handleAbrirPopup,
    handleCerrarPopup,
    handleAddServicioYDisponibilidad,
    handleDeleteServicio,
  }
}
