import approval from '@assets/images/transactions/approval.svg';
import contractDeploy from '@assets/images/transactions/contract-deploy.svg';
import contractInteract from '@assets/images/transactions/contract-interact.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import membershipPurchase from '@assets/images/transactions/membership-purchase.svg';
import outbound from '@assets/images/transactions/outbound.svg';
import swap from '@assets/images/transactions/swap.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import { DEFAULT_NETWORK, DEFAULT_NETWORK_CHAINID } from '@config';
import { generateGenericERC20, generateGenericERC721 } from '@features/SendAssets';
import { fAssets, fRopDAI } from '@fixtures';
import { translateRaw } from '@translations';
import { TAddress, TxType } from '@types';

import { constructTxTypeConfig, deriveDisplayAsset } from './helpers';

describe('constructTxTypeConfig', () => {
  const assetTxTypeDesignation = fAssets[0].ticker
  const testCases = [
    {
      inputType: 'GENERIC_CONTRACT_CALL',
      inputProtocol: '',
      outputLabel: translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT', {
        $ticker: assetTxTypeDesignation
      }),
      outputIcon: contractInteract
    },{
      inputType: 'EXCHANGE',
      inputProtocol: 'UNISWAP_V1',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('UNISWAP_V1', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_EXCHANGE`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: swap
    },{
      inputType: 'DEPOSIT',
      inputProtocol: 'UNISWAP_V1',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('UNISWAP_V1', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_DEPOSIT`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: contractInteract
    },{
      inputType: 'WITHDRAW',
      inputProtocol: 'UNISWAP_V1',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('UNISWAP_V1', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_WITHDRAW`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: contractInteract
    },{
      inputType: 'CLAIM',
      inputProtocol: 'ENS',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('ENS', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_CLAIM`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: inbound
    },{
      inputType: 'NAME_REGISTERED',
      inputProtocol: 'ENS',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('ENS', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_NAME_REGISTERED`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: inbound
    },{
      inputType: 'OUTBOUND',
      inputProtocol: '',
      outputLabel: translateRaw('RECENT_TX_LIST_LABEL_SENT', {
        $ticker: assetTxTypeDesignation
      }),
      outputIcon: outbound
    },{
      inputType: 'CONTRACT_DEPLOY',
      inputProtocol: '',
      outputLabel: translateRaw(`PLATFORM_CONTRACT_DEPLOY`, { $ticker: assetTxTypeDesignation }),
      outputIcon: contractDeploy
    },{
      inputType: 'APPROVE',
      inputProtocol: 'ERC_20',
      outputLabel: translateRaw('RECENT_TX_LIST_PLATFORM_INTERACTION', {
        $platform: translateRaw('ERC_20', { $ticker: assetTxTypeDesignation }),
        $action: translateRaw(`PLATFORM_APPROVE`, { $ticker: assetTxTypeDesignation })
      }),
      outputIcon: approval
    },{
      inputType: 'TRANSFER',
      inputProtocol: 'ERC_20',
      outputLabel: translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
        $ticker: assetTxTypeDesignation
      }),
      outputIcon: transfer
    },{
      inputType: 'PURCHASE_MEMBERSHIP',
      inputProtocol: '',
      outputLabel: translateRaw('PLATFORM_MEMBERSHIP_PURCHASED'),
      outputIcon: membershipPurchase
    }
  ]
  
  testCases.forEach((testCase) => {
    test(`correctly handles action to determine derived tx label for txType ${testCase.inputType}_${testCase.inputProtocol}`, () => {
      const result = constructTxTypeConfig({ type: testCase.inputType, protocol: testCase.inputProtocol });
      expect(result.label(fAssets[0].ticker)).toBe(testCase.outputLabel);
    });
  
    test(`correctly handles action to determine icon type for txType ${testCase.inputType}_${testCase.inputProtocol}`, () => {
      const result = constructTxTypeConfig({ type: testCase.inputType, protocol: testCase.inputProtocol });
      expect(result.icon()).toBe(testCase.outputIcon);
    });
  })
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