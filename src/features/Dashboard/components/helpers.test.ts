import swap from '@assets/images/transactions/swap.svg';
import { DEFAULT_NETWORK, DEFAULT_NETWORK_CHAINID } from '@config';
import { generateGenericERC20, generateGenericERC721 } from '@features/SendAssets';
import { fAssets, fRopDAI } from '@fixtures';
import { translateRaw } from '@translations';
import { TAddress, TxType } from '@types';

import { constructTxTypeConfig, deriveDisplayAsset } from './helpers';

describe('constructTxTypeConfig', () => {
  test('correctly handles action type to determine label', () => {
    const type = 'GENERIC_CONTRACT_CALL';
    const protocol = '';
    const result = constructTxTypeConfig({ type, protocol });
    const expectedLabel = translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT', {
      $ticker: fAssets[0].ticker
    });
    expect(result.label(fAssets[0].ticker)).toEqual(expectedLabel);
  });
  test('correctly handles action to determine derived tx label', () => {
    const type = 'EXCHANGE';
    const protocol = 'UNISWAP_V1';
    const result = constructTxTypeConfig({ type, protocol });
    const expectedLabel = 'Uniswap v1: Assets Swapped';
    expect(result.label(fAssets[0].ticker)).toBe(expectedLabel);
  });

  test('correctly handles action to determine icon type', () => {
    const type = 'EXCHANGE';
    const protocol = 'UNISWAP_V1';
    const result = constructTxTypeConfig({ type, protocol });
    expect(result.icon()).toBe(swap);
  });
});

describe('deriveDisplayAsset', () => {
  const testNetworkId = DEFAULT_NETWORK
  const testChainId = DEFAULT_NETWORK_CHAINID
  const testToAddr = '0x00000000000000000000000000000000' as TAddress;

  const unknownERC20Asset = generateGenericERC20(testToAddr, testChainId.toString(), testNetworkId)
  const unknownERC721Asset = generateGenericERC721(testToAddr, testChainId.toString(), testNetworkId)
  const mockGetAssetReturnsERC20 = () => fRopDAI
  const mockGetAssetReturnsERC721 = () => unknownERC721Asset
  const mockGetAssetReturnsBase = () => fAssets[1]
  const mockGetAssetReturnsUndefined = () => undefined

  


  test('correctly derives known erc20 token transfer display asset', () => {
    const type = 'ERC_20_TRANSFER' as TxType;
    const result = deriveDisplayAsset(type, testToAddr, testNetworkId, testChainId, [], mockGetAssetReturnsERC20);
    expect(result).toEqual(fRopDAI);
  });
  test('correctly derives unknown erc20 token transfer display asset', () => {
    const type = 'ERC_20_TRANSFER' as TxType;
    const result = deriveDisplayAsset(type, testToAddr, testNetworkId, testChainId, [], mockGetAssetReturnsUndefined);
    expect(result).toEqual(unknownERC20Asset);
  });
  test('correctly derives undefined display asset', () => {
    const type = 'STANDARD' as TxType;
    const result = deriveDisplayAsset(type, testToAddr, testNetworkId, testChainId, [], mockGetAssetReturnsUndefined);
    expect(result).toBeUndefined();
  });
  test('correctly derives base display asset', () => {
    const type = 'STANDARD' as TxType;
    const result = deriveDisplayAsset(type, testToAddr, testNetworkId, testChainId, [{ to: testToAddr, from: testToAddr, asset: fAssets[1], amount: '1' }], mockGetAssetReturnsBase);
    expect(result).toEqual(fAssets[1]);
  });
  test('correctly derives erc721 display asset', () => {
    const type = 'ERC_721_APPROVE' as TxType;
    const result = deriveDisplayAsset(type, testToAddr, testNetworkId, testChainId, [], mockGetAssetReturnsERC721);
    expect(result).toEqual(unknownERC721Asset);
  });
});