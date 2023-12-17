import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(), json({ limit: '50mb' }));
  await app.listen(process.env.APPLICATION_PORT);
};

bootstrap();
