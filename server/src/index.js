import 'dotenv/config';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import express from 'express';
import cors from 'cors'; // Importado
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import viajesRoutes from './routes/viajes.routes.js';
import pdfsRoutes from './routes/pdfs.routes.js'; 

const app = express();

app.use(helmet());
app.use(morgan('dev'));


const allowedOrigins = [
    'http://localhost:5173', 
    process.env.CORS_ORIGIN 
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir solicitudes sin 'origin' (ej: Postman, o peticiones del mismo origen)
        if (!origin) return callback(null, true);
        
        // Verificar si el origen solicitante está en la lista de permitidos
        if (allowedOrigins.includes(origin)) {
            callback(null, true); // Permitido
        } else {
            // Revisa si la URL de producción existe. Si no existe o no coincide, negar.
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
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/viajes', viajesRoutes);
app.use('/api/pdfs', pdfsRoutes);

const PORT = process.env.PORT || 4000;
await connectDB();

///para vercel no se debe usar app.listen,. se debe exportar el modulo para que este lo envuelva en una funcion serverless
/*
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
*/
export default app;
