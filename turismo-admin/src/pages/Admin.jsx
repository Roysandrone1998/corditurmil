import { useEffect, useRef, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

const CATEGORIAS = [
  { value: "nacional", label: "VIAJES NACIONALES" },
  { value: "internacional", label: "VIAJES INTERNACIONALES" },
  { value: "educativos", label: "EDUCATIVOS" },
];

export default function Admin() {
  const nav = useNavigate();

  // Auth
  const [authed, setAuthed] = useState(false);

  // Form
  const [destino, setDestino] = useState("");
  const [desc, setDesc] = useState("");
  const [categoria, setCategoria] = useState("nacional");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const pdfRef = useRef(null);
  const [msgForm, setMsgForm] = useState("");

  // Lista
  const [catLista, setCatLista] = useState("nacional");
  const [viajes, setViajes] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (!me.data.ok) return nav("/login");
        setAuthed(true);
      } catch {
        nav("/login");
      }
    })();
  }, [nav]);

  // Cargar lista por categoría
  const cargarViajes = async (cat) => {
    setLoadingLista(true);
    try {
      const r = await api.get(`/viajes`, { params: { categoria: cat } });
      setViajes(r.data || []);
    } finally {
      setLoadingLista(false);
    }
  };

  useEffect(() => {
    if (authed) cargarViajes(catLista);
  }, [authed, catLista]);

  const onCrear = async (e) => {
    e.preventDefault();
    setMsgForm("");
    try {
      const fd = new FormData();
      fd.append("destino", destino);
      fd.append("descripcion", desc);
      fd.append("categoria", categoria);
      if (desde) fd.append("fecha_inicio", desde);
      if (hasta) fd.append("fecha_fin", hasta);
      const f = pdfRef.current?.files?.[0];
      if (f) fd.append("pdf", f);

      await api.post("/viajes", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // limpiar
      setDestino("");
      setDesc("");
      setDesde("");
      setHasta("");
      pdfRef.current && (pdfRef.current.value = "");
      // refrescar lista si coincide categoría
      if (categoria === catLista) await cargarViajes(catLista);
      setMsgForm("Viaje creado ✅");
      setTimeout(() => setMsgForm(""), 2000);
    } catch (e) {
      setMsgForm(e?.response?.data?.error || "Error creando viaje");
    }
  };

  const onBorrar = async (id) => {
    if (!confirm("¿Eliminar este viaje?")) return;
    await api.delete(`/viajes/${id}`);
    await cargarViajes(catLista);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    nav("/login");
  };

  if (!authed) return null;

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Panel Administrador</h2>
        <button className="btn btn-outline-secondary" onClick={logout}>Salir</button>
      </div>

      {/* NUEVO VIAJE (como tu primer imagen, sin estilos todavía) */}
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Nuevo viaje</h5>
        <form onSubmit={onCrear}>
          <div className="mb-2">
            <label className="form-label">Destino</label>
            <input className="form-control" value={destino} onChange={e=>setDestino(e.target.value)} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Desde</label>
              <input type="date" className="form-control" value={desde} onChange={e=>setDesde(e.target.value)} />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Hasta</label>
              <input type="date" className="form-control" value={hasta} onChange={e=>setHasta(e.target.value)} />
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label">Descripción</label>
            <textarea className="form-control" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} />
          </div>

          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Categoría</label>
              <select className="form-select" value={categoria} onChange={e=>setCategoria(e.target.value)}>
                {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">PDF (opcional)</label>
              <input type="file" accept="application/pdf" ref={pdfRef} className="form-control" />
            </div>
          </div>

          {msgForm && <div className="alert alert-info py-2">{msgForm}</div>}
          <button className="btn btn-primary">Subir</button>
        </form>
      </div>

      {/* LISTA / CARDS por categoría (como tu segunda imagen, sin estilos todavía) */}
      <div className="card p-3">
        <div className="d-flex gap-2 flex-wrap mb-3">
          {CATEGORIAS.map(c => (
            <button
              key={c.value}
              className={`btn ${catLista === c.value ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCatLista(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loadingLista ? (
          <div>Cargando...</div>
        ) : viajes.length === 0 ? (
          <div>No hay viajes en esta categoría.</div>
        ) : (
          <div className="vstack gap-3">
            {viajes.map(v => (
              <div key={v._id} className="card p-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <div className="me-3">
                    <div className="fw-bold text-uppercase">{v.destino}</div>
                    <div className="small text-muted">
                      {v.fecha_inicio ? new Date(v.fecha_inicio).toLocaleDateString() : "-"}
                      {v.fecha_fin ? `  →  ${new Date(v.fecha_fin).toLocaleDateString()}` : ""}
                    </div>
                    <div className="mt-2">{v.descripcion}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                    {v.pdf_itinerario && (
                      <a className="btn btn-sm btn-outline-secondary"
                         href={`http://localhost:4000${v.pdf_itinerario}`} target="_blank" rel="noreferrer">
                        PDF
                      </a>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={() => onBorrar(v._id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}