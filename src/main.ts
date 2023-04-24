import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
