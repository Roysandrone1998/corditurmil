import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import dbMiddleware from './middleware/db.js';
import testRoutes from './routes/test.routes.js'; 
import { connectDB } from './config/db.js'; // Importamos la conexión
import authRoutes from './routes/auth.routes.js';
import viajesRoutes from './routes/viajes.routes.js';
import pdfsRoutes from './routes/pdfs.routes.js'; 

const app = express();

app.use(helmet());
app.use(morgan('dev'));

// Configuración de CORS
const allowedOrigins = [
    'http://localhost:5173', 
    process.env.CORS_ORIGIN // Asegúrate que en Render esta var sea: https://corditurmil-gxv4.vercel.app
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir solicitudes sin 'origin' (ej: Postman o server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Bloqueado por CORS:', origin); // Log para debug en Render
            callback(new Error(`Acceso denegado por CORS para el origen: ${origin}`));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Static para servir los PDFs subidos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.get('/api/health', (_req, res) => res.json({ ok: true, msg: 'Servidor activo' })); // Ruta simple para probar
app.use('/api/auth', authRoutes);
app.use('/api/viajes', viajesRoutes);
app.use('/api/pdfs', pdfsRoutes);
app.use('/api/test', testRoutes); 

// Middleware de DB (opcional si usas connectDB global, pero lo dejo por si acaso)
app.use('/api', dbMiddleware);

const PORT = process.env.PORT || 4000;

// --- INICIO DEL SERVIDOR (CRUCIAL PARA RENDER) ---

// 1. Conectamos a la Base de Datos primero
connectDB().then(() => {
    // 2. Una vez conectados, levantamos el servidor
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        console.log(`✅ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('❌ Error fatal al conectar a la DB:', err);
});


export default app;