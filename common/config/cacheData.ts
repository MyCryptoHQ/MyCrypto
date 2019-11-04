import { generateUUID } from 'utils';
import { Asset, IContract, NetworkId } from 'typeFiles';

import { Contracts } from './contracts';
import { NetworkAssets, Token } from './tokens';
import { TSymbol } from 'typeFiles/symbols';

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

export const ContractsData = (): Record<string, IContract> => {
  const data: any = Object.keys(Contracts);
  const outData = {} as Record<string, IContract>;
  data.map((en: string) => {
    const nextData: IContract[] = Contracts[en];
    nextData.map((entry: IContract) => {
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
      const uuid: string = entry.symbol;
      outData[uuid] = {
        uuid: '',
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
