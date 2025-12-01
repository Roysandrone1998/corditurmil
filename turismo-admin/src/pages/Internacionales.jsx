import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx"; // Asegúrate de tener este componente o bórralo si no lo usas aquí
import CategoryList from "../components/CategoryList.jsx";
import "../css/inter.css";

// Iconos SVG simples
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24">
    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24">
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);

/* Componente Carrusel Reutilizable */
const HeroCarousel = memo(({ images, index, setIndex, onOpenLightbox }) => {
  const n = images.length;
  
  // Lógica circular segura
  const prev = () => setIndex(v => (v - 1 + n) % n);
  const next = () => setIndex(v => (v + 1) % n);

  if (n === 0) return null;

  return (
    <div className="cr">
        <div className="cr-wrap">
            {/* Botones de navegación (Sólo si hay más de 1 imagen) */}
            {n > 1 && (
                <>
                    <button className="cr-arrow cr-prev-out" onClick={prev} aria-label="Anterior">
                        <ArrowLeft />
                    </button>
                    <button className="cr-arrow cr-next-out" onClick={next} aria-label="Siguiente">
                        <ArrowRight />
                    </button>
                </>
            )}

            {/* Tarjeta de Imagen */}
            <article className="cr-card">
                <img
                    className="cr-img"
                    src={images[index].src}
                    alt={images[index].alt || "Imagen viaje"}
                    onClick={() => onOpenLightbox(index)}
                    loading="lazy"
                />
                <div className="cr-grad" />
            </article>
        </div>
    </div>
  );
});

export default function Individuales() {
  // DATOS MOCK (Rellena con tus datos reales)
  const imagesNac = [
    { src: "/img/individuales2.png", alt: "Nacional 2" },
    { src: "/img/individuales3.png", alt: "Nacional 3" },
  ];
  
  const imagesInt = [
    { src: "/img/individuales2.png", alt: "Internacional 1" },
    { src: "/img/individuales3.png", alt: "Internacional 2" },
  ];

  const [i1, setI1] = useState(0);
  const [i2, setI2] = useState(0);

  // --- LÓGICA LIGHTBOX ---
  const [lbOpen, setLbOpen] = useState(false);
  const [lbList, setLbList] = useState([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openLb = (list, idx) => {
    setLbList(list);
    setLbIndex(idx);
    setLbOpen(true);
  };
  
  const closeLb = () => setLbOpen(false);

  // Navegación Lightbox
  const lbPrev = (e) => { e?.stopPropagation(); setLbIndex(v => (v - 1 + lbList.length) % lbList.length); };
  const lbNext = (e) => { e?.stopPropagation(); setLbIndex(v => (v + 1) % lbList.length); };

  // Manejo de teclas (ESC, Flechas)
  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", onKey);
    // Bloquear scroll del body
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lbOpen, lbList]);

  return (
    <main className="page bg-pattern-lg">
      
      {/* 1. HERO SECTION */}
      <section className="inter-hero text-white text-center">
        {/* Usamos 'container' para que el texto no se pegue a los bordes en celular */}
        <div className="container">
          <h1 className="font-tommy">
            ¿ESTÁS LISTO PARA TU<br /> PRÓXIMO VIAJE?
          </h1>
          <p className="font-helvetica">
            En Corditur te ayudamos a viajar a donde soñás, con propuestas diseñadas para que disfrutes sin preocuparte por nada.<br className="d-none d-md-block" />
            Viajás solo, en pareja o con amigos… y nosotros nos ocupamos de todo lo demás.
          </p>
        </div>
      </section>

      {/* 2. SECCIÓN NACIONALES */}
      <section className="mb-5">
        <HeroCarousel
          images={imagesNac}
          index={i1}
          setIndex={setI1}
          onOpenLightbox={(idx) => openLb(imagesNac, idx)}
        />
        
        <div className="container mt-4">
            <CategoryList categoria="nacional" limit={3} />
            
            <div className="text-center mt-5 mb-5">
                <Link to="/nacionales" className="btn btn-outline-light rounded-pill px-4 font-helvetica w-400">
                    VER MÁS FECHAS
                </Link>
            </div>
        </div>
      </section>

      {/* 3. SECCIÓN INTERNACIONALES */}
      <section className="mb-5">
          <div className="container text-center">
            <h2 className="h2inter font-tommy w-500 text-white">VIAJES INTERNACIONALES</h2>
            <p className="pinter text-white font-helvetica w-200">
                Descubrí el mundo con <strong>Corditur</strong>. Organizamos experiencias únicas a destinos internacionales.
                Desde Brasil y Uruguay, hasta Europa y más. Vos elegís el lugar, nosotros lo hacemos realidad.
            </p>
          </div>

          <HeroCarousel
            images={imagesInt}
            index={i2}
            setIndex={setI2}
            onOpenLightbox={(idx) => openLb(imagesInt, idx)}
          />

          <div className="container mt-4">
            <CategoryList categoria="internacional" limit={3} />
            
            <div className="text-center mt-5 mb-5">
                <Link to="/internacionales" className="btn btn-outline-light rounded-pill px-4 font-helvetica w-400">
                    VER MÁS FECHAS
                </Link>
            </div>
          </div>
      </section>

      {/* 4. LIGHTBOX MODAL */}
      {lbOpen && lbList.length > 0 && (
        <div className="lb-overlay" onClick={closeLb}>
          <div className="lb-box" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={closeLb} aria-label="Cerrar"><CloseIcon/></button>
            
            <img 
                className="lb-img" 
                src={lbList[lbIndex].src} 
                alt={lbList[lbIndex].alt} 
            />
            
            {lbList.length > 1 && (
              <>
                <button className="lb-prev" style={{left: '-20px', position: 'absolute', top: '50%'}} onClick={lbPrev}><ArrowLeft/></button>
                <button className="lb-next" style={{right: '-20px', position: 'absolute', top: '50%'}} onClick={lbNext}><ArrowRight/></button>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  );
}