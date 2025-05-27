require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    )
      // habilitar CORS
    app.enableCors({
        origin: process.env.FRONT_URL, 
        credentials: true
    });
    // app.enableCors({ origin: true }); //habilitar CORS para todos los dominios
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
