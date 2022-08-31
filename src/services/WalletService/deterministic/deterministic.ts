import { TokenValue } from '@utils';

export interface HDWalletData {
  index: number;
  address: string;
  value?: TokenValue;
}
