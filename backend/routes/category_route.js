import express from 'express';
import { updateCategory, createCategory, getCategory, activateCategory, inactivateCategory } from '../controllers/category_controller.js';
import verifyToken from '../middlewares/authenticate.js';
const router = express.Router();

router.put('/:cat_id', updateCategory);
router.get('/', getCategory);
router.post('/category-form', createCategory);
router.post('/inactivate', inactivateCategory);
router.post('/activate', activateCategory);

export default router;