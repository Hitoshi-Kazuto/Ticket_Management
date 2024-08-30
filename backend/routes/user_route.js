import express from 'express';
import { updateUser, createUser, getUser, activateUser, inactivateUser } from '../controllers/user_controller.js';
import verifyToken from '../middlewares/authenticate.js';

const router = express.Router();

router.put('/:user_id', verifyToken(res, req), updateUser);
router.get('/', verifyToken(res, req), getUser);
router.post('/user-form',  verifyToken(res, req),createUser);
router.post('/inactivate', verifyToken(res, req), inactivateUser);
router.post('/activate', verifyToken(res, req), activateUser);

export default router;