import { isValidAddress } from '@services/EthService';
import { NetworkId } from '@types';

import { NETWORKS_CONFIG } from '.';
import { Contracts as CONTRACTS } from './contracts';

describe('Contracts JSON', () => {
  Object.keys(CONTRACTS).forEach((network) => {
    const contracts: any = (CONTRACTS as any)[network];
    const addressCollisionMap: any = {};
    const networkObj = NETWORKS_CONFIG[network as NetworkId];
    contracts.forEach((contract: any) => {
      it(`${network} - ${contract.name} contains a valid addresses`, () => {
        expect(isValidAddress(contract.address, networkObj.chainId)).toBeTruthy();
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
