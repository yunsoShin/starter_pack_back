import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { Result } from "@/utils/functionalUtil";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result: Result<T, any>) => {
        // 결과가 isSuccess: false 인 경우 에러로 처리
        if (result.isSuccess === false) {
          throw new HttpException(result.error, result.statusCode || 500);
        }

        // 성공적인 응답을 처리하여 필요한 형식으로 변환
        const successResponse = {
          isSuccess: result.isSuccess ? result.isSuccess : true,
          statusCode: statusCode,
          message: "Request successfully handled",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          data: result.value, // value를 data로 전달
        };

        return successResponse; // 성공적인 응답 반환
      }),
      catchError((error) => {
        // 에러 발생 시 처리
        const status = error instanceof HttpException ? error.getStatus() : 500;

        const errorResponse = {
          isSuccess: false,
          statusCode: status,
          message: error.message || "An error occurred",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
        };

        response.status(status).json(errorResponse); // 실패 응답 반환
        return throwError(() => error); // 예외 다시 던지기
      })
    );
  }
}
