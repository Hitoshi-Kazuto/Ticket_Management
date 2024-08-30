import express from 'express';
import verifyToken from '../middlewares/authenticate.js';
import { updateStatus, createStatus, getStatus, activateStatus, inactivateStatus } from '../controllers/status_controller.js';

const router = express.Router();

router.put('/:status_id', verifyToken, updateStatus);
router.get('/', verifyToken, getStatus);
router.post('/status-form', verifyToken, createStatus);
router.post('/inactivate', verifyToken, inactivateStatus);
router.post('/activate', verifyToken, activateStatus);

export default router;