import express from 'express';
import { updateUser, createUser, getUser, activateUser, inactivateUser } from '../controllers/user_controller.js';
import verifyToken from '../middlewares/authenticate.js';

const router = express.Router();

router.put('/:user_id', verifyToken, updateUser);
router.get('/', verifyToken, getUser);
router.post('/user-form', verifyToken, createUser);
router.post('/inactivate', verifyToken, inactivateUser);
router.post('/activate', verifyToken, activateUser);

export default router;