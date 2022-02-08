import { DEFAULT_NETWORK, DEFAULT_NETWORK_CHAINID, ETHUUID } from '@config';
import { fAssets, fRopDAI } from '@fixtures';
import { translateRaw } from '@translations';
import { TAddress, TTicker, TxType } from '@types';

import { deriveDisplayAsset, generateGenericBase, generateGenericERC20, generateGenericERC721 } from './generateAsset';


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
  test('correctly derives unknown erc20 token approval display asset', () => {
    const type = 'ERC_20_APPROVE' as TxType;
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

describe('generateGenericERC20', () => {
  it('creates a generic erc20 token from contract address and chainID', () => {
    const testGenericERC20 = {
      uuid: 'e1f698bf-cb85-5405-b563-14774af14bf1',
      name: translateRaw('GENERIC_ERC20_NAME'),
      ticker: 'Unknown ERC20' as TTicker,
      type: 'erc20',
      networkId: 'Ethereum'
    };
    const genericERC20 = generateGenericERC20(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F' as TAddress,
      '1',
      'Ethereum'
    );
    expect(genericERC20).toStrictEqual(testGenericERC20);
  });
});

describe('generateGenericBase', () => {
  it('creates a generic base asset from chainID', () => {
    const testGenericBase = {
      uuid: ETHUUID,
      name: translateRaw('GENERIC_BASE_NAME'),
      ticker: 'Unknown' as TTicker,
      type: 'base',
      networkId: 'Ethereum'
    };
    const genericBase = generateGenericBase(
      '1',
      'Ethereum'
    );
    expect(genericBase).toStrictEqual(testGenericBase);
  });
});

describe('generateGenericERC721', () => {
  it('creates a generic erc721 token from contract address and chainID', () => {
    const testGenericERC721 = {
      uuid: 'e1f698bf-cb85-5405-b563-14774af14bf1',
      name: translateRaw('GENERIC_ERC721_NAME'),
      ticker: 'Unknown NFT' as TTicker,
      type: 'erc721',
      networkId: 'Ethereum'
    };
    const genericERC721 = generateGenericERC721(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F' as TAddress,
      '1',
      'Ethereum'
    );
    expect(genericERC721).toStrictEqual(testGenericERC721);
  });
});
