import express from 'express';
import { updateSoftware, createSoftware, getSoftware, activateSoftware, inactivateSoftware } from '../controllers/software_controller.js';

const router = express.Router();

router.put('/:sw_id', updateSoftware);
router.get('/', getSoftware);
router.post('/software-form', createSoftware);
router.post('/inactivate', inactivateSoftware);
router.post('/activate', activateSoftware);

export default router;