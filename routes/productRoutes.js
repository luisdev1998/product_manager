import express from 'express'
import checkAuth from '../middleware/checkAuth.js';
import {
    saveProduct,
    listProduct,
    getProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'

const router = express.Router();

router.route('/')
.post(checkAuth, saveProduct)
.get(checkAuth, listProduct);

router.route('/:id')
.get(checkAuth, getProduct)
.put(checkAuth, updateProduct)
.delete(checkAuth, deleteProduct);

export default router;