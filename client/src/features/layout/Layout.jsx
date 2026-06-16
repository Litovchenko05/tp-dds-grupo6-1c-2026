import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header  from "../../components/header/Header";
import Footer from "../../components/Footer/Footer"

const Layout = () => {
 return (
    <div className="layout">
      <Header />
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;