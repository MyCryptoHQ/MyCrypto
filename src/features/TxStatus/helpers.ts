import { ProviderHandler, getTxsFromAccount } from '@services';
import {
  makeTxConfigFromTxResponse,
  makeTxConfigFromTxReceipt,
  makeUnknownTxReceipt
} from '@utils';
import { ITxType, ITxHash, NetworkId, StoreAccount, Asset, Network } from '@types';

export const fetchTxStatus = async ({
  txHash,
  networkId,
  networks,
  accounts,
  assets
}: {
  txHash: string;
  networkId: NetworkId;
  networks: Network[];
  accounts: StoreAccount[];
  assets: Asset[];
}) => {
  const network = networks.find((n) => n.id === networkId)!;
  const txCache = getTxsFromAccount(accounts);
  const cachedTx = txCache.find(
    (t) => t.hash === (txHash as ITxHash) && t.asset.networkId === networkId
  );
  if (cachedTx) {
    return {
      config: makeTxConfigFromTxReceipt(cachedTx, assets, networks, accounts),
      receipt: cachedTx
    };
  }
  const provider = new ProviderHandler(network);
  const fetchedTx = await provider.getTransactionByHash(txHash as ITxHash, true);
  if (!fetchedTx) {
    return undefined;
  }
  const fetchedTxConfig = makeTxConfigFromTxResponse(fetchedTx, assets, network, accounts);
  return {
    config: fetchedTxConfig,
    receipt: makeUnknownTxReceipt(txHash as ITxHash)(ITxType.UNKNOWN, fetchedTxConfig)
  };
};
