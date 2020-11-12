import { ValuesType } from 'utility-types';

export const toArray = <T>(object: T): ValuesType<T>[] => Object.values(object);
