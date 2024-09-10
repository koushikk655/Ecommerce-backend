import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/auth';
import multer from 'multer';

const upload = multer({ dest: 'public/' });
const router = Router();

router.post('/', authenticate, authorize('superadmin'), upload.single('image'), createProduct);
router.get('/', authenticate, getProducts);

export default router;
