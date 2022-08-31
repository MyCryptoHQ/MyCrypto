import { ResolutionError, ResolutionErrorCode } from '@unstoppabledomains/resolution';

export const isResolutionError = (err: Error & { code?: ResolutionErrorCode }) => {
  return err && err.code && Object.values(ResolutionErrorCode).includes(err.code);
};

// Create ENS resolution error from Ethers error
export const createENSResolutionError = (err: Error) => {
  if (err.message.includes('network does not support ENS')) {
    return new ResolutionError(ResolutionErrorCode.UnsupportedCurrency, {
      currencyTicker: 'Network'
    });
  }

  return null;
};
