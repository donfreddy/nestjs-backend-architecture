import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, VersioningType } from '@nestjs/common';
import { configService } from './config/config.service';
import { ValidationPipe } from './common/pipes';
import { HttpExceptionFilter } from './common/exceptions';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const port = configService.getPort();

  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(app.get(I18nService)));

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
