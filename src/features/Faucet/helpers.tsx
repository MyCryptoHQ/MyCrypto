import { BigNumber } from '@ethersproject/bignumber';

import { makeTxConfigFromTx, toTxReceipt } from '@helpers';
import {
  ExtendedAsset,
  ExtendedContact,
  ITxConfig,
  ITxReceipt,
  ITxStatus,
  ITxType,
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
  accounts: StoreAccount[],
  getContactByAddressAndNetworkId: (
    address: TAddress,
    networkId: NetworkId
  ) => ExtendedContact | undefined
): ITxConfig => {
  const network = getNetworkByLowercaseId(txResult.network, networks);

  // Guaranteed to work as Faucet address is in STATIC_CONTACTS
  const senderContact = getContactByAddressAndNetworkId(txResult.from, network.id)!;

  const newTxResult = {
    ...txResult,
    gasLimit: BigNumber.from(txResult.gasLimit),
    maxPriorityFeePerGas: BigNumber.from(txResult.maxPriorityFeePerGas),
    maxFeePerGas: BigNumber.from(txResult.maxFeePerGas),
    type: 2,
    value: BigNumber.from(txResult.value)
  };

  /*
   * ITxConfig.senderAccount uses type StoreAccount, but in this case the user is the recipient and the faucet is the sender.
   * getContactByAddressAndNetworkId() returns ExtendedContact, which is the closest we can get.
   * The result is casted to make it compatible with ITxConfig.
   */
  const txConfig = {
    ...makeTxConfigFromTx(newTxResult, assets, network, accounts),
    senderAccount: (senderContact as unknown) as StoreAccount
  };

  return txConfig;
};

export const makeTxReceipt = (txResult: ITxFaucetResult, txConfig: ITxConfig): ITxReceipt => {
  const txReceipt = toTxReceipt(txResult.hash, ITxStatus.PENDING)(ITxType.FAUCET, txConfig);
  return txReceipt;
};
