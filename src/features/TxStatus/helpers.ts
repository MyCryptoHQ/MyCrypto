import { TransactionResponse } from 'ethers/providers';

import { ProviderHandler, getTxsFromAccount } from '@services';
import {
  makeTxConfigFromTxResponse,
  makeTxConfigFromTxReceipt,
  makeUnknownTxReceipt,
  makePendingTxReceipt
} from '@utils';
<<<<<<< HEAD
import { ITxType, ITxHash, NetworkId, StoreAccount, Asset, Network, ITxReceipt, ITxConfig } from '@types';
=======
import {
  ITxType,
  ITxHash,
  NetworkId,
  StoreAccount,
  Asset,
  Network,
  ITxReceipt,
  ITxConfig,
  TxQueryTypes
} from '@types';
>>>>>>> added banner and cleaned up

export const fetchTxStatus = async ({
  txHash,
  networkId,
  networks,
  accounts
}: {
  txHash: string;
  networkId: NetworkId;
  networks: Network[];
  accounts: StoreAccount[];
}) => {
  const network = networks.find((n) => n.id === networkId)!;
  const txCache = getTxsFromAccount(accounts);
  const cachedTx = txCache.find(
    (t) => t.hash === (txHash as ITxHash) && t.asset.networkId === networkId
  );
  if (cachedTx) {
    return { cachedTx, fetchedTx: undefined };
  }
  const provider = new ProviderHandler(network);
  const fetchedTx = await provider.getTransactionByHash(txHash as ITxHash, true);
  if (!fetchedTx) {
    return;
  }
  return { fetchedTx, cachedTx: undefined };
};

<<<<<<< HEAD
export const makeTx = ({
  txHash,
  networkId,
  networks,
  accounts,
  assets,
  cachedTx,
  fetchedTx
}: {
  txHash: string;
  networkId: NetworkId;
  networks: Network[];
  accounts: StoreAccount[];
  assets: Asset[];
  cachedTx?: ITxReceipt;
  fetchedTx?: TransactionResponse;
}) => {
  const network = networks.find((n) => n.id === networkId)!;
  if (cachedTx) {
    return {
      config: makeTxConfigFromTxReceipt(cachedTx, assets, networks, accounts),
      receipt: cachedTx
    };
  } else {
    const fetchedTxConfig = makeTxConfigFromTxResponse(fetchedTx!, assets, network, accounts);
    return {
      config: fetchedTxConfig,
      receipt: makeUnknownTxReceipt(txHash as ITxHash)(ITxType.UNKNOWN, fetchedTxConfig)
    };
  }
  export const createQueryParams = (txConfig: ITxConfig, type: 'resubmit' | 'cancel') => {
    const { to, from, gasLimit, nonce, chainId, value, data } = txConfig.rawTransaction;
    const senderAddress = txConfig.senderAccount?.address;
    return {
      from: from || senderAddress,
      type,
      to,
      gasLimit,
      nonce,
      chainId,
      value,
      data
    };
=======
export const createQueryParams = (txConfig: ITxConfig, type: TxQueryTypes) => {
  const { to, from, gasLimit, nonce, chainId, value, data } = txConfig.rawTransaction;
  const senderAddress = txConfig.senderAccount?.address;
  return {
    from: from || senderAddress,
    type,
    to,
    gasLimit,
    nonce,
    chainId,
    value,
    data
>>>>>>> added banner and cleaned up
  };
