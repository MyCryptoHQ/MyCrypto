import { generateUUID } from 'v2/utils';
import { Asset, Contract, NetworkId } from 'v2/types';

import { Contracts } from './contracts';
import { NetworkAssets, Token } from './tokens';
import { TSymbol } from 'v2/types/symbols';

export interface Fiat {
  code: string;
  name: string;
  symbol: TSymbol;
  prefix?: boolean;
}

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD',
  name: 'US Dollars',
  symbol: '$' as TSymbol,
  prefix: true
};
export const EUR = {
  code: 'EUR',
  name: 'Euros',
  symbol: '€' as TSymbol
};
export const GBP = {
  code: 'GBP',
  name: 'British Pounds',
  symbol: '£' as TSymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP };

export const ContractsData = (): Record<string, Contract> => {
  const data: any = Object.keys(Contracts);
  const outData = {} as Record<string, Contract>;
  data.map((en: string) => {
    const nextData: Contract[] = Contracts[en];
    nextData.map((entry: Contract) => {
      const uuid: string = generateUUID();
      outData[uuid] = {
        name: entry.name,
        address: entry.address,
        abi: entry.abi,
        networkId: en as NetworkId
      };
    });
  });
  return outData;
};

export const AssetsData = (): Record<string, Asset> => {
  const data: any = Object.keys(NetworkAssets);
  const outData = {} as Record<string, Asset>;
  data.map((en: string) => {
    const nextData: Token[] = NetworkAssets[en];
    nextData.map((entry: Token) => {
      const uuid: string = entry.uuid;
      outData[uuid] = {
        uuid,
        name: entry.name,
        contractAddress: entry.address,
        decimal: entry.decimal,
        networkId: en as NetworkId,
        ticker: entry.symbol,
        type: 'erc20'
      };
    });
  });
  return outData;
};
