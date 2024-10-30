import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User> // InjectRepository를 사용하여 주입
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || "user", // role이 없을 경우 기본값은 'user'
    });

    return await this.userRepository.save(user);
  }

  async validateUserPassword(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByUsername(username);

    // 사용자 존재 여부 확인
    if (!user) {
      throw new NotFoundException("login fail");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    throw new NotFoundException("login fail");
  }

  async findByUsername(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  // ID로 사용자 찾기
  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
