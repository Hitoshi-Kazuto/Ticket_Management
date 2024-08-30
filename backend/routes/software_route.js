import express from 'express';
import { updateSoftware, createSoftware, getSoftware, activateSoftware, inactivateSoftware } from '../controllers/software_controller.js';
import verifyToken from '../middlewares/authenticate.js';
const router = express.Router();

router.put('/:sw_id', verifyToken, updateSoftware);
router.get('/', verifyToken, getSoftware);
router.post('/software-form', verifyToken, createSoftware);
router.post('/inactivate', verifyToken, inactivateSoftware);
router.post('/activate', verifyToken, activateSoftware);

export default router;