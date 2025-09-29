import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('WEBHOOK_URL:', process.env.WEBHOOK_URL);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('PORT:', process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on port ${port}`);
}
bootstrap();
