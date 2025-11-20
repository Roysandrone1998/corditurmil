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

        // Busca y verifica usuario/contraseña
        const user = await User.findOne({ email });
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!user || !isValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Genera el token
        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 1. Define la variable isSecure DENTRO de la ruta
        const isSecure = req.headers['x-forwarded-proto'] === 'https';
        
        // 2. Establece la cookie (Usada por Vercel)
        res.cookie("token", token, {
            httpOnly: true,
            // sameSite es false si no es seguro (local), permitiendo la comunicación
            sameSite: isSecure ? 'lax' : false, 
            secure: isSecure
        });

        // 3. SOLUCIÓN LOCAL: Devuelve el token en el body si no es producción.
        let responseData = { ok: true };
        if (process.env.NODE_ENV !== 'production') {
            responseData.token = token; // El token se usa para localStorage en el frontend
        }
        
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
        return res.json({ ok: true, user: payload });
    } catch {
        return res.json({ ok: false });
    }
});

export default router;