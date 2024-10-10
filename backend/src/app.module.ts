import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "./user/user.module";
import { User } from "@/user/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수를 전역에서 사용하기 위함
    }),
    // TypeOrmModule 설정
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      migrations: [__dirname + '/src/migrations/*.ts'],
      charset: 'utf8mb4',
      synchronize: true, // 개발 시에만 true, 운영 환경에서는 false로 설정
      logging: false,
      extra: {
        collation: 'utf8mb4_unicode_ci',
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
