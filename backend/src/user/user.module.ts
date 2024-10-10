import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 엔티티를 리포지토리로 주입 가능하게 설정
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
