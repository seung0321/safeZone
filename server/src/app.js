import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import bordRouter from './routes/bordRouter.js';
import commentRouter from './routes/commentRouter.js';
import { globalErrorHandler } from './controllers/errorController.js';

dotenv.config();
const app = express();

const swaggerFile = fs.readFileSync(new URL('../swagger/swagger.yaml', import.meta.url), 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.use(morgan('dev')); 
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/bords', bordRouter);
app.use('/api/comments', commentRouter);

app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running`);
});
