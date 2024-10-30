import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { configService } from './config/config.service';
import { ValidationPipe } from './common/pipes';
import { HttpExceptionFilter } from './common/exceptions';

async function bootstrap() {
  const port = configService.getPort();

  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global path
  app.setGlobalPrefix('/api');

  await app.listen(port, (): void => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

void bootstrap();
