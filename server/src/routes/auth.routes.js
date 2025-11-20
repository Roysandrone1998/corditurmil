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
        
        // ❌ PUNTO CRÍTICO CORREGIDO: 
        // 3. Obtener el hash y asegurarnos de que es una cadena de texto (string)
        // para que bcrypt.compare() funcione correctamente.
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

        // Define la variable isSecure DENTRO de la ruta
        const isSecure = req.headers['x-forwarded-proto'] === 'https';
        
        // Establece la cookie (Usada por Vercel)
        res.cookie("token", token, {
            httpOnly: true,
            // sameSite debe ser 'lax' o 'strict' en producción para seguridad. 
            // Si usas 'none' debes asegurar que 'secure: true' esté activo. 
            // 'Lax' es un buen punto intermedio. 
            sameSite: isSecure ? 'lax' : 'strict', 
            secure: isSecure
        });

        // Devuelve la respuesta
        let responseData = { ok: true, user: { email: user.email, role: user.role } };
        
        // NOTA: Quité la lógica de devolver el token en el body en desarrollo, 
        // ya que la cookie es el método preferido. Si lo necesitas para 
        // un flujo de desarrollo específico (ej. Postman), puedes dejarlo, 
        // pero para el flujo normal de React/Cookies no es necesario.
        // Si el frontend está en un dominio diferente, necesitarás asegurar 
        // que CORS y las cookies están configurados correctamente para ello.
        // if (process.env.NODE_ENV !== 'production') {
        //     responseData.token = token; 
        // }
        
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