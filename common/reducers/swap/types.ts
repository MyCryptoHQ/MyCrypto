import { Option } from 'actions/swap/actionTypes';
import { WhitelistedCoins } from 'config/bity';

export interface SwapInput {
  id: WhitelistedCoins;
  amount: number;
}

export interface NormalizedBityRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
}

export interface NormalizedBityRates {
  byId: { [id: string]: NormalizedBityRate };
  allIds: string[];
}

export interface NormalizedOptions {
  byId: { [id: string]: Option };
  allIds: string[];
}
