import express from 'express';
import { updatePartner, createPartner, getPartner, activatePartner, inactivatePartner } from '../controllers/partner_controller.js';

const router = express.Router();

router.put('/:partner_id', updatePartner);
router.get('/', getPartner);
router.post('/partner-form', createPartner);
router.post('/inactivate', inactivatePartner);
router.post('/activate', activatePartner);

export default router;