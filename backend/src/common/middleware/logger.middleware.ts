import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import axios from "axios"; // HTTP 클라이언트

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;

    // 로그 데이터 생성
    const log = {
      method,
      originalUrl,
      headers,
      body,
      timestamp: new Date().toISOString(),
    };

    // 데이터를 JSON 문자열로 직렬화
    const serializedLog = JSON.stringify(log);

    // Logstash로 HTTP 요청을 통해 로그 전송
    if (process.env.IS_DEV === "false") {
      axios
        .post(`http://127.0.0.1:${process.env.LOGSTASH_PORT}`, serializedLog, {
          headers: {
            "Content-Type": "application/json", // Content-Type을 JSON으로 설정
          },
          timeout: 100, // 타임아웃 설정
        })
        .catch((err) => {
          console.error("Logstash 전송 에러:", err);
        });
    } else {
      axios
        .post(`http://logstash:${process.env.LOGSTASH_PORT}`, serializedLog, {
          headers: {
            "Content-Type": "application/json", // Content-Type을 JSON으로 설정
          },
          timeout: 100, // 타임아웃 설정
        })
        .catch((err) => {
          console.error("Logstash 전송 에러:", err);
        });
    }

    next();
  }
}
