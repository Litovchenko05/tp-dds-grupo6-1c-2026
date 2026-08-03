import { useState, useEffect } from 'react'
import { medicoService } from './medicoService.js'

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

  const [accionPopup, setAccionPopup] = useState('nuevo')
  const [servicioEditando, setServicioEditando] = useState(null)

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

  const handleAbrirPopup = () => {
    setAccionPopup('nuevo')
    setOpenPopup(true)
  }

  const handleCerrarPopup = () => {
    setOpenPopup(false)
    setServicioEditando(null)
    setTipoSeleccionado('')
    setServicioObjeto(null)
    setDuracionSeleccionada('')
    setPrecioInput('')
    setSedeObjeto(null)
    setDiaSemana('')
    setHoraDesde('')
    setHoraHasta('')
  }

  const handleAbrirPopupEdicion = (servicio, tipoAccion) => {
    setAccionPopup(tipoAccion === 'servicio' ? 'editarServicio' : 'editarDisponibilidad')
    setServicioEditando(servicio)

    setTipoSeleccionado(servicio.tipo || '')
    setServicioObjeto({ _id: servicio.servicioId || servicio._id, nombre: servicio.nombre })
    setDuracionSeleccionada(`${parseInt(servicio.duracion, 10)} min`)
    setPrecioInput(String(servicio.precio ?? servicio.costo ?? ''))
    setSedeObjeto(sedes.find((s) => s.nombre === servicio.sede) || null)
    setDiaSemana(servicio.diaSemana || '')
    setHoraDesde(servicio.horaDesde || '')
    setHoraHasta(servicio.horaHasta || '')

    setOpenPopup(true)
  }

  const handleAddServicioYDisponibilidad = async (e) => {
    e.preventDefault()

    const esEditarServicio = accionPopup === 'editarServicio'
    const esEditarDisponibilidad = accionPopup === 'editarDisponibilidad'
    const esNuevo = accionPopup === 'nuevo'

    // Validación según la acción
    if (esEditarServicio && (!duracionSeleccionada || !precioInput)) return
    if (esEditarDisponibilidad && (!diaSemana || !horaDesde || !horaHasta)) return
    if (
      esNuevo &&
      (!servicioObjeto ||
        !duracionSeleccionada ||
        !precioInput ||
        !sedeObjeto ||
        !diaSemana ||
        !horaDesde ||
        !horaHasta)
    )
      return

    setCargando(true)
    try {
      const duracionMinutos = parseInt(duracionSeleccionada, 10)
      const diaSemanaFormateado = diaSemana
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
      const tipoDisponibilidadEnum = tipoSeleccionado
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      if (esEditarServicio) {
        const servicioActualizadoData = {
          duracion: duracionMinutos,
          costo: Number(precioInput),
        }

        await medicoService.actualizarServicio(
          idMedico,
          servicioEditando.idServicio,
          servicioActualizadoData
        )

        const disponibilidadActualizadaData = {
          diaSemana: diaSemanaFormateado,
          horaDesde,
          horaHasta,
          duracion: duracionMinutos,
          sedeId: sedeObjeto._id,
          servicioId: servicioEditando.idServicio,
          tipoDeServicio: tipoDisponibilidadEnum,
          costo: Number(precioInput),
        }

        // console.log(
        //   'front Datos de disponibilidad en actualizar servicio a actualizar:',
        //   disponibilidadActualizadaData
        // )
        await medicoService.actualizarDisponibilidad(
          idMedico,
          servicioEditando.idServicio,
          disponibilidadActualizadaData
        )

        const servicioActualizadoParaVista = {
          ...servicioEditando,
          duracion: `${duracionMinutos} min`,
          precio: Number(precioInput),
          costo: Number(precioInput),
        }

        setServicios((prev) =>
          prev.map((s) => (s._id === servicioEditando._id ? servicioActualizadoParaVista : s))
        )
      } else if (esEditarDisponibilidad) {
        const nuevoServicioData = {
          diaSemana: diaSemanaFormateado,
          horaDesde,
          horaHasta,
          duracion: duracionMinutos,
          costo: Number(precioInput),
          sedeId: sedeObjeto._id,
          servicioId: servicioEditando.idServicio,
          tipoDeServicio: tipoDisponibilidadEnum,
        }

        console.log('datos para cambiar la disponibilidad', nuevoServicioData)

        await medicoService.actualizarDisponibilidad(
          idMedico,
          servicioEditando.idServicio,
          nuevoServicioData
        )

        const servicioActualizadoParaVista = {
          ...servicioEditando,
          diaSemana,
          horaDesde,
          horaHasta,
        }

        setServicios((prev) =>
          prev.map((s) => (s._id === servicioEditando._id ? servicioActualizadoParaVista : s))
        )
      } else {
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
        console.log(servicioCreado)

        console.log('ID del servicio creado:', servicioCreado._id)

        const idCreado = servicioCreado?._id || servicioObjeto._id

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
          diaSemana,
          horaDesde,
          horaHasta,
        }

        setServicios((prev) => [...prev, servicioParaVista])
      }

      handleCerrarPopup()
    } catch (error) {
      console.error('Error en el proceso de guardado:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleDeleteServicio = async (idServicio, tipo) => {
    try {
      console.log('Eliminando servicio con ID:', idServicio, 'Tipo:', tipo)
      await medicoService.eliminarServicio(idMedico, idServicio, tipo)
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

    accionPopup,
    handleAbrirPopupEdicion,
  }
}
