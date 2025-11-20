import { Link } from "react-router-dom";
import Footer from "./Footer.jsx";
import "../css/home.css";

export default function Home() {
  return (
    <main className="page bg-pattern-lg">   
      {/* HERO */}
      <section className="home-hero text-white text-center">
        <div className="container ">
          <h1 className=" font-tommy w-700">VIVÍ TU PRÓXIMO VIAJE<br/> CON CORDITUR</h1>
          <p className=" font-helvetica w-200">
                Desde experiencias educativas hasta el viaje de tus sueños.<br/>
                Conectamos destinos, personas y recuerdos.
            </p>
            </div>
        </section>
{/* TRES CARDS */}
<section className="container my-5">
  <div className="row g-4">
    {/* Card 1 */}
    <div className="col-12 col-md-4">
      <article className="home-card">
        <div className="home-card-head">
          <h5 className="font-tommy w-500">INDIVIDUALES</h5>
          <p className="font-helvetica w-200">Viajes únicos. Vos elegís el destino, nosotros lo hacemos posible.</p>
        </div>
        <img
          className="home-card-img"
          src="/img/home1.png"
          alt="Viajes individuales"
        />
      </article>
      <div className="text-center mt-2">
        <Link to="/individuales" className="btn home-pill font-tommy w-500">CONOCÉ MÁS</Link>
      </div>
    </div>

    {/* Card 2 */}
    <div className="col-12 col-md-4">
      <article className="home-card">
        <div className="home-card-head">
          <h5 className="font-tommy w-500">EGRESADOS</h5>
          <p className="font-helvetica w-200">El viaje que nunca se olvida. Diversión, organización y seguridad.</p>
        </div>
        <img
          className="home-card-img"
          src="/img/home2.png"
          alt="Viajes de egresados"
        />
      </article>
      <div className="text-center mt-2">
        <Link to="/egresados" className="btn home-pill font-tommy w-500">CONOCÉ MÁS</Link>
      </div>
    </div>

    {/* Card 3 */}
    <div className="col-12 col-md-4">
      <article className="home-card">
        <div className="home-card-head">
          <h5 className="font-tommy w-500">EDUCATIVOS</h5>
          <p className="font-helvetica w-200">Viajes pensados para aprender, descubrir y crecer. Una experiencia formativa.</p>
        </div>
        <img
          className="home-card-img"
          src="/img/home3.png"
          alt="Viajes educativos"
        />
      </article>
      <div className="text-center mt-2">
        <Link to="/educativos" className="btn home-pill font-tommy w-500">CONOCÉ MÁS</Link>
      </div>
    </div>
  </div>
</section>

    <section className="home-about py-5">
  <div className="container">
    <div className="d-flex align-items-center gap-3 mb-3 home-about-header">
      <h3 className="font-tommy w-400 ">QUIÉNES SOMOS</h3>

      {/* redes (derecha) */}
      <div className="home-social ms-auto ">
        <a className="hs-btn" href="https://wa.me/5493430000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <img src="/img/wspblanco.png" alt="" width="22" height="22" />
  <span className="visually-hidden">WhatsApp</span>
</a>
<a className="hs-btn" href="https://insta" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <img src="/img/instablanco.png" alt="" width="22" height="22" />
  <span className="visually-hidden">WhatsApp</span>
</a>
<a className="hs-btn" href="https://face" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <img src="/img/faceblanco.png" alt="" width="22" height="22" />
  <span className="visually-hidden">WhatsApp</span>
</a>
<a className="hs-btn" href="https://finsta" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
  <img src="/img/instaceleste.png" alt="" width="22" height="22" />
  <span className="visually-hidden">insta</span>
</a>
      </div>
    </div>

    {/* tarjeta translúcida */}
    <div className="home-about-card">
      <p className="mb-0 font-helvetica w-200">
        Somos Corditur, una agencia con 30 años de experiencia en el sector turístico.
        Organizamos viajes educativos, viajes de egresados y experiencias personalizadas para grupos o pasajeros individuales.
        Nos mueve el compromiso, la organización y la pasión por viajar. Acompañamos cada viaje desde la planificación
        hasta el regreso, cuidando cada detalle para que sea una experiencia única.
      </p>
    </div>
  </div>
</section>
 
       </main>
    );
}     