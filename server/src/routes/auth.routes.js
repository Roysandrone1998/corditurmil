import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generación de token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true es OBLIGATORIO en Render para cookies sameSite: 'none'
      secure: isProduction, 
      // sameSite: 'none' es OBLIGATORIO para cruzar de Render a Vercel
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    
    // Esto asegura que si la cookie falla, el frontend tenga el token a mano
    return res.json({
      ok: true,
      token: token, 
      user: { email: user.email, role: user.role }
    });

  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Para borrar la cookie hay que pasarle EXACTAMENTE las mismas opciones
  res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
  });
  
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  let token = req.cookies?.token;
  
  // Respaldo: leer headers si la cookie falló
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) return res.json({ ok: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true, user: { email: payload.email, role: payload.role } });
  } catch {
    // Si el token no sirve, intentamos limpiar la cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    });
    return res.json({ ok: false });
  }
});

export default router;