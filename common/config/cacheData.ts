import * as contracts from 'config/contracts';
import * as utils from 'v2/libs';
import * as types from 'v2/services';

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

export const ContractsData = (): Record<string, types.ContractOptions> => {
  const data: any = Object.keys(contracts.default);
  const outData = {} as Record<string, types.ContractOptions>;
  data.map((en: string) => {
    const nextData = contracts.default[en];
    nextData.map((entry: contracts.Network) => {
      const uuid: string = utils.generateUUID();
      outData[uuid] = {
        name: entry.name,
        address: entry.address,
        abi: entry.abi,
        network: en
      };
    });
  });
  return outData;
};
