import { Router } from 'express';
import { addToCart, checkoutCart, reviewCart } from '../controllers/cartController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, addToCart);
router.get('/', authenticate, reviewCart);
router.post('/checkout', authenticate, checkoutCart);

export default router;
