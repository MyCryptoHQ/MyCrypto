import React, { useState, useContext } from 'react';
import { Input } from '@mycrypto/ui';
import { TransactionResponse } from 'ethers/providers';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

import { Button, NetworkSelectDropdown, ContentPanel, TxReceipt, InlineMessage } from '@components';
import { ITxHash, NetworkId, ITxType } from '@types';
import { NetworkContext, AssetContext, StoreContext, ProviderHandler } from '@services';
import { makeTxConfigFromTransactionResponse, makePendingTxReceipt } from '@utils/transaction';
import { noOp } from '@utils';
import { useEffectOnce, useUpdateEffect } from '@vendor';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';

const TransactionStatus = withRouter(({ history, match, location }) => {
  const qs = queryString.parse(location.search);

  const { assets } = useContext(AssetContext);
  const { getNetworkById, networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);

  const defaultTxHash = match.params.txHash ? match.params.txHash : '';
  const defaultNetwork = qs.network ? qs.network : DEFAULT_NETWORK;

  const [txHash, setTxHash] = useState(defaultTxHash);
  const [networkId, setNetwork] = useState<NetworkId>(defaultNetwork);
  const [fetchedTx, setFetchedTx] = useState<TransactionResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const network = networkId && getNetworkById(networkId);

  // Fetch TX on load if possible
  useEffectOnce(() => {
    if (!isEmpty(defaultTxHash)) {
      fetchTx();
    }
  });

  // Update URL
  useUpdateEffect(() => {
    if (networkId === DEFAULT_NETWORK) {
      history.replace(`${ROUTE_PATHS.TX_STATUS.path}/${txHash}`);
    } else {
      history.replace(`${ROUTE_PATHS.TX_STATUS.path}/${txHash}?network=${networkId}`);
    }
  }, [txHash, networkId]);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const provider = new ProviderHandler(network);
      const tx = await provider.getTransactionByHash(txHash as ITxHash, true);
      if (!tx) {
        setError(translateRaw('TX_NOT_FOUND'));
      } else {
        setFetchedTx(tx);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const txConfig =
    fetchedTx && makeTxConfigFromTransactionResponse(fetchedTx, assets, networks, accounts);

  const txReceipt = txConfig && makePendingTxReceipt(txHash)(ITxType.UNKNOWN, txConfig);

  return (
    <ContentPanel heading={translateRaw('TX_STATUS')}>
      {!fetchedTx && (
        <>
          <NetworkSelectDropdown
            network={networkId ? networkId : undefined}
            onChange={(n) => setNetwork(n)}
          />
          <label htmlFor="txhash">{translateRaw('TX_HASH')}</label>
          <Input name="txhash" value={txHash} onChange={(e) => setTxHash(e.currentTarget.value)} />
          {error.length > 0 && <InlineMessage value={error} />}
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
