import mongoose from 'mongoose';

const TacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  statut: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  membreAssigne: { type: mongoose.Schema.Types.ObjectId, ref: 'Membre' },
  projetAssocie: { type: mongoose.Schema.Types.ObjectId, ref: 'Projet' }
});

const Tache = mongoose.model('Tache', TacheSchema);

export default Tache;