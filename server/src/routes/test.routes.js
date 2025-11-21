// src/routes/test.routes.js
import { Router } from "express";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

const router = Router();

router.get("/db", async (req, res) => {
  try {
    // 1. Verificar variables de entorno
    const hasMongoUri = !!process.env.MONGO_URI;
    const hasJwtSecret = !!process.env.JWT_SECRET;

    // 2. Conectar a la BD
    await connectDB();

    // 3. Contar usuarios
    const userCount = await User.countDocuments();

    // 4. Listar un usuario (solo email, por seguridad)
    const sampleUser = await User.findOne({}, { email: 1, _id: 0 });

    res.json({
      ok: true,
      env: {
        MONGO_URI: hasMongoUri ? "✅ definida" : "❌ faltante",
        JWT_SECRET: hasJwtSecret ? "✅ definida" : "❌ faltante"
      },
      db: {
        connected: true,
        userCount,
        sampleUser: sampleUser?.email || null
      }
    });
  } catch (err) {
    console.error("Error en /api/test/db:", err);
    res.status(500).json({
      ok: false,
      error: err.message || "Error desconocido"
    });
  }
});

export default router;
