import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { AppDataSource } from "../typeorm.config";
import { LoggerMiddleware } from "./common/middleware/logger.middleware"; // LoggerMiddleware import

async function bootstrap() {
  dotenv.config();
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // CSRF 토큰을 위해 쿠키 파서 사용
  app.enableCors();

  // LoggerMiddleware 전역 적용
  app.use(new LoggerMiddleware().use);

  await app.listen(7778);
}
bootstrap();
