import express from 'express';
import { updateUser, createUser, getUser, activateUser, inactivateUser } from '../controllers/user_controller.js';
import verifyToken from '../middlewares/authenticate.js';

const router = express.Router();

router.put('/:user_id', updateUser);
router.get('/', getUser);
router.post('/user-form', createUser);
router.post('/inactivate', inactivateUser);
router.post('/activate', activateUser);

export default router;