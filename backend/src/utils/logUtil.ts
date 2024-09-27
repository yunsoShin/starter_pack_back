export const formatLog = (
  message: string,
  level: "INFO" | "ERROR" | "DEBUG",
  timestamp: Date = new Date()
): string => {
  return `[${level}] - ${timestamp.toISOString()}: ${message}`;
};
