import { UserSchema } from '../models/userModel';
import { Request, Response } from 'express';
import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '../config/auth';

namespace UserServices {
  export class UserService {
    private  userSchema: Model<any>;

    constructor(userSchema: Model<any>) {
      this.userSchema = userSchema;
    }

    private async validateUser(
      req: Request
    ): Promise<{ name: string; email: string; password: string }> {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw new Error('Please provide all required fields.');
      }

      return { name, email, password };
    }

    private async validateUserForLogin(
      req: Request
    ): Promise<{ email: string; password: string }> {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('Please provide all required fields.');
      }

      return { email, password };
    }

    private async checkExistingUser(email: string): Promise<void> {
      const existingUser = await this.userSchema
        .findOne({ email })
        .select('email password');

      if (existingUser) {
        throw new Error(`User with email ${email} already exists.`);
      }
    }

    private async validatePassword(
      password: string,
      existingUser: any
    ): Promise<boolean> {
      return await bcrypt.compare(password, existingUser.password);
    }

    private async hashPassword(password: string): Promise<string> {
      return await bcrypt.hash(password, 10);
    }

    private async createToken(user: any): Promise<string> {
      return generateToken(user);
    }

    public async signUp(req: Request, res: Response): Promise<any> {
      try {
        const { name, email, password } = await this.validateUser(req);
        await this.checkExistingUser(email);

        const hashedPassword = await this.hashPassword(password);
        const user = await this.userSchema.create({
          name,
          email,
          password: hashedPassword,
        });
        const token = await this.createToken(user);
        res
          .status(201)
          .json({ message: 'User created successfully.', data: user, token });
      } catch (err: any) {
        console.error(err);
        res.status(500).json({
          message: 'Error creating user.',
          error: 'Internal Server Error',
        });
      }
    }

    public async login(req: Request, res: Response): Promise<any> {
      try {
        const { email, password } = await this.validateUserForLogin(req);
        const existingUser = await this.userSchema
          .findOne({ email })
          .select('email password');

        if (!existingUser) {
          return res.status(404).json({
            message: 'User not found.',
            error: 'Not Found',
          });
        }

        const isValidPassword = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (!isValidPassword) {
          return res.status(401).json({
            message: 'Invalid email or password.',
            error: 'Unauthorized',
          });
        }

        const token = await this.createToken(existingUser);
        const { password: userPassword, ...userData } = existingUser.toObject();
        res.status(200).json({
          message: 'User logged in successfully.',
          data: userData,
          token,
        });
      } catch (err: any) {
        console.error(err);
        res.status(500).json({
          message: 'Error logging in user.',
          error: 'Internal Server Error',
        });
      }
    }

    public async getUser(req: Request, res: Response): Promise<any> {
      try {
        const { email } = req.query;

        if (!email) {
          return res.status(400).json({
            message: 'Email is required.',
            error: 'Bad Request',
          });
        }

        const existingUser = await this.userSchema.findOne({ email });

        if (!existingUser) {
          return res.status(404).json({
            message: 'User not found.',
            error: 'Not Found',
          });
        }

        const { password, ...userData } = existingUser.toObject();

        res
          .status(200)
          .json({ message: 'User found successfully.', data: userData });
      } catch (err: any) {
        console.error(err);
        res.status(500).json({
          message: 'Error finding user.',
          error: 'Internal Server Error',
        });
      }
    }
  }
}

const userService = new UserServices.UserService(
  mongoose.model('User', UserSchema)
);

export const signUp = async (req: Request, res: Response): Promise<any> => {
  return userService.signUp(req, res);
};

export const login = async (req: Request, res: Response): Promise<any> => {
  return userService.login(req, res);
};

export const getUser = async (req: Request, res: Response): Promise<any> => {
  return userService.getUser(req, res);
};
