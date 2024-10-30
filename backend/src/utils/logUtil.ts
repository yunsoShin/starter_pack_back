import { createLogger, format, transports } from "winston";
const DailyRotateFile = require("winston-daily-rotate-file");
const { LogstashTransport } = require("winston-logstash-transport");

export const formatLog = (
  message: string,
  level: "INFO" | "ERROR" | "DEBUG",
  timestamp: Date = new Date()
): string => {
  return `[${level}] - ${timestamp.toISOString()}: ${message}`;
};

// 개발 환경 여부 확인
const isDev = process.env.IS_DEV;
const logstashHost = isDev ? "127.0.0.1" : process.env.LOGSTASH_HOST;
const logstashPort = isDev ? process.env.LOGSTASH_PORT : 5044;

// 'isSuccess'가 포함된 메시지를 필터링하는 custom format
const filterIsSuccessLogs = format((info) => {
  if (info.message.includes("method") && info.message.includes("url")) {
    return false; // 필터링하여 이 로그는 출력하지 않음
  }
  return info; // 필터링되지 않은 경우, 계속해서 처리
});

// Winston 로그 설정
export const logger = createLogger({
  level: "info", // 기본 로그 레벨 설정
  format: format.combine(
    format.timestamp(),
    format.json() // JSON 형식으로 로그 기록
  ),
  transports: [
    // 일반 로그 파일 (날짜별 회전)
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log", // 날짜별 파일 생성
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: "info", // info 이상의 로그를 파일에 저장
    }),
    // 에러 로그 파일 (에러 전용)
    new transports.File({
      filename: "logs/error.log",
      level: "error", // error 레벨 이상의 로그만 기록
    }),
    // 콘솔 출력 (명시적 console.log 및 error 로그 처리)
    new transports.Console({
      level: "error", // error 레벨 이상의 로그만 출력
      format: format.combine(
        format.colorize(),
        format.simple() // 간단한 포맷으로 출력
      ),
    }),
    // info 로그 처리 (isSuccess 필터링 이후 출력)
    new transports.Console({
      level: "info", // info 레벨 이상의 로그만 출력
      format: format.combine(
        filterIsSuccessLogs(),
        format.timestamp(),
        format.json() // JSON 형식으로 로그 기록
      ),
      silent: true, // 터미널에 출력하지 않도록 설정
      // format: format.combine(
      //   format.colorize(),
      //   format.printf(({ level, message, timestamp }) => {
      //     // 터미널에 출력할 로그 포맷 설정
      //     return `[${level}] ${timestamp}: ${message} (from console.log)`;
      //   })
      // ),
    }),
    // Logstash 연동 (개발 환경과 배포 환경 모두)
    // new LogstashTransport({
    //   host: logstashHost,
    //   port: logstashPort,
    //   protocol: "tcp",
    //   level: "info", // info 레벨 이상의 로그는 Logstash로 전송
    //   handleExceptions: true, // 예외 처리
    //   onError: (err) => console.error("LogstashTransport error:", err),
    // }),
  ],
});
export function getCallerFunctionName(): string {
  const stack = new Error().stack; // 호출 스택 가져오기
  if (!stack) return "unknown_function";

  const stackLines = stack.split("\n");

  // 스택에서 3번째 라인이 호출된 함수의 위치를 나타냄 (Node.js 환경 기준)
  // 브라우저 환경에서는 이 인덱스를 조정해야 할 수도 있음
  const callerLine = stackLines[3];

  if (!callerLine) {
    return "unknown_function";
  }

  // 함수 이름을 추출 (일반적으로 형식은 'at 함수명 (파일 경로)')
  const match = callerLine.match(/at\s+(.*)\s+\(/);

  return match ? match[1] : "unknown_function";
}
