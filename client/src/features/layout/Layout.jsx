import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header  from "../../components/header/Header";
import Footer from "../../components/Footer/Footer"

const Layout = () => {
    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            <main className="layout-content">
                <Outlet />
            </main>
            <Footer></Footer>
        </>
    );
};

export default Layout;