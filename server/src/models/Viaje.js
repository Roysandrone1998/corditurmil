import mongoose from 'mongoose';

const ViajeSchema = new mongoose.Schema({

  titulo: { type: String, trim: true },
  destino: { type: String, required: true, trim: true },

  descripcion: String,
  precio: Number,
  moneda: { type: String, default: 'ARS' },


  fecha_salida: Date,
  fecha_inicio: Date,
  fecha_fin: Date,


  categoria: {
    type: String,
    enum: ['internacional', 'nacional', 'educativos'],
    default: 'internacional',
    index: true
  },

  // solo PDF
  pdf_itinerario: String,

  publicado: { type: Boolean, default: true }
}, { timestamps: true });

ViajeSchema.index({ publicado: 1, categoria: 1, createdAt: -1 });

ViajeSchema.virtual('dias_duracion').get(function () {
  if (this.fecha_inicio && this.fecha_fin) {
    const ms = this.fecha_fin - this.fecha_inicio;
    return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
  }
  return null;
});


export default mongoose.models.Viaje || mongoose.model('Viaje', ViajeSchema);