import { useState, useEffect } from "react";
import CategoryList from "../components/CategoryList.jsx";
import Footer from "./Footer.jsx"; 
import "../css/educativos.css";
import "../css/inter.css"; 

/* =========================================
   1. COMPONENTES AUXILIARES (Iconos y Carrusel)
   ========================================= */

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* MODIFICADO: Flechas ahora tienen clase 'edu-arrow-in' */
function HeroCarousel({ images, index, setIndex, onOpenLightbox, height = 488 }) {
  const n = images.length;
  const prev = () => setIndex(v => (v - 1 + n) % n);
  const next = () => setIndex(v => (v + 1) % n);

  return (
    <div className="cr" style={{ "--cr-height": `${height}px` }}>
      <div className="container cr-inner">
        <div className="cr-grid">
          <div className="cr-main">
            <div className="cr-wrap">
              
              {/* Flecha izquierda (ADENTRO) */}
              {n > 1 && (
                <button className="cr-arrow edu-arrow-in edu-prev" onClick={prev} aria-label="Anterior">
                  <ArrowLeft />
                </button>
              )}

              {/* Flecha derecha (ADENTRO) */}
              {n > 1 && (
                <button className="cr-arrow edu-arrow-in edu-next" onClick={next} aria-label="Siguiente">
                  <ArrowRight />
                </button>
              )}

              <article className="cr-card">
                <img
                  className="cr-img"
                  src={images[index].src}
                  alt={images[index].alt}
                  onClick={() => onOpenLightbox(index)}
                  style={{ objectPosition: images[index].pos || "center", cursor: "pointer" }}
                />
                <div className="cr-grad" />
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   2. DATOS
   ========================================= */
const IMAGENES = [
    { src: "/img/educativo1.jpg", alt: "Educativo 1" ,pos: "center 95%" },
    { src: "/img/educativo2.jpg", alt: "Educativo 2" ,pos: "center 70%"},
    { src: "/img/educativo3.jpg", alt: "Educativo 3" ,pos: "center 95%"},
    { src: "/img/educativo4.jpg", alt: "Educativo 4" ,pos: "center 95%"},
    { src: "/img/educativo5.jpg", alt: "Educativo 5",pos: "center 95%" }
];

/* =========================================
   3. COMPONENTE PRINCIPAL
   ========================================= */
export default function EducativosHome() {
  const [idx, setIdx] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const openLb = (index) => {
    setLbIndex(index);
    setLbOpen(true);
  };
  const closeLb = () => setLbOpen(false);
  const lbPrev = () => setLbIndex(v => (v - 1 + IMAGENES.length) % IMAGENES.length);
  const lbNext = () => setLbIndex(v => (v + 1) % IMAGENES.length);

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", onKey);
    const prevStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden"; 
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevStyle;
    };
  }, [lbOpen]);

  return (
    <>
      <main className="edu2-page">
        {/* Título + texto */}
        <section className="edu2-hero">
          <div className="container text-center">
            <h1 className="font-tommy w-500">EDUCATIVOS</h1>
            <p className="font-helvetica w-200">
              Los viajes educativos son una oportunidad para aprender, descubrir y
              crecer fuera del aula.<br/> En <strong>Corditur</strong> organizamos salidas
              escolares con propuestas seguras, bien planificadas y con
              acompañamiento constante,<br/> para que cada experiencia sea tan
              enriquecedora como inolvidable.
            </p>
          </div>
        </section>

        <CategoryList categoria="educativos" />

        {/* SECCIÓN GALERÍA */}
        <section className="edu2-gallery my-5">
            <HeroCarousel
              images={IMAGENES}
              index={idx}
              setIndex={setIdx}
              onOpenLightbox={openLb}
              height={500} 
            />

            {/* SECCIÓN DESCARGAS */}
            <div className="container">
              <div className="edu2-downloads text-center mt-5">
                <h3 className="font-tommy w-600 descarg">DESCARGA TODO LO NECESARIO</h3>
                <div className="edu2-dl-row">
                  <a className="edu2-pill font-tommy w-500" href="/docs/FichaM-Edu.pdf" download>
                    FICHA MÉDICA
                  </a>
                  <a className="edu2-pill font-tommy w-500" href="/pdfs/permiso-educativo.pdf" download>
                    PERMISO EDUCATIVO
                  </a>
                  <a className="edu2-pill font-tommy w-500" href="/docs/FichaAdhesionEDUCATIVO.pdf" download>
                    FICHA DE ADHESIÓN
                  </a>
                </div>
              </div>
            </div>
        </section>

        {/* LIGHTBOX */}
        {lbOpen && (
          <div className="lb-overlay" onClick={closeLb}>
            <div className="lb-box" onClick={(e) => e.stopPropagation()}>
              <img className="lb-img" src={IMAGENES[lbIndex].src} alt={IMAGENES[lbIndex].alt} />
              <button className="lb-close" onClick={closeLb} aria-label="Cerrar"><CloseIcon/></button>
              {IMAGENES.length > 1 && (
                <>
                  <button className="lb-prev" onClick={lbPrev} aria-label="Anterior"><ArrowLeft/></button>
                  <button className="lb-next" onClick={lbNext} aria-label="Siguiente"><ArrowRight/></button>
                </>
              )}
            </div>
          </div>
        )}

      </main>
    </>
  );
}