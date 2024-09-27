export type Result<T, E> =
  | { isSuccess: true; value: T }
  | { isSuccess: false; error: E };

/* 
// 사용 예시
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)); // 3
console.log(curriedAdd(1, 2)); // 3
*/

export const curry = (fn: Function) => {
  return (...args: any[]) =>
    args.length >= fn.length
      ? fn(...args)
      : (...more: any[]) => curry(fn)(...args, ...more);
};

/* 
// 사용 예시
const add1 = (x: number) => x + 1;
const mul2 = (x: number) => x * 2;

const process = pipe(add1, mul2);
console.log(process(5)); // 12 (5 + 1) * 2
*/

export const pipe =
  (...fns: Function[]) =>
  (value: any) =>
    fns.reduce((acc, fn) => fn(acc), value);

/* 
// 사용 예시
const add1 = (x: number) => x + 1;
const mul2 = (x: number) => x * 2;

const process = compose(mul2, add1);
console.log(process(5)); // 12 (5 + 1) * 2
*/

export const compose =
  (...fns: Function[]) =>
  (value: any) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

/* 
// 사용 예시
const numbers = [1, 2, 3];
const double = map((x: number) => x * 2);
console.log(double(numbers)); // [2, 4, 6]
*/

export const map =
  <T, U>(fn: (value: T, index: number, array: T[]) => U) =>
  (arr: T[]): U[] =>
    arr.map(fn);

/* 
// 사용 예시
const numbers = [1, 2, 3, 4, 5];
const isEven = filter((x: number) => x % 2 === 0);
console.log(isEven(numbers)); // [2, 4]
*/

export const filter =
  <T>(fn: (value: T, index: number, array: T[]) => boolean) =>
  (arr: T[]): T[] =>
    arr.filter(fn);

/* 
// 사용 예시
const numbers = [1, 2, 3, 4, 5];
const sum = reduce((acc: number, value: number) => acc + value, 0);
console.log(sum(numbers)); // 15
*/

export const reduce =
  <T, U>(
    fn: (acc: U, value: T, index: number, array: T[]) => U,
    initialValue: U
  ) =>
  (arr: T[]): U =>
    arr.reduce(fn, initialValue);

/* 
// 사용 예시
const slowFunction = (num: number) => {
  console.log('Computing...');
  return num * 2;
};

const memoizedFunction = memoize(slowFunction);
console.log(memoizedFunction(5)); // 'Computing...' 출력 후 10
console.log(memoizedFunction(5)); // 10 (캐시 사용)
*/

export const memoize = (fn: Function) => {
  const cache = new Map();
  return (...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/* 
// 사용 예시
const numbers = [1, 2, 3, 4, 5, 6];
const [evens, odds] = partition(numbers, (x) => x % 2 === 0);
console.log(evens); // [2, 4, 6]
console.log(odds);  // [1, 3, 5]
*/

export const partition = <T>(
  arr: T[],
  fn: (value: T) => boolean
): [T[], T[]] => {
  return arr.reduce(
    ([pass, fail], elem) => {
      return fn(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []] as [T[], T[]]
  );
};

/* 
// 사용 예시
const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
const names = pluck(users, 'name');
console.log(names); // ['John', 'Jane']
*/

export const pluck = <T, K extends keyof T>(arr: T[], key: K): T[K][] => {
  return arr.map((item) => item[key]);
};

/* 
// 사용 예시
const logValue = tap((x: number) => console.log(`Logging: ${x}`));
console.log(logValue(5)); // 'Logging: 5' 출력 후 5 반환
*/

export const tap =
  <T>(fn: (value: T) => void) =>
  (value: T): T => {
    fn(value);
    return value;
  };

/* 
// 사용 예시
const fetchData = async () => {
  if (Math.random() > 0.5) throw new Error('Failed');
  return 'Success';
};

retry(fetchData, 3)
  .then((result) => console.log(result)) // 'Success' 출력
  .catch((err) => console.log(err.message)); // 'Failed' 출력
*/

export const retry = (fn: () => Promise<any>, retries: number) => {
  return fn().catch((err) => {
    if (retries > 0) {
      return retry(fn, retries - 1);
    } else {
      throw err;
    }
  });
};

/* 
// 사용 예시
const fetchDataWithDelay = async () => {
  await delay(1000);
  return 'Data after delay';
};

fetchDataWithDelay().then(console.log); // 1초 후 'Data after delay' 출력
*/

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* 
// 사용 예시
const data = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'vegetable', name: 'carrot' },
];

const groupedData = groupBy(data, (item) => item.category);
console.log(groupedData);
// {
//   fruit: [{ category: 'fruit', name: 'apple' }, { category: 'fruit', name: 'banana' }],
//   vegetable: [{ category: 'vegetable', name: 'carrot' }]
// }
*/

export const groupBy = <T, K extends keyof any>(
  arr: T[],
  key: (item: T) => K
): Record<K, T[]> =>
  arr.reduce(
    (acc, item) => {
      const groupKey = key(item);
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );

/* 
// 사용 예시
const fetchData1 = async (value: number) => {
  await delay(100);
  return value + 1;
};

const fetchData2 = async (value: number) => {
  await delay(100);
  return value * 2;
};

pipeAsync(fetchData1, fetchData2)(5).then(console.log); // 12 (5 + 1) * 2
*/

export const pipeAsync =
  (...fns: Array<(value: any) => Promise<any>>) =>
  (value: any) =>
    fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));

/* 
// 사용 예시
const fetchData1 = async (value: number) => {
  await delay(100);
  return value + 1;
};

const fetchData2 = async (value: number) => {
  await delay(100);
  return value * 2;
};

composeAsync(fetchData2, fetchData1)(5).then(console.log); // 12 (5 + 1) * 2
*/

export const composeAsync =
  (...fns: Array<(value: any) => Promise<any>>) =>
  (value: any) =>
    fns.reduceRight((acc, fn) => acc.then(fn), Promise.resolve(value));

export const success = <T>(value: T): Result<T, never> => {
  return { isSuccess: true, value };
};

export const failure = <E>(error: E): Result<never, E> => {
  return { isSuccess: false, error };
};
