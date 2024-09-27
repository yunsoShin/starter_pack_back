import { getDataSource } from "dataSource";

const dotenv = require("dotenv");
dotenv.config();

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      return getDataSource();
    },
  },
];
