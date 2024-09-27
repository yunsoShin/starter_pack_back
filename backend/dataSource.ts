import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "@/user/entities/user.entity";

dotenv.config();

export const dataSourceInstance = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: [__dirname + "/src/migrations/*.ts"],
  charset: "utf8mb4",
  synchronize: true,
  // logging: true,
  logging: false,
  extra: {
    collation: "utf8mb4_unicode_ci", // Add the collation property here
  },
});

dataSourceInstance.initialize().catch((error) => {
  console.error("Error during Data Source initialization", error);
});

// Optional: Helper function for retrieving the data source
export const getDataSource = async (): Promise<DataSource> => {
  if (!dataSourceInstance.isInitialized) {
    await dataSourceInstance.initialize();
  }
  return dataSourceInstance;
};
