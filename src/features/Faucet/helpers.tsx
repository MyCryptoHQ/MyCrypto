import { bigNumberify, formatEther } from 'ethers/utils';

import { getBaseAssetByNetwork } from '@services';
import {
  Asset,
  Contact,
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

const getFaucetContact = (
  txResult: ITxFaucetResult,
  networks: Network[],
  getContactByAddressAndNetworkId: (
    address: TAddress,
    networkId: NetworkId
  ) => ExtendedContact | undefined,
  createContact: (item: Contact) => void
): ExtendedContact => {
  const network = getNetworkByLowercaseId(txResult.network, networks);
  const existingContact = getContactByAddressAndNetworkId(txResult.from, network.id);

  if (existingContact) {
    return existingContact;
  } else {
    createContact({
      address: txResult.from,
      label: 'MyCrypto Faucet',
      network: network.id,
      notes: ''
    });

    const newContact: ExtendedContact = getContactByAddressAndNetworkId(txResult.from, network.id)!;
    return newContact;
  }
};

export const makeTxConfig = (
  txResult: ITxFaucetResult,
  networks: Network[],
  assets: ExtendedAsset[],
  getContactByAddressAndNetworkId: (
    address: TAddress,
    networkId: NetworkId
  ) => ExtendedContact | undefined,
  createContact: (item: Contact) => void
): ITxConfig => {
  const network = getNetworkByLowercaseId(txResult.network, networks);
  const baseAsset: Asset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  /*
   * ITxConfig.senderAccount uses type StoreAccount, but in this case the user is the recipient and the faucet is the sender.
   * getFaucetContact() returns ExtendedContact, which is the closest we can get.
   * The result is casted to `any` to make it compatible with ITxConfig.
   */
  const senderContact: any = getFaucetContact(
    txResult,
    networks,
    getContactByAddressAndNetworkId,
    createContact
  );

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
    senderAccount: senderContact,
    from: txResult.from,
    asset: baseAsset,
    baseAsset,
    network,
    gasPrice: txResult.gasPrice,
    gasLimit: txResult.gasLimit,
    nonce: txResult.nonce.toString() as ITxNonce,
    data: txResult.data,
    value: txResult.value
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
    gasPrice: bigNumberify(txResult.gasPrice),
    gasLimit: bigNumberify(txResult.gasLimit),
    to: txResult.to,
    from: txResult.from,
    value: bigNumberify(txResult.value),
    nonce: txResult.nonce.toString(),
    hash: txResult.hash
  };
};
