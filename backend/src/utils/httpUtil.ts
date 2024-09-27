//URL파라미터 추출
export const getQueryParam = (url: string, param: string): string | null => {
  const urlParams = new URLSearchParams(url);
  return urlParams.get(param);
};

//일관된 형식의 응답
export const createApiResponse = (
  success: boolean,
  data: any,
  message: string = ""
): any => {
  return {
    success,
    message,
    data,
  };
};
