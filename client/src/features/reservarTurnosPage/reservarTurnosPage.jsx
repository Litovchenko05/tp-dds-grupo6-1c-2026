import BannerPage from "../../components/banner/banner.jsx";
import TurnSearchBar from "../../components/turnSearchBar/TurnSearchBar.jsx";
import TurnsGrid from "../../components/turnsGrid/TurnsGrid";

import "./reservarTurnosPage.css";


const ReservarTurnosPage = () => {
  
  return (
    <>
    <BannerPage/>
    <div className="home-body">
        <TurnSearchBar />
    </div>

        <TurnsGrid />
    </>
  );
};

export default ReservarTurnosPage;
