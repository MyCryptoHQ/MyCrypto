export const toObject = <T extends TObject>(key: string | number) => (
  arr: Array<T>
): Record<string | number, T> =>
  arr.reduce((acc, curr) => ({ ...acc, [curr[key] as string | number]: curr }), {});
