export const IS_DEV: boolean = process.env.NODE_ENV === 'development' || process.env.BUILD_ENV === 'development';

export const hasWeb3Provider = (): boolean => window && ('web3' in window || 'ethereum' in window);
