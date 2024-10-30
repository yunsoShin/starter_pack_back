import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { getClientIp } from "@/utils/httpUtil"; // 유틸리티 함수 import

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  // 허용된 IP 목록 (여러 개 설정 가능)
  private readonly allowedIPs: string[] = [
    "127.0.0.1", // 로컬
    "::1", // ip6 로컬
  ];

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const requestIP = getClientIp(request); // 유틸리티 함수 사용

    if (!this.isAllowedIP(requestIP)) {
      // throw new ForbiddenException("허용되지 않은 IP에서의 요청입니다.");  // TODO : 운영버전에서 활성화하기
    }

    return true;
  }

  // IP가 허용 목록에 있는지 확인하는 메소드
  private isAllowedIP(requestIP: string): boolean {
    return this.allowedIPs.includes(requestIP);
  }
}
