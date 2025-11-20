// test-hash.js
import bcrypt from 'bcrypt';

const hash = '$2b$10$DQr/ZKBEHpfCi5pKk4XvZOUO642f3jyV49wl13pWVvS813cZA6MTm';
const password = 'Admin12345';

const isMatch = await bcrypt.compare(password, hash);

console.log('¿Coincide?', isMatch);
if (isMatch) {
  console.log('✅ ¡La contraseña es correcta!');
} else {
  console.log('❌ La contraseña NO coincide.');
}