import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "@/user/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { typeOrmConfig } from "ormconfig";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { IpGeolocationMiddleware } from "./common/middleware/ip-geolocation.middleware"; // IP 미들웨어 추가
import { AppLogger } from "./app.logger";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: process.env.IS_DEV ? true : false,
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // 기타 프로바이더
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(LoggerMiddleware) // 로깅 미들웨어 적용  ELK 미들웨어입니다
      // .forRoutes("*")           // 모든 라우트에 대해 적용
      .apply(IpGeolocationMiddleware) // 한국에서만 접근 허용 미들웨어 적용
      .forRoutes("*"); // 모든 라우트에 대해 적용
  }
}
