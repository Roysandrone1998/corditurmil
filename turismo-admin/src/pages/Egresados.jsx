import { useState, useEffect } from "react";
import Footer from "./Footer.jsx";
import "../css/egresados.css";

export default function EgresadosHome() {
  // Fondo exclusivo para esta página (incluye zona de la navbar)
 useEffect(() => {
    document.body.classList.add("bg-egresados");
    return () => document.body.classList.remove("bg-egresados");
  }, []);

  // Slides del carrusel inferior (cargá tus rutas reales)
  const gallery = [
    { src: "/img/e3.png", alt: "Egresados 1" },
    { src: "/img/e1.png", alt: "Egresados 2" },
    { src: "/img/e2.png", alt: "Egresados 3" },
  ];
  const [gIdx, setGIdx] = useState(0);
  const prevG = () => setGIdx(i => (i - 1 + gallery.length) % gallery.length);
  const nextG = () => setGIdx(i => (i + 1) % gallery.length);

  return (
    <main className="eg-page">
      {/* FOTO GRANDE + TEXTOS */}
      <section className="eg-hero">
        <div className="container">
          <div className="eg-hero-card">
            <img
              className="eg-hero-img"
              src="/img/egresadosportada.png"
              alt="Egresados disfrutando"
            />
            {/* PNG superpuesto (reemplaza “It’s fun”) */}
            <img className="eg-sticker" src="/img/fun.png" alt="" aria-hidden="true" />
            <h2 className="eg-hero-mid font-tommy w-500">
              ¡LLEGÓ EL MOMENTO DE CELEBRAR
              <br />
              EL FIN DE LA PRIMARIA!
            </h2>
            <div className="eg-hero-bottom font-helvetica w-200">
              Juegos, aventuras, naturaleza y nuevos recuerdos para toda la vida.
              En Corditur organizamos todo para que los chicos disfruten al máximo,
              con la seguridad y el acompañamiento que las familias necesitan.
            </div>
          </div>
        </div>
      </section>

      {/* TÍTULO + BLOQUES */}
      <section className="eg-content">
        <div className="container">
          <h3 className=" font-tommy w-500 hh3">¿QUÉ INCLUYE EL VIAJE?</h3>

          {/* TRANSPORTE */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre1.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">TRANSPORTE</h4>
              <p className=" font-helvetica w-200">
                Ómnibus modernos y seguros con control satelital, toilette, butacas semicama,
                aire acondicionado, calefacción, pantalla LCD y servicio a bordo. Conductores
                capacitados en primeros auxilios y situaciones de emergencia.
              </p>
            </div>
          </article>

          {/* COMIDAS */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre2.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500 ">COMIDAS</h4>
               <p className=" font-helvetica w-200">Uno de los aspectos más valorados por quienes viajan con Corditur es la calidad de las comidas.</p>
               <p className=" font-helvetica w-200">El viaje incluye pensión completa: desayuno, almuerzo, merienda, cena y trasnoche.</p>
               <p className=" font-helvetica w-200">Ofrecemos un servicio buffet variado con gaseosas libres de primeras marcas, postres, y agua mineral en hotel y excursiones.</p>
               <p><strong className=" font-helvetica w-200">Contamos con opciones especiales para celíacos, diabéticos, vegetarianos y otras necesidades.</strong></p>
            </div>
          </article>

          {/* ALOJAMIENTO */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre3.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">ALOJAMIENTO</h4>
              <p className=" font-helvetica w-200">
                Hoteles de categoría con habitaciones privadas, baño privado, TV, aire acondicionado, piscina,
                WiFi y atención del personal las 24 horas.
              </p>
            </div>
          </article>

          {/* SEGURIDAD */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre4.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">SEGURIDAD</h4>
              <p className=" font-helvetica w-200">Hoteles con sistema de vigilancia por monitoreo.</p>
              <p className=" font-helvetica w-200">Incluye todos los seguros reglamentarios exigidos por la Secretaría de Turismo:</p>
              <div className="eg-sublist">
                <p className=" font-helvetica w-200">Seguro de vida</p>
                <p className=" font-helvetica w-200">Seguro por accidentes personales</p>
                <p className=" font-helvetica w-200">Responsabilidad civil</p>
                <p className=" font-helvetica w-200">Seguro de caución</p>
              </div>
            </div>
          </article>

          {/* ASISTENCIA MÉDICA */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre5.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">ASISTENCIA MÉDICA</h4>
              <p className=" font-helvetica w-200">Cobertura completa con servicio de asistencia médica y traslado de urgencia.</p>
            </div>
          </article>

          {/* COORDINACIÓN */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre6.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">COORDINACIÓN</h4>
              <p className=" font-helvetica w-200">Equipo Corditur y coordinadores acompañando durante toda la experiencia.</p>
            </div>
          </article>

          {/* KIT DEL EGRESADO */}
          <article className="eg-block">
            <span className="eg-icon" aria-hidden="true">
              <img src="/img/egre7.png" alt="" className="eg-icon-img" width="28" height="28" loading="lazy" />
            </span>
            <div className="">
              <h4 className="font-tommy w-500">KIT DEL EGRESADO</h4>
              <p className=" font-helvetica w-200">Todo lo que necesitan para disfrutar al máximo: remera, mochila, botellita, cartuchera y más.</p>
            </div>
          </article>

          <div className="eg-kit-card">
            <img className="eg-kit-img" src="/img/egrekit.png" alt="Kit del egresado Corditur" />
          </div>

          <div className="eg-kit-actions">
            <a className="eg-pill font-tommy w-500" href="#" role="button">FICHA MÉDICA</a>
            <a className="eg-pill font-tommy w-500" href="#" role="button">FICHA ADHESIÓN</a>
          </div>

          {/* ===== Carrusel inferior ===== */}
          <div className="egc-wrap">
            <div className="egc-card">
              <img className="egc-img" src={gallery[gIdx].src} alt={gallery[gIdx].alt} />
              <div className="egc-grad" />
              <button className="egc-btn egc-prev" onClick={prevG} aria-label="Anterior">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="egc-btn egc-next" onClick={nextG} aria-label="Siguiente">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}