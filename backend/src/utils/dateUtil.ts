import { format } from "date-fns";
import { differenceInDays } from "date-fns";

//현재 날짜 포맷팅
export const formatDate = (
  date: Date = new Date(),
  dateFormat: string = "yyyy-MM-dd HH:mm:ss"
): string => {
  return format(date, dateFormat);
};

export const calculateDateDifference = (date1: Date, date2: Date): number => {
  return differenceInDays(date1, date2);
};
