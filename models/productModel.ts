import { Schema, model } from 'mongoose';

interface NewProduct {
  name: string;
  images: string[];
  price: number;
  createdAt: Date;
  isAvailable: boolean;
}

const ProductSchema = new Schema<NewProduct>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true,
    lowercase: true,
  },
  images: {
    type: [{ type: String }],
    required: [true, 'Image is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAvailable: {
    type: Boolean,
    required: [true, 'Availability is required'],
    default: true,
  },
});

const Product = model('Product', ProductSchema);

export { ProductSchema, Product };
