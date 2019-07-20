import * as contracts from 'config/contracts';
import { Contract } from 'v2/types';
import { generateUUID } from 'v2/utils';

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
    const nextData = contracts.default[en];
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
