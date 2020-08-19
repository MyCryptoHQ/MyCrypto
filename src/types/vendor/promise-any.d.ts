declare module '@ungap/promise-any' {
  export default function any<T>(
    values: (T | PromiseLike<T>)[] | Iterable<T | PromiseLike<T>>
  ): Promise<T>;
}
