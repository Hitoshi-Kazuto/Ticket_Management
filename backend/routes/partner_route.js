import express from 'express';
import { updatePartner, createPartner, getPartner, activatePartner, inactivatePartner } from '../controllers/partner_controller.js';
import verifyToken from '../middlewares/authenticate.js';
const router = express.Router();

router.put('/:partner_id', verifyToken, updatePartner);
router.get('/', verifyToken, getPartner);
router.post('/partner-form', verifyToken, createPartner);
router.post('/inactivate', verifyToken, inactivatePartner);
router.post('/activate', verifyToken, activatePartner);

export default router;