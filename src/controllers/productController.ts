import { Request, Response } from 'express';
import Product from '../models/Product';

export const createProduct = async (req: Request, res: Response) => {
  const { title, description, price } = req.body;
  const image = req.file?.filename;
  const newProduct = new Product({ title, description, price, image });
  await newProduct.save();
  
  res.status(201).json({ message: 'Product created successfully' });
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};
