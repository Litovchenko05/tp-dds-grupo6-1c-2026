import Navbar from '../../components/navbar/Navbar';
import TurnSearchBar from '../../components/turnSearchBar/TurnSearchBar';
import TurnsGrid from '../../components/turnsGrid/TurnsGrid';
import './Home.css';

const Home = () => {
    return (
      <>
       
        <div className="home-body">
          <TurnSearchBar />
        </div>
        <TurnsGrid />
      </>
    );
};

export default Home;