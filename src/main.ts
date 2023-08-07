import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({whitelist:true}),
  );
  await app.listen(Number(configService.get('PORT')) || 3001);  
}
bootstrap();
