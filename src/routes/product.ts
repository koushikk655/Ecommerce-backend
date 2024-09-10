import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, authorize('superadmin'), createProduct);
router.get('/', authenticate, getProducts);

export default router;
