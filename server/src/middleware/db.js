import { connectDB } from '../config/db.js';

export default async function dbMiddleware(req, res, next) {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Middleware DB error:', err);
    res.status(500).json({ error: 'Fallo en la base de datos' });
  }
}