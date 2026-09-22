import express from 'express';
import { APP_NAME, checkDatabase, logger } from '../shared/index.js';
import { env } from './src/config/env.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', async (_req, res) => {
  let database = 'not_configured';

  if (env.databaseUrl) {
    try {
      const ok = await checkDatabase();
      database = ok ? 'up' : 'down';
    } catch (err) {
      logger.warn('Database health check failed', err);
      database = 'down';
    }
  }

  const healthy = database === 'up' || database === 'not_configured';

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    data: {
      service: APP_NAME,
      status: healthy ? 'ok' : 'degraded',
      env: env.nodeEnv,
      database,
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`${APP_NAME} API listening on http://localhost:${env.port}`);
  if (!env.databaseUrl) {
    logger.warn('DATABASE_URL is empty — set it in server/.env before using the queue');
  }
});
