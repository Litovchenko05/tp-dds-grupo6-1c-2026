import { Link } from 'react-router-dom';
import './Navbar.css';
import '../../index.css';
import IconButton from '@mui/material/IconButton';
import Badge  from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import TemporaryDrawer from '../menuLateral/Drawer.jsx';

const Navbar = () => {

  
  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section left">
          <div className="navbar-section left">
          <TemporaryDrawer/>
        </div>
        </div>

        <div className="navbar-section center">
          <div className="brand">
            <img src={'../../../images/logo-sweet-medical.png'} alt="Sweet Medical" className="drawer-logo" />
            <Link to={`/`} className="link-no-style">
            <h1 className="brand-text"> Sweet Medical <br>
            </br> Plataforma de Seguro de la Salud </h1></Link>
          </div>
        </div>
     

        <div className="navbar-section right">
          <IconButton aria-label="view cart with 2 items">
            <Badge badgeContent={2} color="primary">
              <ShoppingCartIcon  sx={{ fontSize: 35 }}/>
            </Badge>
          </IconButton>
        </div>
      </nav>


    </header>
  );
};

export default Navbar;
