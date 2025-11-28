import 'dotenv/config'; 
import bcrypt from 'bcrypt';
import { connectDB } from './config/db.js'; // Solo una vez
import User from './models/User.js';

async function main() {

  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Uso: npm run seed:admin -- <email> <contrasena>');
    process.exit(1);
  }

  try {

    console.log('Conectando a la base de datos...');
    await connectDB(); 

    const existe = await User.findOne({ email });
    if (existe) {
      console.log('⚠️ Ya existe usuario con ese email');
      process.exit(0);
    }


    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash, role: 'admin' });

    console.log('✅ Admin creado correctamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

main();