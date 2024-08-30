import express from 'express';
import { updateCategory, createCategory, getCategory, activateCategory, inactivateCategory } from '../controllers/category_controller.js';
import verifyToken from '../middlewares/authenticate.js';
const router = express.Router();

router.put('/:cat_id', verifyToken, updateCategory);
router.get('/', verifyToken, getCategory);
router.post('/category-form', verifyToken, createCategory);
router.post('/inactivate', verifyToken, inactivateCategory);
router.post('/activate', verifyToken, activateCategory);

export default router;