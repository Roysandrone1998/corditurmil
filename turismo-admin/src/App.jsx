import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./layout/Main.jsx";
import Individuales from "./pages/Individuales.jsx";
import Nacionales from "./pages/Nacionales.jsx";
import Egresados from "./pages/Egresados.jsx";
import Educativos from "./pages/Educativos.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Admin from "./pages/Admin.jsx";
import Internacionales from "./pages/Internacionales.jsx";
import Home from "./pages/Home.jsx"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout principal */}
        <Route element={<Main />}>
          <Route path="/" element={<Home />} />
          <Route path="/individuales" element={<Individuales />} />
          <Route path="/nacionales" element={<Nacionales />} />
          <Route path="/egresados" element={<Egresados />} />
          <Route path="/educativos" element={<Educativos />} />
          <Route path="/internacionales" element={<Internacionales />} />
        </Route>

        {/* Rutas admin */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/internacionales" replace />} />
      </Routes>
    </BrowserRouter>
  );
}