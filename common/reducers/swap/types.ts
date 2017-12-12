import { Option } from 'actions/swap/actionTypes';
import { SupportedDestinationKind } from 'config/bity';

export interface SwapInput {
  id: SupportedDestinationKind;
  amount: number;
}

export interface NormalizedBityRate {
  id: number;
  options: SupportedDestinationKind[];
  rate: number;
}

export interface NormalizedBityRates {
  byId: { [id: string]: NormalizedBityRate };
  allIds: string[];
}

export interface NormalizedShapeshiftRate {
  id: number;
  options: SupportedDestinationKind[];
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
