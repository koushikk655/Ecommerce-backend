import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { IUser } from '../models/User';
import { sendCheckoutEmail } from '../services/emailService'; 

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = (req.user as IUser)._id;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, products: [{ product, quantity }] });
  } else {
    cart.products.push({ product, quantity });
  }
  await cart.save();
  res.status(200).json(cart);
};

export const reviewCart = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as IUser)._id;  // Extract user ID from authenticated request
        
        // Find the cart for the authenticated user
        const cart = await Cart.findOne({ user: userId }).populate('products.product'); // Populate the product details
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Return the populated cart with product details
        res.status(200).json({
            _id: cart._id,
            products: cart.products.map((item) => ({
                productId: item.product._id,
                title: item.product.title,
                description: item.product.description,
                price: item.product.price,
                quantity: item.quantity,
                image:item.product.image
            })),
            address: cart.address
        });
    } catch (error) {
        console.error('Error reviewing cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const checkoutCart = async (req: Request, res: Response) => {
  const { address } = req.body;
  const userId = (req.user as IUser)._id;
  
  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(400).json({ message: 'Cart is empty' });

  cart.address = address;
  await cart.save();
  const cartProducts = cart.products.map((item) => ({
    title: item.product.title,
    quantity: item.quantity,
    price: item.product.price
}));

// Send checkout confirmation email
await sendCheckoutEmail((req.user as any).email, cartProducts, address);
  // clear cart
  cart.products = [];
  await cart.save();

  // Send email logic here
  
  res.json({ message: 'Checkout successful' });
};
