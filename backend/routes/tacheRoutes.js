import express from 'express';
import { creerTache, modifierTache, supprimerTache, listeTaches, detailsTache, tachesParProjet } from '../controllers/tacheController.js';

const router = express.Router();

router.post('/api/admin/taches', creerTache);
router.put('/api/admin/taches/:id', modifierTache);
router.delete('/api/admin/taches/:id', supprimerTache);
router.get('/api/admin/taches', listeTaches);
router.get('/api/admin/taches/:id', detailsTache);
router.get('/api/admin/projets/:projetId/taches', tachesParProjet);

export default router; // Assurez-vous d'utiliser export default