// config/db.js
import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectDB() {
  // Si ya hay una conexión reutilizable, usarla
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI no está definida');
  }

  try {
    // Opciones recomendadas para Vercel + MongoDB Atlas
    const conn = await mongoose.connect(uri, {
      bufferCommands: false,
      connectTimeoutMS: 30000,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });

    cachedConnection = conn;
    console.log('✅ MongoDB conectado (con caché)');
    return conn;
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    throw err;
  }
}