export const randomElementFromArray = <T>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];
