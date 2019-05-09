import { getCache } from 'v2/services/LocalCache';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { getAccountByAddress } from 'v2/libs/accounts';
import { Account } from 'v2/services/Account/types';

export const getAllNetworks = () => {
  return Object.values(getCache().networkOptions);
};

export const getNetworkByAddress = (address: string): NetworkOptions | undefined => {
  const account: Account | undefined = getAccountByAddress(address);
  if (!account) {
    return undefined;
  } else {
    const networks = getAllNetworks();
    return networks.find(network => account.network === network.name);
  }
};
