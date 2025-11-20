import mongoose from 'mongoose';

export async function connectDB() {
    const uri = process.env.MONGO_URI; 

    // Opcional: comprobación de seguridad
    if (!uri) {
        console.error('Error: La variable MONGO_URI no está definida.');
        process.exit(1);
    }
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(uri, {
            
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log('🗄️  MongoDB conectado');
    } catch (err) {
        console.error('Error MongoDB:', err.message);
        process.exit(1);
    }
}