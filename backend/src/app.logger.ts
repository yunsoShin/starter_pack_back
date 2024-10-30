import { Injectable, LoggerService } from "@nestjs/common";
import { logger } from "@/utils/logUtil"; // logger.ts 파일에서 올바르게 import

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string) {
    logger.info(message); // 올바르게 logger 객체 사용
  }

  error(message: string, trace?: string) {
    logger.error(message, { trace }); // 에러 로그 처리
  }

  warn(message: string) {
    logger.warn(message); // 경고 로그 처리
  }

  debug?(message: string) {
    logger.debug(message); // 디버그 로그 처리
  }

  verbose?(message: string) {
    logger.verbose(message); // 상세 로그 처리
  }
}
