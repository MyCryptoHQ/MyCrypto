import { indexBy, prop } from '@vendor';

export const arrayToObj = <T extends string>(key: string | T) => (arr: any[]) =>
  indexBy(prop(key), arr);
