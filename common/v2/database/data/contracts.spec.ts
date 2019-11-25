import { isValidETHAddress } from 'v2/services/EthService';
import { Contracts as CONTRACTS } from './contracts';

describe('Contracts JSON', () => {
  Object.keys(CONTRACTS).forEach(network => {
    const contracts: any = (CONTRACTS as any)[network];
    const addressCollisionMap: any = {};

    contracts.forEach((contract: any) => {
      it(`${network} - ${contract.name} contains a valid addresses`, () => {
        // Mist's multisig is a factory-generated standard contract,
        // so it's okay that it doesn't have an address.
        // the user inputs it to interact with their mist multisig
        if (contract.name === "Mist's Multisig Contract") return;
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
