import { ProductSchema } from '../models/productModel';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';

namespace Products {
  export class Product {
    private productSchema: Model<any>;

    constructor(productSchema: Model<any>) {
      this.productSchema = productSchema;
    }

    public async createProduct(req: Request, res: Response): Promise<any> {
      try {
        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ message: 'No images provided.' });
        }

        const product = new this.productSchema({
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
    }

    public async getAllProducts(req: Request, res: Response): Promise<any> {
      try {
        const products = await this.productSchema
          .find()
          .select('name price isAvailable')
          .lean();
        return res.status(200).json({
          message: 'Products fetched successfully.',
          data: products,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching products.' });
      }
    }
    public async getProductByID(req: Request, res: Response): Promise<any> {
      try {
        const id = req.params.id;
        const product = await this.productSchema
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
    }

    public async getProductByName(req: Request, res: Response): Promise<any> {
      try {
        const { name } = req.query;

        if (!name) {
          return res.status(400).json({ message: 'Name is required.' });
        }

        const products = await this.productSchema
          .find({ name: { $regex: name, $options: 'i' } })
          .select('name price isAvailable')
          .lean();

        if (products.length === 0) {
          return res.status(404).json({ message: 'No products found.' });
        }

        const filteredProducts = products.filter((product) =>
          product.name.toLowerCase().includes(name)
        );

        res.status(200).json({
          message: 'Products fetched successfully.',
          data: filteredProducts,
        });
      } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching products.' });
      }
    }

    public async getProductByDate(req: Request, res: Response): Promise<any> {
      try {
        const date = req.query.date as string;
        if (!date) {
          return res.status(400).json({ message: 'Date is required.' });
        }
        const products = await this.productSchema
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
    }

    public async getProductStock(req: Request, res: Response): Promise<any> {
      try {
        const products = await this.productSchema
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
    }
    public async updateProduct(req: Request, res: Response): Promise<any> {
      try {
        const id = req.params.id;
        const product = await this.productSchema.findById(id);
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
    }

    public async deleteProduct(req: Request, res: Response): Promise<any> {
      try {
        const id = req.params.id;
        const product = await this.productSchema.findByIdAndDelete(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully.' });
      } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting product.' });
      }
    }
  }
}

const product = new Products.Product(mongoose.model('Product', ProductSchema));

export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.createProduct(req, res);
};

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  return product.getAllProducts(req, res);
};

export const getProductByID = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.getProductByID(req, res);
};

export const getProductByName = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.getProductByName(req, res);
};

export const getProductByDate = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.getProductByDate(req, res);
};

export const getProductStock = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.getProductStock(req, res);
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.updateProduct(req, res);
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  return product.deleteProduct(req, res);
};
