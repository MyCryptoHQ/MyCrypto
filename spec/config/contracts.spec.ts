import { Contracts as CONTRACTS } from 'v2/config/contracts';
import { isValidETHAddress } from 'v2/services/EthService';

describe('Contracts have a valid Address', () => {
  Object.keys(CONTRACTS).forEach(network => {
    const contracts: any = (CONTRACTS as any)[network];
    const addressCollisionMap: any = {};

    contracts.forEach((contract: any) => {
      it(`${network} - ${contract.name} contains a valid addresses`, () => {
        expect(isValidETHAddress(contract.address)).toBeTruthy();
      });

      it(`${network} - ${contract.name} address have no collusions`, () => {
        expect(addressCollisionMap[contract.address]).toBeUndefined();
        addressCollisionMap[contract.address] = contract.name;
      });

      it(`${network} - ${contract.name} has a vaild abi`, () => {
        const parseJson = () => JSON.stringify(contract.abi);
        expect(parseJson).not.toThrow();
      });
    });
  });
});
