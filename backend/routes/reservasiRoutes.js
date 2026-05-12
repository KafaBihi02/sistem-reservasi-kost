import express from 'express';
const router = express.Router();
import { getAll, getById, create, updateStatus } from '../controllers/reservasiController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

router.get('/', requireAuth, getAll);
router.get('/:id', requireAuth, getById);
router.post('/', requireAuth, create);
router.patch('/:id/status', requireAdmin, updateStatus);

export default router;
