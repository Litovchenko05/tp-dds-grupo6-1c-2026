import './TurnSearchBar.css';
import Typography from '@mui/material/Typography';
import { FaStethoscope, FaSearch, FaHospital,FaFlask,FaUserMd,FaMicroscope } from 'react-icons/fa';
import Button from '@mui/material/Button';

const TurnSearchBar = () => {

return (


  <div className="turn-search">
      <Typography variant="h4" className="page-title">
          Búsqueda de turnos
      </Typography>
      <p>
      Encontrá y reservá turnos médicos en segundos. 
      </p>
      <div className="filters-grid">
        <div className="input-wrapper">
          <FaUserMd className="search-icon"/>
          <input
            type="text"
            className="search-input"
            placeholder="Busca por profesional"
          />
        </div>
        <div className="input-wrapper">
          <FaStethoscope className="search-icon" />
          <select className="search-input">
            <option value="">Especialidad</option>
            <option>Cardiología</option>
            <option>Dermatología</option>
            <option>Pediatría</option>
          </select>
        </div>

        <div className="input-wrapper">
          <FaMicroscope className="search-icon" />
          <select className="search-input">
            <option value="">Práctica</option>
            <option>Electrocardiograma</option>
            <option>Radiografía</option>
            <option>Análisis Clínico</option>
          </select>
        </div>

        <div className="input-wrapper">
          <FaHospital className="search-icon" />
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

      <div class="div-search-button">
        <Button
          variant="contained"
          id="search-button"
          startIcon={<FaSearch id='iconoBotonSearch' />}
          sx={{
            backgroundColor: '#0f2d99',
            '&:hover': {
              backgroundColor: '#0a206e'
            }
          }}
        >
        
        <span className='text-buscador'>Buscar</span>
        </Button>
      </div>
      

      </div>

   </div>

);
};

export default TurnSearchBar;