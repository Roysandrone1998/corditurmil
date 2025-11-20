import { memo } from "react";
import "../css/tripcard.css";

// Origen del server para abrir PDFs (quita el "/api" del VITE_API_URL)
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:4000/api")
  .replace(/\/api\/?$/, "");

// Link de WhatsApp (configuralo en tu .env del front)
const WSP_LINK = import.meta.env.VITE_WSP_LINK || ""; // ej: https://wa.me/5493430000000?text=Hola%20Corditur

function fmtDM(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function pickFechaSalida(v) {
  // Mostramos fecha_inicio si existe; si no, fecha_salida
  return v.fecha_inicio || v.fecha_salida || null;
}



function TripCard({ v }) {
  const fechaSalida = pickFechaSalida(v);
  const pdfHref = v.pdf_itinerario ? `${API_ORIGIN}${v.pdf_itinerario}` : "";

  return (
    <div className="trip-card position-relative p-3 p-md-4">
      {/* Acciones arriba derecha */}
      <div className="trip-actions">
        <a
          className={`trip-cta  font-tommy w-400 ${WSP_LINK ? "" : ""}`}
          href={WSP_LINK || undefined}
          target={WSP_LINK ? "_blank" : undefined}
          rel={WSP_LINK ? "noreferrer" : undefined}
          aria-disabled={!WSP_LINK}
        >
          <span className="txt">RESERVÁ AHORA!</span>
          <img src="/img/wspazul.png" alt="" className="ico" width="18" height="18" /> 
          {/* Si preferís PNG en vez de SVG, reemplazá <WaIcon /> por:
              <img src="/img/wa.png" alt="" className="ico" width="18" height="18" /> */}
        </a>
      </div>

      {/* 3 columnas */}
      <div className="row g-0 align-items-center">
        <div className="col-12 col-md-4 trip-col">
          <div className="trip-label font-helvetica">DESTINO</div>
          <div className="trip-destino text-uppercase font-tommy w-200">
            {v.destino || "—"}
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="trip-label font-helvetica">FECHA DE SALIDA</div>
          <div className="trip-fecha font-helvetica w-200">{fmtDM(fechaSalida)}</div>
        </div>

        <div className="col-12 col-md-5 mt-3 mt-md-0">
          <div className=" font-helvetica">DESCRIPCIÓN</div>
          <div className="trip-desc font-helvetica w-200">{v.descripcion || "—"}</div>
        </div>
      </div>

      {/* PDF / Itinerario abajo derecha */}
      {pdfHref && (
        <a
          className="btn btn-sm  rounded-pill trip-pdf"
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