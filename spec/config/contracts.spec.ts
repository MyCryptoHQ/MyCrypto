import CONTRACTS from 'config/contracts';
import { isValidETHAddress } from 'libs/validators';

describe('Contracts JSON', () => {
  Object.keys(CONTRACTS).forEach(network => {
    it(`${network} contracts array properly formatted`, () => {
      const contracts = CONTRACTS[network];
      const addressCollisionMap = {};

      contracts.forEach(contract => {
        if (contract.address && !isValidETHAddress(contract.address)) {
          throw Error(`Contract '${contract.name}' has invalid address '${contract.address}'`);
        }
        if (addressCollisionMap[contract.address]) {
          throw Error(
            `Contract '${contract.name}' has the same address as ${
              addressCollisionMap[contract.address]
            }`
          );
        }

        try {
          JSON.stringify(contract.abi);
        } catch (err) {
          throw Error(`Contract '${contract.name}' has invalid JSON ABI`);
        }

        addressCollisionMap[contract.address] = contract.name;
      });
    });
  });
});
