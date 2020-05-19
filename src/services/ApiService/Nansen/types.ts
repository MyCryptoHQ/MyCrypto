import { TAddress } from '@types';

export interface NansenServiceResponse {
  page?: NansenServiceEntry[];
}

export interface NansenServiceEntry {
  address: TAddress;
  label: string[];
}
