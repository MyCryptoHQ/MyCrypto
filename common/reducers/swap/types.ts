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

export interface NormalizedShapeshiftRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
  limit: number;
  min: number;
}

export interface NormalizedShapeshiftRates {
  byId: { [id: string]: NormalizedShapeshiftRate };
  allIds: string[];
}

export interface NormalizedOptions {
  byId: { [id: string]: Option };
  allIds: string[];
}
