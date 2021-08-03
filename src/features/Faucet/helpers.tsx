import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from '@ethersproject/units';

import { getBaseAssetByNetwork } from '@services/Store';
import {
  Asset,
  ExtendedAsset,
  ExtendedContact,
  ITxConfig,
  ITxNonce,
  ITxReceipt,
  ITxStatus,
  ITxType,
  ITxValue,
  Network,
  NetworkId,
  StoreAccount,
  TAddress
} from '@types';

import { ITxFaucetResult } from './types';

export const possibleSolution = (solution: string) => {
  return /^[a-zA-Z0-9]{4}$/.test(solution);
};

const getNetworkByLowercaseId = (id: string, networks: Network[] = []): Network => {
  const capitalizedNetworkId = (id.charAt(0).toUpperCase() + id.slice(1)) as NetworkId;
  return networks.find((network: Network) => network.id === capitalizedNetworkId) as Network;
};

export const makeTxConfig = (
  txResult: ITxFaucetResult,
  networks: Network[],
  assets: ExtendedAsset[],
  getContactByAddressAndNetworkId: (
    address: TAddress,
    networkId: NetworkId
  ) => ExtendedContact | undefined
): ITxConfig => {
  const network = getNetworkByLowercaseId(txResult.network, networks);
  const baseAsset: Asset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  // Guaranteed to work as Faucet address is in STATIC_CONTACTS
  const senderContact = getContactByAddressAndNetworkId(txResult.from, network.id)!;

  /*
   * ITxConfig.senderAccount uses type StoreAccount, but in this case the user is the recipient and the faucet is the sender.
   * getContactByAddressAndNetworkId() returns ExtendedContact, which is the closest we can get.
   * The result is casted to make it compatible with ITxConfig.
   */
  return {
    rawTransaction: {
      to: txResult.to,
      value: txResult.value as ITxValue,
      gasLimit: txResult.gasLimit,
      data: txResult.data,
      gasPrice: txResult.gasPrice,
      nonce: txResult.nonce.toString() as ITxNonce,
      chainId: txResult.chainId,
      from: txResult.from
    },
    amount: formatEther(txResult.value),
    receiverAddress: txResult.to,
    senderAccount: (senderContact as unknown) as StoreAccount,
    from: txResult.from,
    asset: baseAsset,
    baseAsset,
    networkId: network.id
  };
};

export const makeTxReceipt = (
  txResult: ITxFaucetResult,
  networks: Network[],
  assets: ExtendedAsset[]
): ITxReceipt => {
  const network = getNetworkByLowercaseId(txResult.network, networks);
  const baseAsset: Asset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  return {
    asset: baseAsset,
    baseAsset,
    txType: ITxType.FAUCET,
    status: ITxStatus.PENDING,
    receiverAddress: txResult.to,
    amount: formatEther(txResult.value),
    data: txResult.data,
    gasPrice: BigNumber.from(txResult.gasPrice),
    gasLimit: BigNumber.from(txResult.gasLimit),
    to: txResult.to,
    from: txResult.from,
    value: BigNumber.from(txResult.value),
    nonce: BigNumber.from(txResult.nonce),
    hash: txResult.hash
  };
};
