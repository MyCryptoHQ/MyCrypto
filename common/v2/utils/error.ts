export const logError = (name: string, error: Error): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(name, error);
  }
};
