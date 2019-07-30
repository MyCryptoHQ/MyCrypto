import * as contracts from 'v2/config/contracts';
import * as tokens from 'v2/config/tokens';

import { generateUUID } from 'v2/utils';
import { Asset, Contract } from 'v2/types';

export interface Fiat {
  code: string;
  name: string;
}

export const USD = {
  code: 'USD',
  name: 'US Dollars'
};
export const EUR = {
  code: 'EUR',
  name: 'Euros'
};
export const GBP = {
  code: 'GBP',
  name: 'British Pounds'
};

export const Fiats: Fiat[] = [USD, EUR, GBP];

export const ContractsData = (): Record<string, Contract> => {
  const data: any = Object.keys(contracts.default);
  const outData = {} as Record<string, Contract>;
  data.map((en: string) => {
    const nextData: [contracts.Network] = contracts.default[en];
    nextData.map((entry: contracts.Network) => {
      const uuid: string = generateUUID();
      outData[uuid] = {
        name: entry.name,
        address: entry.address,
        abi: entry.abi,
        networkId: en
      };
    });
  });
  return outData;
};

export const AssetsData = (): Record<string, Asset> => {
  const data: any = Object.keys(tokens.default);
  const outData = {} as Record<string, Asset>;
  data.map((en: string) => {
    const nextData: [tokens.Asset] = tokens.default[en];
    nextData.map((entry: tokens.Asset) => {
      const uuid: string = entry.symbol;
      outData[uuid] = {
        uuid: '',
        name: entry.name,
        contractAddress: entry.address,
        decimal: entry.decimal,
        networkId: en,
        ticker: entry.symbol,
        type: 'erc20'
      };
    });
  });
  return outData;
};
