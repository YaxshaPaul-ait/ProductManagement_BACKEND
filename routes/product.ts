import express, { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductByDate,
  getProductByID,
  getProductByName,
  getProductStock,
  updateProduct,
} from '../controller/productsController';
import { authenticate } from '../config/auth';

const upload: Multer = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post(
  '/products',
  upload.array('images', 12),
  authenticate,
  createProduct
);
router.get('/products', authenticate, getProduct);
router.get('/products/:id', authenticate, getProductByID);
router.get('/products_name', authenticate, getProductByName);
router.get('/products_date',authenticate,getProductByDate);
router.get('/product_stock',authenticate, getProductStock)
router.put('/product/:id', authenticate, updateProduct);
router.delete('/product/:id',authenticate,deleteProduct)

export default router;