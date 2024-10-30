import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import { INestApplication } from "@nestjs/common";
import { AppLogger } from "./app.logger";
import { ResponseInterceptor } from "./common/interceptor/response.interceprot";
async function bootstrap() {
  dotenv.config();

  const server = express();
  const app = (await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new AppLogger(), // Winston 커스텀 로거 적용
  })) as INestApplication & express.Application;
  app.use(cookieParser());
  app.enableCors();
  app.set("trust proxy", 1);
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.BACKEND_PORT);
}

bootstrap();
