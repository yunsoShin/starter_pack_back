//URL파라미터 추출
export const getQueryParam = (url: string, param: string): string | null => {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(param);
};

import { Request } from "express";

export function getClientIp(request: Request): string {
  const forwarded = request.headers["x-forwarded-for"] as string;

  // 1. x-forwarded-for 헤더에서 IP 추출 (프록시를 거친 경우)
  let clientIp = forwarded ? forwarded.split(",")[0].trim() : request.ip;

  // 2. IPv4-mapped IPv6 주소 처리 (IPv4 주소가 IPv6 형식으로 전달되는 경우)
  if (clientIp.startsWith("::ffff:")) {
    clientIp = clientIp.substring(7);
  }

  // 3. 기본 IP 가져오기 (IPv4 또는 IPv6)
  if (!clientIp) {
    clientIp = request.connection.remoteAddress || "";
  }

  // 4. IPv6 주소에서 인터페이스 정보를 제거 (IPv6 주소에 %가 포함된 경우)
  const ipv6Index = clientIp.indexOf("%");
  if (ipv6Index !== -1) {
    clientIp = clientIp.substring(0, ipv6Index);
  }

  return clientIp;
}
