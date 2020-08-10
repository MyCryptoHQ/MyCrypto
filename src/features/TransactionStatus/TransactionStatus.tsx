import React, { useState, useContext } from 'react';
import { Input } from '@mycrypto/ui';
import { TransactionResponse } from 'ethers/providers';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import { Button, NetworkSelectDropdown, ContentPanel } from '@components';
import { getTransactionByHash } from '@services/EthService/transaction';
import { ITxHash, NetworkId, ITxType } from '@types';
import { NetworkContext, AssetContext, StoreContext } from '@services';
import TxReceipt from '@components/TransactionFlow/TxReceipt';
import { makeTxConfigFromTransactionResponse, makePendingTxReceipt } from '@utils/transaction';
import { noOp } from '@utils';
import { useEffectOnce, useUpdateEffect } from '@vendor';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';

const TransactionStatus = withRouter(({ history, match }) => {
  const { assets } = useContext(AssetContext);
  const { getNetworkById, networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);

  const defaultTxHash = match.params.txHash ? match.params.txHash : '';
  const defaultNetwork = match.params.network ? match.params.network : DEFAULT_NETWORK;

  const [txHash, setTxHash] = useState(defaultTxHash);
  const [networkId, setNetwork] = useState<NetworkId>(defaultNetwork);
  const [fetchedTx, setFetchedTx] = useState<TransactionResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const network = networkId && getNetworkById(networkId);

  // Fetch TX on load if possible
  useEffectOnce(() => {
    if (!isEmpty(defaultTxHash)) {
      fetchTx();
    }
  });

  // Update URL
  useUpdateEffect(() => {
    history.replace(`${ROUTE_PATHS.TX_STATUS.path}/${networkId}/${txHash}`);
  }, [txHash, networkId]);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const tx = await getTransactionByHash(network, txHash as ITxHash);
      setFetchedTx(tx);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const txConfig =
    fetchedTx && makeTxConfigFromTransactionResponse(fetchedTx, assets, networks, accounts);

  const txReceipt = txConfig && makePendingTxReceipt(txHash)(ITxType.UNKNOWN, txConfig);

  return (
    <ContentPanel heading={'TX Status'}>
      {!fetchedTx && (
        <>
          <NetworkSelectDropdown
            network={networkId ? networkId : undefined}
            onChange={(n) => setNetwork(n)}
          />
          <label htmlFor="txhash">{translateRaw('TX_HASH')}</label>
          <Input name="txhash" value={txHash} onChange={(e) => setTxHash(e.currentTarget.value)} />
          <Button loading={loading} onClick={fetchTx} fullwidth={true}>
            {translateRaw('FETCH')}
          </Button>
        </>
      )}
      {fetchedTx && txConfig && (
        <>
          <TxReceipt
            txConfig={txConfig}
            txReceipt={txReceipt!}
            resetFlow={noOp}
            onComplete={noOp}
          />
        </>
      )}
    </ContentPanel>
  );
});

export default TransactionStatus;
