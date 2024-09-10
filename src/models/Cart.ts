import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';

interface ICart extends Document {
  user: string;
  products: { product: IProduct, quantity: number }[];
  address?: string;
}

const cartSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, required: true } }],
  address: { type: String },
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
