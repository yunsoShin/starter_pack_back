import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { getDataSource } from "../dataSource"; // DataSource 가져오기
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수를 전역에서 사용하기 위함
    }),
    UserModule,
  ],
  providers: [
    {
      provide: "DATA_SOURCE", // DataSource를 NestJS DI 컨테이너에 등록
      useFactory: async () => {
        const dataSource = await getDataSource();
        return dataSource;
      },
    },
  ],
})
export class AppModule {}
