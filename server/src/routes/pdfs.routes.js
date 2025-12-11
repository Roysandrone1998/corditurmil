  // src/routes/pdfs.routes.js
  import { Router } from "express";
  import multer from "multer";
  import fs from "fs";
  import path from "path";
  import { fileURLToPath } from "url";
  import requireAuth from "../middleware/requireAuth.js";

  const router = Router();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

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
      if (file.mimetype !== "application/pdf") return cb(new Error("Solo PDFs"), false);
      cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 }
  });

  router.post("/", requireAuth, upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Falta archivo" });
    const url = `/uploads/pdfs/${file.filename}`;
    res.status(201).json({ filename: file.filename, url });
  });

  router.get("/", requireAuth, (_req, res) => {
    const dir = path.join(__dirname, "..", "uploads", "pdfs");
    fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(dir)
      .filter(n => n.toLowerCase().endsWith(".pdf"))
      .map(n => ({ filename: n, url: `/uploads/pdfs/${n}` }));
    res.json(files);
  });

  router.delete("/:filename", requireAuth, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "..", "uploads", "pdfs", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "No existe" });
    fs.unlinkSync(filePath);
    res.json({ ok: true });
  });

  // Ruta para DESCARGAR (Versión Corregida)
router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", "pdfs", filename);

  if (fs.existsSync(filePath)) {
    // 1. Preparamos el nombre con el que se va a guardar en la PC del usuario
    let downloadName = filename;
    
    // Si por alguna razón el nombre no termina en .pdf, se lo pegamos
    if (!downloadName.toLowerCase().endsWith('.pdf')) {
        downloadName += '.pdf';
    }

    // 2. Forzamos la cabecera Content-Type para asegurar que el navegador sepa que es un PDF
    res.setHeader('Content-Type', 'application/pdf');

    // 3. Enviamos el archivo forzando el nombre correcto
    res.download(filePath, downloadName, (err) => {
      if (err) {
        console.error("Error enviando archivo:", err);
        if (!res.headersSent) res.status(500).send("Error en la descarga");
      }
    });
  } else {
    res.status(404).json({ error: "El archivo no existe" });
  }
});
  export default router;
