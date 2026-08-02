import { useState, useEffect } from 'react'
import { pacienteService } from './pacienteService'

export function usePacienteSection(idPaciente) {
  const [obrasSociales, setObrasSociales] = useState([])
  const [coberturaGuardada, setCoberturaGuardada] = useState(null)
  const [obraSocial, setObraSocial] = useState('')
  const [plan, setPlan] = useState('')
  const [cargando, setCargando] = useState(false)
  const [guardadoExitoso, setGuardadoExitoso] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await pacienteService.getObrasSociales()
        const listaObras = Array.isArray(res) ? res : res.data || []
        setObrasSociales(listaObras)
      } catch (error) {
        console.error('Error al cargar obras sociales:', error)
      }
    }
    cargarDatos()
  }, [])

  useEffect(() => {
    async function cargarCobertura() {
      try {
        const data = await pacienteService.obtenerCobertura(idPaciente)
        if (data && (data.obraSocial || data.plan)) {
          setCoberturaGuardada(data)
          setObraSocial(data.obraSocial?._id || data.obraSocial || '')
          setPlan(data.plan?._id || data.plan || '')
        } else {
          setCoberturaGuardada(null)
        }
      } catch (error) {
        console.error('Error al cargar cobertura:', error)
      }
    }
    if (idPaciente) cargarCobertura()
  }, [idPaciente])

  const obraSocialSeleccionadaObj = obrasSociales.find(
    (os) => String(os._id) === String(obraSocial)
  )

  const planesDisponibles = Array.isArray(obraSocialSeleccionadaObj?.planes)
    ? obraSocialSeleccionadaObj.planes
    : []

  const handleObraSocialChange = (e) => {
    const nuevaOsId = e.target.value
    setObraSocial(nuevaOsId)
    setPlan('')
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setGuardadoExitoso(false)

    try {
      await pacienteService.definirCobertura(idPaciente, {
        obraSocialId: obraSocial,
        planId: plan,
      })
      setCoberturaGuardada({
        obraSocial: obraSocialSeleccionadaObj || obraSocial,
        plan: planesDisponibles.find((p) => String(p._id) === String(plan)) || plan,
      })
      setGuardadoExitoso(true)
    } catch (error) {
      console.error('Error al actualizar cobertura:', error)
    } finally {
      setCargando(false)
    }
  }

  const nombreObraSocialGuardada =
    coberturaGuardada?.obraSocial?.nombre ||
    obrasSociales.find((os) => String(os._id) === String(coberturaGuardada?.obraSocial))?.nombre

  const nombrePlanGuardado =
    coberturaGuardada?.plan?.nombre ||
    planesDisponibles.find((p) => String(p._id) === String(coberturaGuardada?.plan))?.nombre

  return {
    obrasSociales,
    coberturaGuardada,
    obraSocial,
    plan,
    setPlan,
    cargando,
    guardadoExitoso,
    planesDisponibles,
    nombreObraSocialGuardada,
    nombrePlanGuardado,
    handleObraSocialChange,
    handleGuardar,
  }
}
