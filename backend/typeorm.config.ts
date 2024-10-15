import { DataSource } from "typeorm";
import { dataSourceConfig } from "./ormconfig";

export const AppDataSource = new DataSource(dataSourceConfig);
