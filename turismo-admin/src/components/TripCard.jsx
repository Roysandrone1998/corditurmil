import { memo } from "react";
import "../css/tripcard.css";

// Nota: Solo se usará si por alguna razón hay archivos viejos locales.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:4000/api")
  .replace(/\/api\/?$/, "");

const WSP_LINK = import.meta.env.VITE_WSP_LINK || ""; 

function fmtDM(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function pickFechaSalida(v) {
  return v.fecha_inicio || v.fecha_salida || null;
}

function TripCard({ v }) {
  const fechaSalida = pickFechaSalida(v);
  
  let pdfHref = "";
  if (v.pdf_itinerario) {
    if (v.pdf_itinerario.startsWith("http")) {
        pdfHref = v.pdf_itinerario;
    } else {
        pdfHref = `${API_ORIGIN}${v.pdf_itinerario}`;
    }
  }

  return (
    <div className="trip-card">
      {/* Acciones arriba derecha (Flotantes) */}
      <div className="trip-actions">
        <a
          className={`trip-cta font-tommy w-400 ${!WSP_LINK ? "disabled" : ""}`}
          href={WSP_LINK || undefined}
          target={WSP_LINK ? "_blank" : undefined}
          rel={WSP_LINK ? "noreferrer" : undefined}
        >
          <span className="txt">RESERVÁ AHORA!</span>
          <img src="/img/wspazul.png" alt="wsp" className="ico" width="18" height="18" /> 
        </a>
      </div>

      {/* Contenido principal: Usamos CSS Grid en lugar de filas Bootstrap para control total */}
      <div className="trip-grid-layout">
        
        {/* Columna 1: Destino */}
        <div className="trip-item destino-area">
          <div className="trip-label font-helvetica">DESTINO</div>
          <div className="trip-value trip-destino font-tommy w-200 text-uppercase">
            {v.destino || "—"}
          </div>
        </div>

        {/* Columna 2: Fecha */}
        <div className="trip-item fecha-area">
          <div className="trip-label font-helvetica">FECHA DE SALIDA</div>
          <div className="trip-value trip-fecha font-helvetica w-200">
            {fmtDM(fechaSalida)}
          </div>
        </div>

        {/* Columna 3: Descripción */}
        <div className="trip-item desc-area">
          <div className="trip-label font-helvetica">DESCRIPCIÓN</div>
          <div className="trip-value trip-desc font-helvetica w-200">
            {v.descripcion || "—"}
          </div>
        </div>

      </div>

      {/* PDF / Itinerario abajo derecha (Flotante) */}
      {pdfHref && (
        <a
          className="trip-pdf font-helvetica"
          href={pdfHref}
          target="_blank"
          rel="noreferrer"
        >
          ITINERARIO
        </a>
      )}
    </div>
  );
}

export default memo(TripCard);