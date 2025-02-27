import express, { Express } from 'express';
import connectDB from './config/db';
import cors from 'cors';
import userRouter from './routes/user';
import productRouter from './routes/product';
import mailRouter from './routes/mail';
import job from './controller/cronPractice';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();
app.use(cors());
app.use(express.json());
connectDB();
job.start();

app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', mailRouter);

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
