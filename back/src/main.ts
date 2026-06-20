import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

const SENSITIVE_KEYS = new Set(['password', 'token', 'accessToken', 'refreshToken', 'authorization']);

const safeStringify = (value: unknown): string => {
  if (!value) return '-';
  try {
    return JSON.stringify(value, (key, val) => (SENSITIVE_KEYS.has(key) ? '[REDACTED]' : val));
  } catch {
    return '[unserializable]';
  }
};

async function bootstrap() {
  const logger = new Logger('HTTP');
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use((req, res, next) => {
    const startTime = Date.now();
    const query = Object.keys(req.query ?? {}).length ? safeStringify(req.query) : '-';
    const hasBody = req.method !== 'GET' && req.body && Object.keys(req.body).length > 0;
    const body = hasBody ? safeStringify(req.body) : '-';
    logger.log(`-> ${req.method} ${req.originalUrl} | query=${query} | body=${body}`);

    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const ok = statusCode >= 200 && statusCode < 300 ? 'OK' : 'ERR';
      const responseBody =
        typeof data === 'string' ? data : data ? safeStringify(data) : '-';
      logger.log(`<-${ok} ${statusCode} ${req.method} ${req.originalUrl} | ${duration}ms | response=${responseBody}`);
      return originalSend.call(this, data);
    };

    next();
  });

  app.use(bodyParser.json());

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
