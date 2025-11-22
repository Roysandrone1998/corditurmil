import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import requireAuth from "../middleware/requireAuth.js";
import Viaje from "../models/Viaje.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Storage para PDFs (igual al de /pdfs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "..", "uploads", "pdfs");
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}-${safe}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Permitimos vacío (no siempre hay PDF), pero si viene archivo debe ser PDF
    if (file && file.mimetype !== "application/pdf") {
      return cb(new Error("Solo PDFs"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ================== RUTAS PÚBLICAS (para el front del sitio) ==================

// GET /api/viajes?categoria=nacional
router.get("/", async (req, res) => {
  try {
    const { categoria } = req.query;
    const q = { publicado: true };
    if (categoria) q.categoria = categoria;

    const viajes = await Viaje.find(q)
      .sort({ createdAt: -1 })
      .lean();

    res.json(viajes);
  } catch (e) {
    res.status(500).json({ error: "Error listando viajes" });
  }
});

// ================== RUTAS ADMIN (protegidas) ==================

// POST /api/viajes  (multipart/form-data con campo "pdf")
router.post("/", requireAuth, upload.single("pdf"), async (req, res) => {
  try {
    const {
      destino,
      descripcion,
      categoria,       // nacional | internacional | educativos
      fecha_inicio,    // ISO string (YYYY-MM-DD)
      fecha_fin        // ISO string (YYYY-MM-DD)
    } = req.body;

    if (!destino || !categoria) {
      return res.status(400).json({ error: "destino y categoria son obligatorios" });
    }

    let pdf_itinerario = undefined;
    if (req.file) {
      pdf_itinerario = `/uploads/pdfs/${req.file.filename}`;
    }

    const nuevo = await Viaje.create({
      destino: destino.trim(),
      descripcion: descripcion || "",
      categoria,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
      fecha_fin:    fecha_fin ? new Date(fecha_fin) : undefined,
      pdf_itinerario,
      publicado: true
    });

    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: "Error creando viaje" });
  }
});

// DELETE /api/viajes/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const v = await Viaje.findById(id);
    if (!v) return res.status(404).json({ error: "No existe" });

    // si querés borrar el PDF físico asociado:
    if (v.pdf_itinerario) {
      const filename = v.pdf_itinerario.split("/").pop();
      const filePath = path.join(__dirname, "..", "uploads", "pdfs", filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Viaje.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error eliminando viaje" });
  }
});

export default router;