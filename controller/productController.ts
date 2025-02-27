import { ProductSchema } from '../models/productModel';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';

const productSchema: Model<any> = mongoose.model('Product', ProductSchema);

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided.' });
    }

    const product = new productSchema({
      name: req.body.name,
      price: req.body.price,
      isAvailable: req.body.isAvailable,
      images: (req.files as Express.Multer.File[]).map((file) =>
        file.buffer.toString('base64')
      ),
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully.' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product.' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await productSchema
      .find()
      .select('name price isAvailable')
      .lean();
    return res
      .status(200)
      .json({ message: 'Products fetched successfully.', data: products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching products.' });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const product = await productSchema
      .findById(id)
      .select('name price isAvailable');
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res
      .status(200)
      .json({ message: 'Product fetched successfully.', data: product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product.' });
  }
};

export const getProductByName = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    const product = await productSchema
      .findOne({ name })
      .select('name price isAvailable');

    if (!product) {
      return res.status(404).json({ message: 'No product found.' });
    }

    res
      .status(200)
      .json({ message: 'Product fetched successfully.', data: product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product.' });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const product = await productSchema.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const { name, price, isAvailable } = req.body;
    product.set({ name, price, isAvailable });
    await product.save();
    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product.' });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const product = await productSchema.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product.' });
  }
};

export const getProductByDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }
    const products = await productSchema
      .find({ createdAt: { $gte: new Date(date) } })
      .select('name price isAvailable')
      .lean();
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found.' });
    }
    res
      .status(200)
      .json({ message: 'Products fetched successfully.', data: products });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products.' });
  }
};

export const productStock = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const products = await productSchema
      .find({ isAvailable: true })
      .select('name price isAvailable')
      .lean();
    res.status(200).json({
      message: 'Available products fetched successfully.',
      data: products,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching available products.' });
  }
};
