import "../css/footer.css";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-band">
        {/* Íconos sociales */}
        <ul className="footer-social">
          <li>
            <a className="hs-btn font-helvetica w-200" href="http://wa.me/3434662347" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src="/img/wspblanco.png" alt="WhatsApp" width="24" height="24" />
            </a>
          </li>
          <li>
            <a className="hs-btn font-helvetica w-200" href="https://www.instagram.com/corditurviajes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/img/instablanco.png" alt="Instagram" width="24" height="24" />
            </a>
          </li>
          <li>
            <a className="hs-btn" href="https://www.facebook.com/corditur.viajes?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/img/faceblanco.png" alt="Facebook" width="24" height="24" />
            </a>
          </li>
          <li>
            <a className="hs-btn" href="https://www.instagram.com/cordituregresados?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Finstagram">
              <img src="/img/instaceleste.png" alt="Finstagram" width="24" height="24" />
            </a>
          </li>
        </ul>

        {/* Contenido principal */}
        <div className="container">
          <div className="footer-content">
            {/* Bloque 1: Dirección */}
            <div className="f-col f-brand">
              <address className="footer-address font-helvetica w-200">
                <div>Av. Gualeguaychú 463</div>
                <div>Paraná – Entre Ríos</div>
                <div>Argentina</div>
              </address>
            </div>

            {/* Logo centrado */}
            <div className="f-logo-wrapper">
              <img src="/img/logoF.png" alt="Corditur" className="footer-logo" />
            </div>

            {/* Bloque 2: Contacto */}
            <div className="f-col f-contact font-helvetica w-200">
              <div className="footer-phones">+54 0 343-4316776 <br/>+54 0 343-4662347</div>
              <a className="footer-mail" href="mailto:corditur@outlook.com">
                corditur@outlook.com
              </a>
            </div>

            {/* Bloque 3: Copyright */}
            <div className="f-col f-copy font-helvetica w-200">
              <div className="footer-pow" >Copyright © {year} Corditur</div>
              <div className="footer-powered">Powered by Boosting Marketing</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}