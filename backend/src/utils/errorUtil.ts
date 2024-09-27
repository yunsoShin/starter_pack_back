//Promise 기반의 함수 실행 시 에러를 핸들링하는 함수입니다.

export const handleAsync = async <T>(
  promise: Promise<T>
): Promise<[T | null, any | null]> => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

//로그 메시지를 포맷팅하는 함수입니다.
export const formatLog = (
  message: string,
  level: "INFO" | "ERROR" | "DEBUG",
  timestamp: Date = new Date()
): string => {
  return `[${level}] - ${timestamp.toISOString()}: ${message}`;
};

export const safeExecute =
  (fn: Function) =>
  (...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
