import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { UserService } from "src/user/user.service";
import { UserRole } from "@/types/enumList"; // user_group enum import
import { failure, success } from "@/utils/functionalUtil"; // success, failure import

const dotenv = require("dotenv");
dotenv.config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 컨트롤러에서 설정된 역할들 (roles 데코레이터를 통해 설정)
    const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roles || roles.length === 0) {
      // 역할이 설정되지 않은 경우, 기본적으로 통과시킴
      return true;
    }

    const request = context.switchToHttp().getRequest();

    try {
      // 쿠키에서 JWT 토큰 추출
      const token = request.cookies?.accessToken;
      if (!token) {
        // 토큰이 없는 경우 false 반환
        return false;
      }

      // JWT 토큰 검증 및 디코딩
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
        role: string;
      };
      const userId = Number(decoded.sub);

      // DB에서 사용자 정보 조회
      const member = await this.userService.findUserById(userId);
      const memberRole = member.role as keyof typeof UserRole;

      // 사용자의 역할이 요청에 필요한 역할 중 하나와 일치하는지 확인
      if (roles.includes(memberRole)) {
        return true;
      }

      // 필요한 역할 중 일치하는 것이 없는 경우
      return false;
    } catch (err) {
      // JWT가 유효하지 않은 경우 false 반환
      return false;
    }
  }
}
