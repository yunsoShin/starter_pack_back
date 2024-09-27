import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { DataSource } from "typeorm";
import { DatabaseModule } from "src/database/database.moduel";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: "USER_REPOSITORY",
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ["DATA_SOURCE"],
    },
  ],
  exports: [UserService],
})
export class UserModule {}
