import { TransactionResponse } from 'ethers/providers';

import { ITxHistoryEntry, ProviderHandler } from '@services';
import { Asset, ITxHash, ITxReceipt, ITxType, Network, NetworkId, StoreAccount } from '@types';
import {
  makeTxConfigFromTxReceipt,
  makeTxConfigFromTxResponse,
  makeUnknownTxReceipt
} from '@utils';

export const fetchTxStatus = async ({
  txHash,
  networkId,
  networks,
  txCache
}: {
  txHash: string;
  networkId: NetworkId;
  networks: Network[];
  txCache: ITxHistoryEntry[];
}) => {
  const network = networks.find((n) => n.id === networkId)!;
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
      config: makeTxConfigFromTxReceipt(cachedTx, assets, network, accounts),
      receipt: cachedTx
    };
  } else {
    const fetchedTxConfig = makeTxConfigFromTxResponse(fetchedTx!, assets, network, accounts);
    return {
      config: fetchedTxConfig,
      receipt: makeUnknownTxReceipt(txHash as ITxHash)(ITxType.UNKNOWN, fetchedTxConfig)
    };
  }
};
