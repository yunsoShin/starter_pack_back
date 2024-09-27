import { Controller, Get, UseGuards, Body, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("profile")
  @UseGuards(AuthGuard("jwt")) // JWT 인증이 필요함을 설정
  async getProfile(@Body("username") username: string) {
    return this.userService.findByUsername(username);
  }

  @Post("/signup")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }
}
