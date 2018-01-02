import { Option } from 'actions/swap/actionTypes';
import { WhitelistedCoins } from 'config/bity';

export interface SwapInput {
  id: WhitelistedCoins;
  amount: number | string;
}

export interface NormalizedRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
}

export interface NormalizedRates {
  byId: { [id: string]: NormalizedRate };
  allIds: string[];
}

export interface NormalizedBityRate extends NormalizedRate {
  id: number;
  options: WhitelistedCoins[];
  rate: number;
}

export interface NormalizedBityRates {
  byId: { [id: string]: NormalizedBityRate };
  allIds: string[];
}

export interface NormalizedShapeshiftRate extends NormalizedRate {
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
