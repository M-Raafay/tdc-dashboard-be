import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: '*',
    methods: '*',
  };
  app.enableCors(corsOptions);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log(configService.get('PORT'));

  await app.listen(Number(configService.get('PORT')) || 3001);
}
bootstrap();
