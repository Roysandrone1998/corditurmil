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
    'https://corditurmil.vercel.app', // Tu URL de vercel actual
    'https://tu-nuevo-dominio.com.ar', // Tu dominio nuevo si ya lo tenés
    process.env.CORS_ORIGIN // Lo que tengas en Render
].map(url => normalizeUrl(url)).filter(Boolean); // Limpia y quita nulos

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (como Postman o el mismo servidor)
        if (!origin) return callback(null, true);
        
        const cleanOrigin = normalizeUrl(origin);

        if (allowedOrigins.includes(cleanOrigin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log('Bloqueado por CORS:', origin); 
            // Para debug: permitimos pasar pero logueamos el error
            callback(null, true); 
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