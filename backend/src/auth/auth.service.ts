import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcryptjs";
import { User } from "../user/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    throw new UnauthorizedException("Invalid email or password");
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET, // 명시적으로 비밀 키 설정
      expiresIn: "1h", // 1시간 동안 유효
    });

    return { accessToken };
  }
}
