import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import requireAuth from "../middleware/requireAuth.js";
import Viaje from "../models/Viaje.js";

const router = Router();

// 1. Configuración de Cloudinary (Usa las variables de tu .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuración del Storage para Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "corditur_pdfs", // Carpeta en la nube
    resource_type: "raw",    // 'raw' es indispensable para archivos que NO son imágenes (PDFs)
    public_id: (req, file) => {
      // Generamos nombre: timestamp-nombreOriginal (sin la extensión, Cloudinary la agrega)
      const name = file.originalname.split('.')[0].replace(/\s+/g, "_");
      return `${Date.now()}-${name}`;
    },
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Validamos que sea PDF si viene un archivo
    if (file && file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ================== RUTAS PÚBLICAS ==================

// GET /api/viajes
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

// ================== RUTAS ADMIN (Protegidas) ==================

// POST /api/viajes (Crea viaje y sube PDF si existe)
router.post("/", requireAuth, upload.single("pdf"), async (req, res) => {
  try {
    const {
      destino,
      descripcion,
      categoria,
      fecha_inicio,
      fecha_fin
    } = req.body;

    if (!destino || !categoria) {
      return res.status(400).json({ error: "Destino y categoría son obligatorios" });
    }

    let pdf_itinerario = undefined;
    
    // Si Multer subió el archivo, Cloudinary nos da la URL en req.file.path
    if (req.file) {
      pdf_itinerario = req.file.path; 
    }

    const nuevo = await Viaje.create({
      destino: destino.trim(),
      descripcion: descripcion || "",
      categoria,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
      fecha_fin:    fecha_fin ? new Date(fecha_fin) : undefined,
      pdf_itinerario, // Aquí se guarda la URL completa: https://res.cloudinary.com/...
      publicado: true
    });

    res.status(201).json(nuevo);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando viaje" });
  }
});

// DELETE /api/viajes/:id (Borra viaje de la BD y PDF de Cloudinary)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const v = await Viaje.findById(id);
    if (!v) return res.status(404).json({ error: "No existe el viaje" });

    // Lógica para borrar el PDF de Cloudinary si existe
    if (v.pdf_itinerario) {
      try {
        // La URL es tipo: .../corditur_pdfs/17325166-miarchivo.pdf
        // Necesitamos extraer: "corditur_pdfs/17325166-miarchivo"
        
        // 1. Obtenemos el nombre del archivo con extensión (ej: 17325166-miarchivo.pdf)
        const nombreArchivo = v.pdf_itinerario.split('/').pop();
        
        // 2. Quitamos la extensión (Cloudinary a veces duplica extensiones en raw, esto asegura limpieza)
        // Nota: En 'raw', a veces se necesita el nombre completo, pero normalmente el public_id sin extensión funciona si se configuró así.
        // Dado que configuramos public_id manual arriba, intentamos borrar usando la carpeta + nombre base.
        const publicId = `corditur_pdfs/${nombreArchivo}`; 

        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (cloudError) {
        console.error("Error borrando imagen de Cloudinary:", cloudError);
        // No detenemos el proceso, seguimos para borrar el viaje de la BD
      }
    }

    await Viaje.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Error eliminando viaje" });
  }
});

export default router;