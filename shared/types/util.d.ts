export type DeepPartial<T> = Partial<{ [key in keyof T]: Partial<T[key]> }>;
