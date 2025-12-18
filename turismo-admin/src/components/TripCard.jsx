import { memo } from "react";
import "../css/tripcard.css";

// Nota: Solo se usará si por alguna razón hay archivos viejos locales.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:4000/api")
  .replace(/\/api\/?$/, "");

// Link de WhatsApp
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
    // 1. Si es de Cloudinary (URL absoluta)
    if (v.pdf_itinerario.startsWith("http")) {
      if (v.pdf_itinerario.includes("cloudinary.com")) {
        // Mantenemos el fl_attachment por si el navegador lo soporta nativamente
        pdfHref = v.pdf_itinerario.replace("/upload/", "/upload/fl_attachment/");
      } else {
        pdfHref = v.pdf_itinerario;
      }
    }
    // 2. Archivos viejos locales
    else {
      pdfHref = `${API_ORIGIN}${v.pdf_itinerario}`;
    }
  }

  // Función para forzar la descarga con extensión .pdf
  const handleDownload = async (e) => {
    if (!pdfHref.startsWith("http")) return; // Si es local dejamos que actúe el link normal
    
    e.preventDefault();
    try {
      const response = await fetch(pdfHref);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `itinerario-${v.destino || "viaje"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Si falla por CORS (política de seguridad), abrimos en pestaña nueva como backup
      window.open(pdfHref, "_blank");
    }
  };

  return (
    <div className="trip-card position-relative">
      {/* Acciones arriba derecha */}
      <div className="trip-actions">
        <a
          className={`trip-cta font-tommy w-400 ${WSP_LINK ? "" : ""}`}
          href={WSP_LINK || undefined}
          target={WSP_LINK ? "_blank" : undefined}
          rel={WSP_LINK ? "noreferrer" : undefined}
          aria-disabled={!WSP_LINK}
        >
          <span className="txt">RESERVÁ AHORA!</span>
          <img src="/img/wspazul.png" alt="" className="ico" width="18" height="18" />
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
          <div className="font-helvetica">DESCRIPCIÓN</div>
          <div className="trip-desc font-helvetica w-200">{v.descripcion || "—"}</div>
        </div>
      </div>

      {/* PDF / Itinerario abajo derecha */}
      {pdfHref && (
        <a
          className="btn btn-sm rounded-pill trip-pdf font-tommy w-500"
          href={pdfHref}
          onClick={handleDownload}
          download={`itinerario-${v.destino || "viaje"}.pdf`}
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