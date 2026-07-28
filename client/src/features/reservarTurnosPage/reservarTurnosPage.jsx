import TurnSearchBar from "../../components/turnSearchBar/TurnSearchBar.jsx";
import TurnsGrid from "../../components/turnsGrid/TurnsGrid";

import "./reservarTurnosPage.css";


const ReservarTurnosPage = () => {
  
  return (
    <>
   
    <div className="home-body">
        <TurnSearchBar />
    </div>

        <TurnsGrid />
    </>
  );
};

export default ReservarTurnosPage;
