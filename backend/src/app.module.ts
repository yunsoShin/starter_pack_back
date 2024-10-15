import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "@/user/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { typeOrmConfig } from "ormconfig";

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
export class AppModule {}
