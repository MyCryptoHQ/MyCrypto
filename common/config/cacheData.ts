import * as contracts from 'config/contracts';
import * as utils from 'v2/libs';

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

export interface Contract {
  name: string;
  network: string;
  address: string;
  abi: string;
}

export const ContractsData = (): any => {
  const data: any = Object.keys(contracts.default);
  const outData = {} as Record<string, Contract>;
  data.map((en: string) => {
    const nextData = contracts.default[en];
    nextData.map((entry: contracts.Network) => {
      //const newData = {} as Contract;
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
