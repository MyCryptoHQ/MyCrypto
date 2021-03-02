import { FallbackProvider } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';

import { fNetworks, fRopDAI } from '@fixtures';
import { ProviderHandler } from '@services/EthService';
import { NetworkId, TAddress } from '@types';
import { bigify } from '@utils';

import {
  BalanceMap,
  getBaseAssetBalancesForAddresses,
  getSingleTokenBalanceForAddresses,
  getTokenBalancesForAddresses
} from './BalanceService';

jest.mock('@mycrypto/eth-scan', () => ({
  ...jest.requireActual('@mycrypto/eth-scan'),
  getEtherBalances: jest.fn().mockImplementation(async () => ({
    '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': BigInt('1000000000000000000')
  })),
  getTokensBalances: jest.fn().mockImplementation(async () => ({
    '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
      '0xad6d458402f60fd3bd25163575031acdce07538d': BigInt('1000000000000000000')
    }
  })),
  getTokenBalances: jest.fn().mockImplementation(async () => ({
    '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': BigInt('1000000000000000000')
  }))
}));
ProviderHandler.prototype.getRawTokenBalance = jest.fn().mockResolvedValue('150');
ProviderHandler.prototype.getTokenBalance = jest.fn().mockResolvedValue('150');
ProviderHandler.prototype.getRawBalance = jest.fn().mockResolvedValue('150');
ProviderHandler.fetchProvider = jest.fn().mockResolvedValue({} as FallbackProvider);

const RopstenNoEthScanNetworkId = 'ROPSTEN_NO_ETHSCAN' as NetworkId;

describe('getBaseAssetBalancesForAddresses', () => {
  it('gets result for getBaseAssetBalancesForAddresses with one address on an ethscan network', async () => {
    const balances = await getBaseAssetBalancesForAddresses(
      ['0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c'],
      fNetworks[1]
    );
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': bigify('1000000000000000000')
    } as BalanceMap<BigNumber>;
    expect(balances).toStrictEqual(expected);
  });
  it('gets result for getBaseAssetBalancesForAddresses with one address on a non-ethscan network', async () => {
    const balances = await getBaseAssetBalancesForAddresses(
      ['0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress],
      { ...fNetworks[1], id: RopstenNoEthScanNetworkId }
    );
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': bigify('150')
    } as BalanceMap<BigNumber>;
    expect(balances).toStrictEqual(expected);
  });
});

describe('getTokenBalancesForAddresses', () => {
  it('gets result for getTokenBalancesForAddresses with one address on an ethscan network', async () => {
    const balances = await getTokenBalancesForAddresses([fRopDAI], fNetworks[1], [
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress
    ]);
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
        [fRopDAI.contractAddress as string]: bigify('1000000000000000000')
      }
    } as BalanceMap<BalanceMap<BigNumber>>;
    expect(balances).toStrictEqual(expected);
  });

  it('gets result for getTokenBalancesForAddresses with one address on a non-ethscan network', async () => {
    const balances = await getTokenBalancesForAddresses(
      [{ ...fRopDAI, networkId: RopstenNoEthScanNetworkId }],
      { ...fNetworks[1], id: RopstenNoEthScanNetworkId as NetworkId },
      ['0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress]
    );
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': {
        [fRopDAI.contractAddress as string]: bigify('150')
      }
    } as BalanceMap<BalanceMap<BigNumber>>;
    expect(balances).toStrictEqual(expected);
  });
});

describe('getSingleTokenBalanceForAddresses', () => {
  it('gets result for getSingleTokenBalanceForAddresses with one address on an ethscan network', async () => {
    const balances = await getSingleTokenBalanceForAddresses(fRopDAI, fNetworks[1], [
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress
    ]);
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': bigify('1000000000000000000')
    } as BalanceMap<BigNumber>;
    expect(balances).toStrictEqual(expected);
  });

  it('gets result for getSingleTokenBalanceForAddresses with one address on a non-ethscan network', async () => {
    const balances = await getSingleTokenBalanceForAddresses(
      { ...fRopDAI, networkId: RopstenNoEthScanNetworkId },
      { ...fNetworks[1], id: RopstenNoEthScanNetworkId as NetworkId },
      ['0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress]
    );
    const expected = {
      '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c': bigify('150')
    } as BalanceMap<BigNumber>;
    expect(balances).toStrictEqual(expected);
  });
});
