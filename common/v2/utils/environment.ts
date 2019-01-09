export const isDevelopment = (): boolean => process.env.NODE_ENV !== 'production';
export const isDesktop = (): boolean => !!process.env.BUILD_ELECTRON;
