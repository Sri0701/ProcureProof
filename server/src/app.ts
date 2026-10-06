import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import type { Env } from './config/env';
import { errorHandler, notFound, requestLogger } from './middleware/errors';
import { health } from './routes/health';

function allowedOrigin(env: Env, origin: string | undefined) {
  if (!origin) return true;
  if (origin === env.FRONTEND_URL) return true;
  if (env.NODE_ENV !== 'production' && origin === 'http://localhost:5173') return true;
  return false;
}

export function createApp(env: Env) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (allowedOrigin(env, origin)) callback(null, true);
      else callback(null, false);
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '100kb' }));
  app.use(requestLogger);
  app.use(rateLimit({
    windowMs: 60_000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Wait a minute and try again.',
      },
    },
  }));
  app.get('/health', health);
  app.get('/api/health', health);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
