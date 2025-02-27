import { Schema, model } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    select: false,
  },
});

const Users = model<User>('User', UserSchema);

export { UserSchema, Users };
