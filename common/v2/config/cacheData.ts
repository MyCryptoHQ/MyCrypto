import * as contracts from 'v2/config/contracts';
import * as tokens from 'v2/config/tokens';
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
    const nextData: [contracts.Network] = contracts.default[en];
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

export const AssetOptionsData = (): Record<string, types.AssetOption> => {
  const data: any = Object.keys(tokens.default);
  const outData = {} as Record<string, types.AssetOption>;
  data.map((en: string) => {
    const nextData: [tokens.Asset] = tokens.default[en];
    nextData.map((entry: tokens.Asset) => {
      const uuid: string = entry.symbol;
      outData[uuid] = {
        name: entry.name,
        contractAddress: entry.address,
        decimal: entry.decimal,
        network: en,
        ticker: entry.symbol,
        type: 'erc20'
      };
    });
  });
  return outData;
};
