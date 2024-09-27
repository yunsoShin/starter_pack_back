export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const sortObjectKeys = (
  obj: Record<string, any>
): Record<string, any> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key: string) => {
      result[key] = obj[key];
      return result;
    }, {});
};

export const isNullOrUndefined = (value: any): boolean => {
  return value === null || value === undefined;
};
