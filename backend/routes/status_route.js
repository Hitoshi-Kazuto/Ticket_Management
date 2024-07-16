import express from 'express';
import authorize from '../middlewares/authorize.js';
import { updateStatus, createStatus, getStatus, activateStatus, inactivateStatus } from '../controllers/status_controller.js';

const router = express.Router();

router.put('/:status_id', updateStatus);
router.get('/', getStatus);
router.post('/status-form', createStatus);
router.post('/inactivate', inactivateStatus);
router.post('/activate', activateStatus);

export default router;