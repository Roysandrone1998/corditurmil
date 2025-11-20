import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/nav.css";

// Base de datos de búsqueda (puedes mover esto a un archivo separado)
const SEARCHABLE_ITEMS = [
  // Secciones
  { label: "Inicio", path: "/" },
  { label: "Individuales", path: "/individuales" },
  { label: "Egresados", path: "/egresados" },
  { label: "Educativos", path: "/educativos" },
  { label: "Nacionales", path: "/nacionales" },
  { label: "Internacionales", path: "/internacionales" },
  { label: "Contacto", path: "/contacto" },
  { label: "Quiénes Somos", path: "/quienes-somos" },


  // Ejemplo de destinos reales (¡ajusta según tu catálogo!)
  { label: "Bariloche - Invierno 2025", path: "/nacionales/bariloche" },
  { label: "Europa Express - 21 Días", path: "/internacionales/europa" },
  { label: "Salta y Jujuy - Norte Argentino", path: "/nacionales/salta-jujuy" },
  { label: "Brasil - Rio y Foz", path: "/internacionales/brasil" },
  { label: "Colonia - 3 Días", path: "/internacionales/colonia" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // solo para móvil
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Cerrar dropdown si se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = SEARCHABLE_ITEMS.filter(item =>
    item.label.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 6); // máximo 6 resultados

  const handleSelect = (path) => {
    navigate(path);
    setTerm("");
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const isMobile = window.innerWidth <= 768;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      const exact = SEARCHABLE_ITEMS.find(i =>
        i.label.toLowerCase() === term.toLowerCase()
      );
      if (exact) {
        handleSelect(exact.path);
      } else if (filteredItems.length > 0) {
        handleSelect(filteredItems[0].path);
      }
    }
  };

  return (
    <>
      <nav className="navbar-slim" ref={searchRef}>
        <button
          className="btn-hamb"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
        >
          <span></span><span></span><span></span>
        </button>

        <Link to="/" className="logo-centered" aria-label="Ir al inicio">
          <img src="/img/logo.png" alt="Corditur" className="logo-img" />
        </Link>

        {/* 🔍 Búsqueda */}
        <form className="search-container" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            aria-label="Buscar en el sitio"
            aria-expanded={isSearchFocused && filteredItems.length > 0}
            aria-controls="search-results"
          />
          <button
            className="search-button"
            type="submit"
            aria-label="Buscar"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                setIsMobileSearchOpen(true);
                setIsSearchFocused(true);
              }
            }}
          >
            <img src="/img/lupita.png" alt="" className="lupita" />
          </button>
        </form>

        {/* 📋 Resultados en vivo (solo en desktop) */}
        {!isMobile && isSearchFocused && term && filteredItems.length > 0 && (
          <ul
            id="search-results"
            className="search-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              zIndex: 100,
              maxHeight: '240px',
              overflowY: 'auto',
              listStyle: 'none',
              padding: 0,
              margin: '8px 0 0 0',
            }}
          >
            {filteredItems.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelect(item.path)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f1f4a',
                  }}
                  onMouseDown={(e) => e.preventDefault()} // evita pérdida de foco
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* 📱 Modal de búsqueda para móvil */}
      {isMobile && isMobileSearchOpen && (
        <div
          className="drawer-overlay open"
          onClick={() => setIsMobileSearchOpen(false)}
          style={{ zIndex: 120 }}
        >
          <div className="drawer-backdrop" style={{ opacity: 1 }} />
          <div
            className="drawer-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(90%, 500px)',
              maxWidth: '90vw',
            }}
          >
            <div className="drawer-head">
              <span style={{ fontSize: '16px', fontWeight: 700 }}>Buscar</span>
              <button
                className="drawer-close"
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Cerrar búsqueda"
              >
                ×
              </button>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Escribí un destino o sección..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '999px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
              {term && filteredItems.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '12px' }}>
                  {filteredItems.map((item, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleSelect(item.path)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px',
                          background: '#f5f8ff',
                          border: '1px solid #e0e6ff',
                          borderRadius: '12px',
                          fontWeight: 600,
                          color: '#0f1f4a',
                          cursor: 'pointer',
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {term && filteredItems.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '16px', color: '#888' }}>
                  No se encontraron resultados.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú hamburguesa (tu código existente) */}
      <aside
        className={`drawer-overlay ${open ? "open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        role="dialog"
        aria-modal={open}
        aria-label="Menú principal"
      >
        <div className="drawer-backdrop" />
        <div className="drawer-card" role="document">
          <div className="drawer-head">
            <img src="/img/logo.png" alt="" className="drawer-badge" />
            <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
          </div>
          <ul className="drawer-list">
            {[{ label: "INDIVIDUALES", path: "/individuales" },
              { label: "EGRESADOS", path: "/egresados" },
              { label: "EDUCATIVOS", path: "/educativos" },
              { label: "ADMIN", path: "/login" }]
              .map((i) => (
                <li key={i.path}>
                  <NavLink
                    to={i.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      "drawer-link" + (isActive ? " active" : "")
                    }
                  >
                    {i.label}
                  </NavLink>
                </li>
              ))}
          </ul>
          <div className="drawer-section">SÍGUENOS</div>
          <div className="drawer-social">
            <a href="https://wa.me/5493430000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src="/img/wspazul.png" alt="" className="drawer-icon-img" />
            </a>
            <a href="https://www.instagram.com/corditur" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/img/instaazul.png" alt="" className="drawer-icon-img" />
            </a>
            <a href="https://www.facebook.com/corditur" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/img/faceazul.png" alt="" className="drawer-icon-img" />
            </a>
            <a href="https://www.instagram.com/corditur" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/img/instaceleste.png" alt="" className="drawer-icon-img" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}