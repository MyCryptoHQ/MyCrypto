import { translateRaw } from '@translations';
import {
  Asset,
  ExtendedAsset,
  IFullTxHistoryValueTransfer,
  ITxType,
  NetworkId,
  TAddress,
  TTicker,
  TxType
} from '@types';

import { generateAssetUUID } from './generateUUID';

export const generateGenericERC20 = (
  contractAddress: TAddress,
  chainId: string,
  networkId: NetworkId
): ExtendedAsset => ({
  uuid: generateAssetUUID(chainId, contractAddress),
  name: translateRaw('GENERIC_ERC20_NAME'),
  ticker: 'Unknown ERC20' as TTicker,
  type: 'erc20',
  networkId
});

export const generateGenericERC721 = (
  contractAddress: TAddress,
  chainId: string,
  networkId: NetworkId
): ExtendedAsset => ({
  uuid: generateAssetUUID(chainId, contractAddress),
  name: translateRaw('GENERIC_ERC721_NAME'),
  ticker: 'Unknown NFT' as TTicker,
  type: 'erc721',
  networkId
});

export const generateGenericBase = (chainId: string, networkId: NetworkId): ExtendedAsset => ({
  uuid: generateAssetUUID(chainId),
  name: translateRaw('GENERIC_BASE_NAME'),
  ticker: 'Unknown' as TTicker,
  type: 'base',
  networkId
});

export const deriveDisplayAsset = (
  txType: TxType,
  to: TAddress,
  networkId: NetworkId,
  chainId: number,
  valueTransfers: IFullTxHistoryValueTransfer[],
  getAssetByContractAndNetworkId: (
    contractAddr: TAddress,
    networkId: NetworkId
  ) => ExtendedAsset | undefined
): Asset | undefined => {
  switch (txType) {
    default:
      if (valueTransfers.length === 1) {
        return valueTransfers[0].asset;
      }
      return undefined;
    case 'ERC_20_APPROVE':
    case 'ERC_20_TRANSFER':
    case ITxType.APPROVAL:
      return (
        getAssetByContractAndNetworkId(to, networkId) ??
        generateGenericERC20(to, chainId.toString(), networkId)
      );
    case 'ERC_721_APPROVE':
    case 'ERC_721_TRANSFER':
    case 'ERC_721_MINT':
      return generateGenericERC721(to, chainId.toString(), networkId);
  }
};
