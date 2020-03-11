// Generic Action type
export interface TAction<T, P, E> {
  type: T;
  payload?: P;
  error?: { code: E };
}
