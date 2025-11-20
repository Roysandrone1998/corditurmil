import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../pages/Footer.jsx";
import "../css/footer.css";

export default function Main() {
    return (
        <>
        <Navbar />
        <main className="container">
            <Outlet />
        </main>
           <Footer />
        </>
    );
}