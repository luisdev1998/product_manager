import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
    saveCategory,
    listCategories,
    getCategory,
    updateCategory, 
    deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.route('/')
.post(checkAuth, saveCategory)
.get(checkAuth, listCategories);

router.route('/:id')
.get(checkAuth, getCategory)
.put(checkAuth, updateCategory)
.delete(checkAuth, deleteCategory);

export default router;