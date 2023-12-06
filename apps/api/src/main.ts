import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('FinCheck')
    .setDescription(
      'Complete documentation of the routes, with the parameters of each request, as well as each route response. To see the application running, remove the "/api#" from the URL',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'JWT obtained from auth routes',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
