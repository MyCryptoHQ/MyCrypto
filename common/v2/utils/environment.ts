export const isDevelopment = (): boolean => process.env.NODE_ENV !== 'production';

export const isEndToEndTest = (): boolean => !!(window as any).Cypress;
