import { WalletId } from './walletId';
import { NetworkId } from './networkId';
import { TAddress } from './address';

export interface FormData {
  network: NetworkId;
  accountType: WalletId | undefined;
  label: string;
  accountData: IAccountAdditionData[];
}

export interface IAccountAdditionData {
  address: TAddress;
  dPath: string;
}
