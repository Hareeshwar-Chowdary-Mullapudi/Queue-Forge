import dotenv from 'dotenv';
import { APP_NAME, logger } from '../shared/index.js';

dotenv.config();

const workerId = process.env.WORKER_ID || 'worker-1';
const pollMs = Number(process.env.WORKER_POLL_MS) || 1000;

logger.info(`${APP_NAME} worker ready`, { workerId, pollMs });
logger.info('Job processing not implemented yet — Database / Worker phases come next');
