import { DerivationPath } from '@mycrypto/wallets';

import { TAddress } from './address';
import { NetworkId } from './networkId';
import { WalletId } from './walletId';

export interface FormData {
  network: NetworkId;
  accountType: WalletId | undefined;
  label: string;
  accountData: IAccountAdditionData[];
}

export interface IAccountAdditionData {
  address: TAddress;
  path?: DerivationPath;
  index?: number;
}
