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

export default router;
