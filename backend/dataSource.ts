import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "@/user/entities/user.entity";

dotenv.config();
let dataSourceInstance: DataSource;

export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSourceInstance) {
    //인스턴스 1개만 DB연결 및 유효하도록 싱글턴 패턴
    //nest g resource <생성 리소스> CLI로 생성된 엔티티를 디폴트로함 경로 구조는 src/<리소스>/entities/리소스.entity.ts

    dataSourceInstance = new DataSource({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      migrations: [__dirname + "/../migrations/*{.ts,.js}"],
      charset: "utf8mb4",
      synchronize: true, // 실서비스에서는 false로?
      logging: false,
      extra: {
        collation: "utf8mb4_unicode_ci",
      },
    });
    await dataSourceInstance.initialize();
  }
  return dataSourceInstance;
};
