import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, VersioningType } from '@nestjs/common';
import { configService } from './config/config.service';
import { ValidationPipe } from './common/pipes';

async function bootstrap() {
  const port = configService.getPort();

  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Set global path
  app.setGlobalPrefix('/api');

  await app.listen(port, (): void => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

void bootstrap();
