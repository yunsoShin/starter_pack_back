export interface ErrorResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  timestamp: string;
  path: string;
  method: string;
}

export interface SuccessResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  method: string;
  data?: any; // 성공 시 반환할 데이터 (옵션)
}
