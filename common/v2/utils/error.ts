import { IS_DEV } from './environment';

export const logError = (name: string, error: Error): void => {
  if (IS_DEV) {
    console.error(name, error);
  }
};
