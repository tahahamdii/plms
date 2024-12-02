import Tache from '../models/Tache.js'; 
import Membre from '../models/Membre.js';
import Projet from '../models/Projet.js';

// Créer une tâche
export const creerTache = async (req, res) => {
  const { titre, description, statut, dateDebut, dateFin, membreAssigne, projetAssocie } = req.body;

  try {
    const tache = new Tache({
      titre,
      description,
      statut,
      dateDebut,
      dateFin,
      membreAssigne,
      projetAssocie
    });

    await tache.save();
    res.status(201).json(tache);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche" });
  }
};

// Modifier une tâche
export const modifierTache = async (req, res) => {
  const { titre, description, statut, dateDebut, dateFin, membreAssigne, projetAssocie } = req.body;

  try {
    const tache = await Tache.findByIdAndUpdate(req.params.id, {
      titre,
      description,
      statut,
      dateDebut,
      dateFin,
      membreAssigne,
      projetAssocie
    }, { new: true });

    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.json(tache);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification de la tâche" });
  }
};

// Supprimer une tâche
export const supprimerTache = async (req, res) => {
  try {
    const tache = await Tache.findByIdAndDelete(req.params.id);

    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
  }
};

// Obtenir la liste des tâches
export const listeTaches = async (req, res) => {
  try {
    const taches = await Tache.find();
    res.json(taches);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
  }
};

// Obtenir les détails d'une tâche
export const detailsTache = async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);

    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.json(tache);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des détails de la tâche" });
  }
};

// Obtenir les tâches d'un projet
export const tachesParProjet = async (req, res) => {
  try {
    const taches = await Tache.find({ projetAssocie: req.params.projetId })
      .populate('membreAssigne', 'nom email');  // Peupler le champ membreAssigne avec les champs nom et email du membre
    
    res.json(taches);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches du projet" });
  }
};

