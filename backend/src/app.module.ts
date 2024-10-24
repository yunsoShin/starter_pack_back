import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "@/user/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { typeOrmConfig } from "ormconfig";
import { LoggerMiddleware } from "./common/middleware/logger.middleware"; // LoggerMiddleware import

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: process.env.IS_DEV ? true : false, // 개발 시에는 true로 설정
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // LoggerMiddleware 적용
      .forRoutes("*"); // 모든 라우트에 대해 미들웨어 적용
  }
}
