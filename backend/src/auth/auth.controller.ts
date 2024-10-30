import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) res: Response // 쿠키 설정을 위해 Response 객체 주입
  ) {
    const user = await this.authService.validateUser(email, password);
    const { accessToken } = await this.authService.login(user);

    // 쿠키에 JWT 토큰 설정 (httpOnly, secure 옵션 추가)
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // 클라이언트가 JS로 쿠키에 접근하지 못하게 함 (XSS 보호)
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송 (프로덕션 환경에서만 적용)
      maxAge: 3600 * 1000, // 1시간
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF 보호를 위한 sameSite 설정
    });

    return { message: "Login successful" };
  }
}
