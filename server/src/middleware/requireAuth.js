import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
    // 1. Buscar en la Cookie (usado por /api/auth/me)
    let token = req.cookies?.token;

    // 2. Si no está en la cookie, buscar en el Header Authorization (usado por api.js)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) return res.status(401).json({ error: "No autenticado" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // La validación de rol se mantiene (muy bien hecho)
        if (payload.role !== "admin") return res.status(403).json({ error: "Sin permisos" });
        
        req.user = payload;
        next();
    } catch (e) {
        // Añadí el error de token expirado, útil para debug
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Sesión expirada" });
        }
        return res.status(401).json({ error: "Token inválido" });
    }
}