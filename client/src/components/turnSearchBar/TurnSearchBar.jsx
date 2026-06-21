import './TurnSearchBar.css';
import { FaStethoscope, FaSearch } from 'react-icons/fa';
import Button from '@mui/material/Button';

const TurnSearchBar = () => {

return (

  <div className='banner'>
    <div className="turn-search">
 
        <div className="search-row">

        <div className="input-buscador">
          <FaStethoscope className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="¿Qué servicio buscas?"
          />
        </div>

        <Button
          variant="contained"
          id="search-button"
          startIcon={<FaSearch id='iconoBotonSearch' />}
          sx={{
            backgroundColor: '#c62828',
            '&:hover': {
              backgroundColor: '#b71c1c'
            }
          }}
        >
        <span className='text-buscador'>Buscar</span>
        </Button>

      </div>

      <div className="filters-grid">

        <div className="input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Profesional"
          />
        </div>

        <div className="input-wrapper">
          <select className="search-input">
            <option value="">Especialidad</option>
            <option>Cardiología</option>
            <option>Clínica Médica</option>
            <option>Pediatría</option>
          </select>
        </div>

        <div className="input-wrapper">
          <select className="search-input">
            <option value="">Práctica</option>
            <option>Electrocardiograma</option>
            <option>Radiografía</option>
            <option>Análisis Clínico</option>
          </select>
        </div>

        <div className="input-wrapper">
          <select className="search-input">
            <option value="">Sede</option>
            <option>Caballito</option>
            <option>Palermo</option>
            <option>Belgrano</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label>Desde</label>
          <input
            type="date"
            className="search-input" 
          />
        </div>

        <div className="input-wrapper">
          <label>Hasta</label>
          <input
            type="date"
            className="search-input"
          />
        </div>

      </div>

   </div>
  </div>

);
};

export default TurnSearchBar;