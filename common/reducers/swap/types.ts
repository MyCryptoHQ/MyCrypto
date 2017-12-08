import { Option } from 'actions/swap/actionTypes';
import { SupportedDestinationKind } from 'config/bity';

export interface SwapInput {
  id: SupportedDestinationKind;
  amount: number;
}

export interface NormalizedBityRate {
  id: number;
  options: string[];
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
