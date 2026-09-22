import express from 'express';
import { APP_NAME, logger } from '../shared/index.js';
import { env } from './src/config/env.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: APP_NAME,
      status: 'ok',
      env: env.nodeEnv,
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`${APP_NAME} API listening on http://localhost:${env.port}`);
});
