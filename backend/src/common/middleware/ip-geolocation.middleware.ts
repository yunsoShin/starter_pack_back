import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as geoip from "geoip-lite";
import { getClientIp } from "@/utils/httpUtil";
import { AppLogger } from "@/app.logger";
import { ConfigService } from "@nestjs/config"; // ConfigService import
import { ErrorResponse } from "@/types/response.interface";

@Injectable()
export class IpGeolocationMiddleware implements NestMiddleware {
  private readonly allowedIPs: string[]; // 허용된 IP 목록을 환경 변수에서 가져옴

  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService // ConfigService 주입
  ) {
    // 환경 변수에서 ALLOWED_IPS 값 읽어오기
    const allowedIPsFromEnv = this.configService.get<string>("ALLOWED_IPS");
    // 콤마로 구분된 IP들을 배열로 변환
    this.allowedIPs = allowedIPsFromEnv ? allowedIPsFromEnv.split(",") : [];
  }

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = getClientIp(req); // 클라이언트 IP 가져오기
    const geo = geoip.lookup(clientIp); // IP의 국가 정보 확인
    const { method, originalUrl: url } = req;

    // 화이트리스트에 있는 IP는 국가 검증 없이 통과
    if (this.isAllowedIP(clientIp)) {
      return next();
    }

    // 화이트리스트에 없고, 한국이 아닌 경우 차단
    if (!geo || geo.country !== "KR") {
      const errorResponse: ErrorResponse = {
        isSuccess: false,
        statusCode: 403,
        message: "Access denied: Only accessible from South Korea",
        timestamp: new Date().toISOString(),
        path: url,
        method: method,
      };

      // 로깅 처리
      this.logger.error(
        JSON.stringify({
          timestamp: errorResponse.timestamp,
          method,
          url,
          statusCode: errorResponse.statusCode,
          ip: clientIp,
          message: errorResponse.message,
        })
      );

      // 응답 객체로 클라이언트에게 반환
      return res.status(403).json(errorResponse);
    }

    next(); // IP가 한국일 경우 계속 진행
  }

  // IP가 허용 목록에 있는지 확인하는 메소드
  private isAllowedIP(clientIp: string): boolean {
    return this.allowedIPs.includes(clientIp);
  }
}
