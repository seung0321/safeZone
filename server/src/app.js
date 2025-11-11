import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import { globalErrorHandler } from './controllers/errorController.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running`);
});
