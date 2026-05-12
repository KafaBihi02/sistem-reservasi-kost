import express from 'express';
const router = express.Router();
import { getAll, getTrashed, getById, create, update, softDelete, restore, hardDelete } from '../controllers/kamarController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

router.get('/', getAll);
router.get('/trash', requireAdmin, (req, res, next) => {
    console.log('Accessing trashed items route');
    next();
}, getTrashed);
router.get('/:id', getById);
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, softDelete);
router.put('/:id/restore', requireAdmin, restore);
router.delete('/:id/permanent', requireAdmin, hardDelete);

export default router;
