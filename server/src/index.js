import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import dbMiddleware from './middleware/db.js';
import testRoutes from './routes/test.routes.js'; 
import { connectDB } from './config/db.js'; 
import authRoutes from './routes/auth.routes.js';
import viajesRoutes from './routes/viajes.routes.js';
import pdfsRoutes from './routes/pdfs.routes.js'; 

const app = express();


// Necesario para que Render maneje bien las cookies seguras (secure: true)
app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan('dev'));

// Configuración de CORS
// Función auxiliar para limpiar URLs (quitar barras al final)
const normalizeUrl = (url) => url ? url.trim().replace(/\/+$/, '') : '';

const allowedOrigins = [
    'http://localhost:5173', 
    normalizeUrl(process.env.CORS_ORIGIN) // Asegúrate que en Render sea: https://corditurmil-gxv4.vercel.app
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        // Limpiamos el origen entrante para comparar bien
        const cleanOrigin = normalizeUrl(origin);

        if (allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.log('Bloqueado por CORS:', origin); 
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
app.get('/api/health', (_req, res) => res.json({ ok: true, msg: 'Servidor activo' })); 
app.use('/api/auth', authRoutes);
app.use('/api/viajes', viajesRoutes);
app.use('/api/pdfs', pdfsRoutes);
app.use('/api/test', testRoutes); 

app.use('/api', dbMiddleware);

const PORT = process.env.PORT || 4000;

// --- INICIO DEL SERVIDOR ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en puerto ${PORT}`);
        console.log(`✅ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}).catch(err => {
    console.error('❌ Error fatal al conectar a la DB:', err);
});

export default app;