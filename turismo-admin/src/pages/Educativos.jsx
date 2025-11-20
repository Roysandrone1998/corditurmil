import { useState } from "react";
import CategoryList from "../components/CategoryList.jsx";
import Footer from "./Footer.jsx";
import "../css/educativos.css";

const IMAGENES = [
  // Poné 1 o más imágenes en /public/images/educativos/
        "/img/e1.png",
        "/img/e2.png",
        "/img/e3.png",
        "/img/e4.png",
        "/img/e5.png",
        "/img/e6.png",
        "/img/e7.png",
        "/img/e8.png",
        "/img/e9.png"
    ];

    export default function EducativosHome() {
    const [idx, setIdx] = useState(0);
    const many = IMAGENES.length > 1;
    const prev = () => setIdx((v) => (v - 1 + IMAGENES.length) % IMAGENES.length);
    const next = () => setIdx((v) => (v + 1) % IMAGENES.length);

    return (
        <>
        <main className="edu2-page ">
        {/* Título + texto */}
        <section className="edu2-hero">
            <div className="container text-center">
            <h1 className="font-tommy w-500">EDUCATIVOS</h1>
            <p className=" font-helvetica w-200">
                Los viajes educativos son una oportunidad para aprender, descubrir y
                crecer fuera del aula.<br/> En <strong>Corditur</strong> organizamos salidas
                escolares con propuestas seguras, bien planificadas y con
                acompañamiento constante,<br/> para que cada experiencia sea tan
                enriquecedora como inolvidable.
            </p>
            </div>
        </section>
        <CategoryList categoria="educativos" />
        {/* Carrusel + descargas */}
        <section className="edu2-gallery">
            <div className="container">
            <div className="edu2-carousel">
                <img
                src={IMAGENES[idx]}
                alt={`Educativos ${idx + 1}`}
                className="edu2-slide"
                />
                {many && (
                <>
                    <button
                    className="edu2-nav edu2-nav--left"
                    onClick={prev}
                    aria-label="Anterior"
                    >
                    ‹
                    </button>
                    <button
                    className="edu2-nav edu2-nav--right"
                    onClick={next}
                    aria-label="Siguiente"
                    >
                    ›
                    </button>
                </>
                )}
            </div>

            <div className="edu2-downloads text-center">
                <h3 className="font-tommy w-600">DESCARGA TODO LO NECESARIO</h3>
                <div className="edu2-dl-row">
                <a className="edu2-pill font-tommy w-500" href="/pdfs/ficha-medica.pdf" download>
                    FICHA MÉDICA
                </a>
                <a className="edu2-pill font-tommy w-500" href="/pdfs/permiso-educativo.pdf" download>
                    PERMISO EDUCATIVO
                </a>
                <a className="edu2-pill font-tommy w-500" href="/pdfs/ficha-adhesion.pdf" download>
                    FICHA DE ADHESIÓN
                </a>
                </div>
            </div>
            </div>
        </section>
           
        </main>

        </>
    );
}