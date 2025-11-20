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

        // 1. Buscar usuario por email
        const user = await User.findOne({ email });

        // 2. Si no existe, error
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // ✅ Logs solo después de que `user` existe
        console.log('Email recibido:', email);
        console.log('Contraseña recibida:', password);
        console.log('Hash almacenado:', user.passwordHash);

        // 3. Comparar contraseña directamente con el hash (sin .toString())
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // 4. Generar token JWT
        const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Configurar cookie según entorno (local o Vercel)
        const isProduction = process.env.NODE_ENV === 'production';
        const isSecure = isProduction || req.headers['x-forwarded-proto'] === 'https';

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isSecure ? 'Lax' : 'Strict',
            secure: isSecure
        });

        // 6. Respuesta exitosa
        return res.json({
            ok: true,
            user: { email: user.email, role: user.role }
        });

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
        return res.json({ ok: true, user: { email: payload.email, role: payload.role } });
    } catch {
        res.clearCookie("token");
        return res.json({ ok: false });
    }
});

export default router;