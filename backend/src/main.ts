import { existsSync } from 'fs';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  loadEnv({ path: envPath });
} else {
  const nested = join(process.cwd(), 'backend', '.env');
  if (existsSync(nested)) loadEnv({ path: nested });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean | string) => void,
    ) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (corsOrigins.includes(origin)) {
        cb(null, origin);
        return;
      }
      try {
        const host = new URL(origin).hostname;
        if (
          host.endsWith('.vercel.app') ||
          host.endsWith('.onrender.com') ||
          host === 'localhost'
        ) {
          cb(null, origin);
          return;
        }
      } catch {
        cb(new Error('CORS'), false);
        return;
      }
      cb(new Error('CORS'), false);
    },
    credentials: true,
  });
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
}
bootstrap();
