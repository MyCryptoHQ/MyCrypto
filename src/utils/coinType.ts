import { DerivationPath } from '@mycrypto/wallets';

export const getCoinType = (dPath: DerivationPath) => {
  const path = dPath.path.split('/');
  return parseInt(path[2], 10);
};
