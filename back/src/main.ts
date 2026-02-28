import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // todo delete
  app.use((req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    const queryStr = JSON.stringify(req.query);
    const bodyStr = req.method !== 'GET' ? JSON.stringify(req.body) : '';
    console.log(
      `\n[${timestamp}] 📥 REQUEST\n` +
        `   Method: ${req.method}\n` +
        `   Path: ${req.path}\n` +
        `   Query: ${queryStr !== '{}' ? queryStr : 'none'}\n` +
        `   Body: ${bodyStr || 'none'}\n` +
        `   Headers: ${JSON.stringify(req.headers)}`
    );

    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const statusEmoji = statusCode >= 200 && statusCode < 300 ? '✅' : statusCode >= 400 ? '❌' : '⚠️';
      console.log(
        `\n[${timestamp}] 📤 RESPONSE\n` +
          `   ${statusEmoji} Status: ${statusCode}\n` +
          `   Duration: ${duration}ms\n` +
          `   Body: ${typeof data === 'string' ? data : JSON.stringify(data)}`
      );
      return originalSend.call(this, data);
    };

    next();
  });

  app.use(bodyParser.json());

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}
bootstrap();
