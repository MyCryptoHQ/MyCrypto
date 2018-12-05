import { isDevelopment } from './environment';

export const logError = (name: string, error: Error): void => {
  if (isDevelopment()) {
    console.error(name, error);
  }
};
