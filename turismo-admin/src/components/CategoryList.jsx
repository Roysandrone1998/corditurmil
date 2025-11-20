import { useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";
import TripCard from "./TripCard.jsx";

// Genera variantes singular/plural y quita duplicados
function catVariants(cat = "") {
  const base = String(cat || "").trim().toLowerCase();
  if (!base) return [];
  const plural = base.endsWith("es") ? base : `${base}es`;
  const singular = base.endsWith("es") ? base.slice(0, -2) : base;
  return Array.from(new Set([base, plural, singular]));
}

export default function CategoryList({ categoria, limit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;

    (async () => {
      setLoad(true);
      setError("");
      try {
        const variants = catVariants(categoria);
        let out = [];

        // Probamos en orden hasta obtener resultados
        for (const cat of variants) {
          const r = await api.get("/viajes", { params: { categoria: cat } });
          const data = Array.isArray(r.data) ? r.data : [];
          if (data.length) {
            out = data;
            break;
          }
        }

        if (!cancel) setItems(out);
      } catch (e) {
        if (!cancel) setError("No pudimos cargar los viajes. Probá más tarde.");
      } finally {
        if (!cancel) setLoad(false);
      }
    })();

    return () => { cancel = true; };
  }, [categoria]);

  const view = useMemo(() => {
    if (typeof limit === "number" && limit > 0) {
      return items.slice(0, limit);
    }
    return items;
  }, [items, limit]);

  if (loading) return <div>Cargando…</div>;
  if (error)   return <div>{error}</div>;
  if (view.length === 0) return <div>No hay viajes en esta sección.</div>;

  return (
    <div className="vstack gap-3">
      {view.map(v => <TripCard key={v._id || v.id} v={v} />)}
    </div>
  );
}