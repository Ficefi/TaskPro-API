import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: "json" };

import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js';
import boardRouter from './routes/boardRoutes.js';
import columnRouter from './routes/columnRouters.js';
import cardRouters from './routes/cardRouters.js';
import themeRouter from './routes/themeRouter.js';

export const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/auth/', authRouter);
app.use('/users/', userRouter);

app.use('/boards/', boardRouter);
app.use('/columns/', columnRouter);
app.use('/cards/', cardRouters);

app.use('/theme/', themeRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});
