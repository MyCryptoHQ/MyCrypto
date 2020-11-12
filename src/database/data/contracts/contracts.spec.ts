import { Contract, NetworkId } from '@types';
import { mapObjIndexed } from '@vendor';

import { flattenContracts } from '.';
import ETC from './etc.json';
import Rinkeby from './rinkeby.json';
// import Ropsten from './ropsten.json';

describe('Data/Contracts', () => {
  it('flattenContracts(): converts a { NetworkId: Contract[] } object to { uuid: Contract }', () => {
    const contractsByNetwork = { ETC, Rinkeby } as Record<Partial<NetworkId>, Contract[]>;
    const received = flattenContracts(contractsByNetwork);
    const withoutAbi = mapObjIndexed(({ abi, ...a }) => a, received); // We remove the abi to simplify the assertion.

    expect(withoutAbi).toMatchObject(
      expect.objectContaining({
        '0e5f378d-625f-5bb5-992b-b6d7d60858af': {
          address: '0x0101010101010101010101010101010101010101',
          isCustom: false,
          name: "Mist's Multisig Contract",
          networkId: 'ETC',
          uuid: '0e5f378d-625f-5bb5-992b-b6d7d60858af'
        },
        '699f5e11-fdfd-5483-94fe-104d1d59d281': {
          address: '0xe7410170f87102df0055eb195163a03b7f2bff4a',
          isCustom: false,
          name: 'ENS - Registry',
          networkId: 'Rinkeby',
          uuid: '699f5e11-fdfd-5483-94fe-104d1d59d281'
        },
        'c0432533-f4ac-5459-bc86-06982d9e665e': {
          address: '0x21397c1a1f4acd9132fe36df011610564b87e24b',
          isCustom: false,
          name: 'ENS - Eth Registrar (Auction)',
          networkId: 'Rinkeby',
          uuid: 'c0432533-f4ac-5459-bc86-06982d9e665e'
        },
        'c9e4c2a2-4d24-5187-9c8c-9bf5e1d7a3a4': {
          address: '0x180826b05452ce96e157f0708c43381fee64a6b8',
          isCustom: false,
          name: 'DAO Classic Withdraw',
          networkId: 'ETC',
          uuid: 'c9e4c2a2-4d24-5187-9c8c-9bf5e1d7a3a4'
        },
        'e7be0236-b57f-586c-99d0-6289aa505cec': {
          address: '0x93123bA3781bc066e076D249479eEF760970aa32',
          isCustom: false,
          name: 'P3C Farm Contract',
          networkId: 'ETC',
          uuid: 'e7be0236-b57f-586c-99d0-6289aa505cec'
        },
        'ee08ddc5-a599-5475-b4e0-b6aa81ff977c': {
          address: '0x085fb4f24031eaedbc2b611aa528f22343eb52db',
          isCustom: false,
          name: 'BitEther',
          networkId: 'ETC',
          uuid: 'ee08ddc5-a599-5475-b4e0-b6aa81ff977c'
        }
      })
    );
  });
});
