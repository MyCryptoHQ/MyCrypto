import React, { useState, useContext } from 'react';
import { Input } from '@mycrypto/ui';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';

import { Button, NetworkSelectDropdown, ContentPanel, TxReceipt, InlineMessage } from '@components';
import { ITxHash, NetworkId, ITxType, ITxConfig, ITxReceipt } from '@types';
import { NetworkContext, AssetContext, StoreContext, ProviderHandler } from '@services';
import {
  makeTxConfigFromTransactionResponse,
  makePendingTxReceipt,
  makeTxConfigFromTxReceipt
} from '@utils/transaction';
import { noOp } from '@utils';
import { useEffectOnce, useUpdateEffect } from '@vendor';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { getTxsFromAccount } from '@services/Store/helpers';

const TransactionStatus = withRouter(({ history, match, location }) => {
  const qs = queryString.parse(location.search);

  const { assets } = useContext(AssetContext);
  const { getNetworkById, networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);

  const defaultTxHash = match.params.txHash ? match.params.txHash : '';
  const defaultNetwork = qs.network ? qs.network : DEFAULT_NETWORK;

  const [txHash, setTxHash] = useState(defaultTxHash);
  const [networkId, setNetwork] = useState<NetworkId>(defaultNetwork);
  const [tx, setTx] = useState<{ config: ITxConfig; receipt: ITxReceipt } | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const network = networkId && getNetworkById(networkId);

  const txCache = getTxsFromAccount(accounts);
  const cachedTx = txCache.find(
    (t) => t.hash === (txHash as ITxHash) && t.asset.networkId === networkId
  );

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
      const txResult = await (async () => {
        if (!cachedTx) {
          const provider = new ProviderHandler(network);
          const fetchedTx = await provider.getTransactionByHash(txHash as ITxHash, true);
          const fetchedTxConfig = makeTxConfigFromTransactionResponse(
            fetchedTx,
            assets,
            networks,
            accounts
          );
          return {
            config: fetchedTxConfig,
            receipt: makePendingTxReceipt(txHash)(ITxType.UNKNOWN, fetchedTxConfig)
          };
        } else {
          return {
            config: makeTxConfigFromTxReceipt(cachedTx, assets, networks, accounts),
            receipt: cachedTx
          };
        }
      })();
      if (!txResult) {
        setError(translateRaw('TX_NOT_FOUND'));
      } else {
        setTx(txResult);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <ContentPanel heading={translateRaw('TX_STATUS')}>
      {!tx && (
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
      {tx && (
        <>
          <TxReceipt
            txConfig={tx.config}
            txReceipt={tx.receipt}
            resetFlow={noOp}
            onComplete={noOp}
            disableDynamicTxReceiptDisplay={true}
            disableAddTxToAccount={true}
          />
        </>
      )}
    </ContentPanel>
  );
});

export default TransactionStatus;
