import jwt from 'jsonwebtoken';
import mongoose, { Model } from 'mongoose';
import { UserSchema } from '../models/userModel';
import { Request, Response, NextFunction } from 'express';

const userSchema: Model<any> = mongoose.model('User', UserSchema);

const secretKey = 'AIT@123';

interface SignVariable {
  id: string;
  email: string;
}

interface ExtendRequest extends Request {
  user: any;
}

const generateToken = (user: any): string => {
  const SignVariable: SignVariable = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(SignVariable, secretKey, {
    expiresIn: '1h',
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({
        message: 'No token provided.',
        error: 'Unauthorized',
      });
    }

    const decoded: any = jwt.verify(token, secretKey);

    const user = await userSchema.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token.',
        error: 'user not provided',
      });
    }
    (req as ExtendRequest).user = user;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired.',
        error: 'Unauthorized',
      });
    }
    console.error(err);
    res.status(401).json({
      message: 'Invalid token.',
      error: 'check the token',
    });
  }
};

// const validateToken = (token: string): boolean => {
//   try {
//     jwt.verify(token, secretKey);
//     return true;
//   } catch (err: any) {
//     return false;
//   }
// };

export { generateToken, authenticate };
