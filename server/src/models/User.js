import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model('User', UserSchema);