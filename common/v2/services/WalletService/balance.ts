import { Wei } from 'v2/services/EthService';

export interface Balance {
  wei: Wei | null;
  isPending: boolean;
}
