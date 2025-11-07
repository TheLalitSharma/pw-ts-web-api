export type ApiError = { message: string; field?: string };
export type ApiList<T> = { data: T[]; meta?: unknown };