import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AppLogger } from "@/app.logger";
import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.headers["user-agent"] || "";
    const requestBody = request.body;

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const contentLength = response.get("content-length");

        // 성공적인 요청에 대한 로그
        this.logger.log(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode,
            responseTime: `${Date.now() - now}ms`,
            ip,
            userAgent,
            requestBody,
            responseBody,
            contentLength,
          })
        );
      }),
      catchError((error) => {
        const status = error instanceof HttpException ? error.getStatus() : 500;
        const responseTime = `${Date.now() - now}ms`;

        // 에러 발생 시의 로그
        this.logger.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode: status,
            responseTime,
            ip,
            userAgent,
            requestBody,
            message: error.message || null,
          }),
          error.stack
        );

        return throwError(() => error);
      })
    );
  }
}
