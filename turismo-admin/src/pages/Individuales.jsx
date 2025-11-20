import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";
import CategoryList from "../components/CategoryList.jsx";
import "../css/inter.css";

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

/* Carrusel sin preview; flechas por fuera, visibles completas */
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
              {/* Flecha izquierda SOLO si ya avanzó */}
              {n > 1 && index > 0 && (
                <button className="cr-arrow cr-prev-out" onClick={prev} aria-label="Anterior">
                  <ArrowLeft />
                </button>
              )}

              {/* Flecha derecha si hay más de una imagen */}
              {n > 1 && (
                <button className="cr-arrow cr-next-out" onClick={next} aria-label="Siguiente">
                  <ArrowRight />
                </button>
              )}

              <article className="cr-card">
                <img
                  className="cr-img"
                  src={images[index].src}
                  alt={images[index].alt}
                  onClick={() => onOpenLightbox(index)}
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

export default function Individuales() {
  // NACIONALES
  const imagesNac = [

    { src: "/img/individuales2.png", alt: "Nacional 2" },
    { src: "/img/individuales3.png", alt: "Nacional 3" },
  ];
  const [i1, setI1] = useState(0);

  // INTERNACIONALES
  const imagesInt = [
    { src: "/img/individuales1.png", alt: "Internacional 1" },
    { src: "/img/individuales2.png", alt: "Internacional 2" },
    { src: "/img/individuales3.png", alt: "Internacional 3" },
  ];
  const [i2, setI2] = useState(0);

  // Lightbox (compartido)
  const [lbOpen, setLbOpen] = useState(false);
  const [lbList, setLbList] = useState([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openLbNac = (idx) => { setLbList(imagesNac); setLbIndex(idx); setLbOpen(true); };
  const openLbInt = (idx) => { setLbList(imagesInt); setLbIndex(idx); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);

  const lbPrev = () => setLbIndex(v => (v - 1 + lbList.length) % lbList.length);
  const lbNext = () => setLbIndex(v => (v + 1) % lbList.length);

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lbOpen, lbList.length]);

  return (
    <main className="page bg-pattern-lg">
      {/* HERO */}
      <section className="inter-hero text-white text-center">
        <div className="container">
          <h1 className="font-tommy w-500">¿ESTÁS LISTO PARA TU<br/> PRÓXIMO VIAJE?</h1>
          <p className="font-helvetica w-200">
            En Corditur te ayudamos a viajar a donde soñás, con propuestas diseñadas para que disfrutes sin preocuparte por nada.<br/>
            Viajás solo, en pareja o con amigos… y nosotros nos ocupamos de todo lo demás.
          </p>
        </div>
      </section>

      {/* CARRUSEL 1 */}
      <section className="my-4">
        <HeroCarousel
          images={imagesNac}
          index={i1}
          setIndex={setI1}
          onOpenLightbox={(idx) => openLbNac(idx)}
          height={488}
        />
      </section>

      {/* Lista NACIONALES (solo 3) */}
      <section className="container my-4">
        <CategoryList categoria="nacional" limit={3} />
        <div className="text-center mt-3" style={{ marginBottom : 72 }}>
          <Link to="/nacionales" className="font-helvetica w-400 text-white" >
            VER MAS FECHAS
          </Link>
        </div>
      </section>

      {/* Título INTERNACIONALES */}
      <h2 className="text-center font-tommy w-500 mb-2 text-white h2inter">VIAJES INTERNACIONALES</h2>
      <p className="text-center text-white font-helvetica w-200 pinter">
        Descubrí el mundo con <strong>Corditur</strong>. Organizamos experiencias únicas a destinos internacionales.
        Desde Brasil y Uruguay, hasta Europa y más. Vos elegís el lugar, nosotros lo hacemos realidad.
      </p>

      {/* CARRUSEL 2 */}
      <section className="my-4">
        <HeroCarousel
          images={imagesInt}
          index={i2}
          setIndex={setI2}
          onOpenLightbox={(idx) => openLbInt(idx)}
          height={488}
        />
      </section>

      {/* Lista INTERNACIONALES (solo 3) */}
      <section className="container my-4">
        <CategoryList categoria="internacional" limit={3} />
        <div className="text-center mt-3 "style={{ marginBottom : 72 }}>
          <Link to="/internacionales" className="font-helvetica w-400 text-white">
          VER MAS FECHAS
          </Link>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lbOpen && (
        <div className="lb-overlay" onClick={closeLb}>
          <div className="lb-box" onClick={(e) => e.stopPropagation()}>
            <img className="lb-img" src={lbList[lbIndex].src} alt={lbList[lbIndex].alt} />
            <button className="lb-close" onClick={closeLb} aria-label="Cerrar"><CloseIcon/></button>
            {lbList.length > 1 && (
              <>
                <button className="lb-prev" onClick={lbPrev} aria-label="Anterior"><ArrowLeft/></button>
                <button className="lb-next" onClick={lbNext} aria-label="Siguiente"><ArrowRight/></button>
              </>
            )}
          </div>
        </div>
      )}

   
    </main>
  );
}
