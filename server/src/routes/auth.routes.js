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

        // 1. Búsqueda: Si no encuentra, user es null.
        const user = await User.findOne({ email });

        // 2. Si NO existe el usuario, salimos.
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        
        // 3. Obtener el hash y asegurarnos de que es una cadena de texto (string)
        const passwordHash = user.passwordHash.toString();
        
        // 4. Comparación de contraseña
        const isValid = await bcrypt.compare(password, passwordHash); 

        if (!isValid) { 
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Genera el token
        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 🔑 CAMBIO CLAVE PARA VERCEL: Robustez en la configuración de cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const isSecure = isProduction || req.headers['x-forwarded-proto'] === 'https'; 

        // Establece la cookie (Usada por Vercel)
        res.cookie("token", token, {
            httpOnly: true,
            // Usamos 'Lax' en producción. Es seguro y permite la cookie en la navegación de React.
            // Usamos 'Strict' si no es seguro (entorno local sin HTTPS), aunque es menos común.
            sameSite: isSecure ? 'Lax' : 'Strict', 
            secure: isSecure
        });

        // Devuelve la respuesta
        let responseData = { ok: true, user: { email: user.email, role: user.role } };
        
        return res.json(responseData);
    } catch (err) {
        console.error("Error en login:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ ok: true });
});

router.get("/me", (req, res) => {
    // ... (Tu código para obtener el token de cookie o header está correcto)
    let token = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) return res.json({ ok: false });
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Retornar solo la información segura del usuario
        return res.json({ ok: true, user: { email: payload.email, role: payload.role } });
    } catch {
        // Al fallar la verificación (ej: token expirado o inválido), limpia la cookie por si acaso
        res.clearCookie("token");
        return res.json({ ok: false });
    }
});

export default router;