import React, { useContext, useReducer, useEffect } from 'react';
import { Input } from '@mycrypto/ui';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

import { Button, NetworkSelectDropdown, ContentPanel, TxReceipt, InlineMessage } from '@components';
import { ITxHash, NetworkId, ITxType } from '@types';
import { NetworkContext, AssetContext, StoreContext, ProviderHandler } from '@services';
import {
  noOp,
  isVoid,
  makeTxConfigFromTransactionResponse,
  makePendingTxReceipt,
  makeTxConfigFromTxReceipt
} from '@utils';
import { useEffectOnce, useUpdateEffect } from '@vendor';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { getTxsFromAccount } from '@services/Store';
import { txStatusReducer, generateInitialState } from './TxStatus.reducer';

const SUPPORTED_NETWORKS: NetworkId[] = ['Ethereum', 'Ropsten', 'Goerli', 'Kovan', 'ETC'];

const TxStatus = ({ history, match, location }: RouteComponentProps<{ txHash: string }>) => {
  const qs = queryString.parse(location.search);

  const { assets } = useContext(AssetContext);
  const { getNetworkById, networks } = useContext(NetworkContext);
  const { accounts } = useContext(StoreContext);

  const defaultTxHash = match.params.txHash ? match.params.txHash : '';
  const defaultNetwork =
    qs.network && SUPPORTED_NETWORKS.includes(qs.network) ? qs.network : DEFAULT_NETWORK;

  const initialState = generateInitialState(defaultTxHash, defaultNetwork);

  const [reducerState, dispatch] = useReducer(txStatusReducer, initialState);

  const { networkId, txHash, tx, error, fetching } = reducerState;

  const network = networkId && getNetworkById(networkId);

  const txCache = getTxsFromAccount(accounts);
  const cachedTx = txCache.find(
    (t) => t.hash === (txHash as ITxHash) && t.asset.networkId === networkId
  );

  // Fetch TX on load if possible
  useEffectOnce(() => {
    if (!isVoid(defaultTxHash)) {
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

  useEffect(() => {
    if (fetching) {
      try {
        const txResult = await(async () => {
          if (!cachedTx) {
            const provider = new ProviderHandler(network);
            const fetchedTx = await provider.getTransactionByHash(txHash as ITxHash, true);
            if (!fetchedTx) {
              return undefined;
            }
            const fetchedTxConfig = makeTxConfigFromTransactionResponse(
              fetchedTx,
              assets,
              network,
              accounts
            );
            return {
              config: fetchedTxConfig,
              receipt: makePendingTxReceipt(txHash as ITxHash)(ITxType.UNKNOWN, fetchedTxConfig)
            };
          } else {
            return {
              config: makeTxConfigFromTxReceipt(cachedTx, assets, networks, accounts),
              receipt: cachedTx
            };
          }
        })();
        dispatch({ type: txStatusReducer.actionTypes.FETCH_TX_SUCCESS, payload: txResult });
      } catch (err) {
        console.error(err);
      } finally {
        //setLoading(false);
      }
    }
  }, [fetching]);

  const fetchTx = async () => {
    dispatch({ type: txStatusReducer.actionTypes.FETCH_TX });
  };

  return (
    <ContentPanel heading={translateRaw('TX_STATUS')}>
      {!tx && (
        <>
          <NetworkSelectDropdown
            network={networkId ? networkId : undefined}
            onChange={(n) =>
              dispatch({ type: txStatusReducer.actionTypes.SET_NETWORK, payload: n })
            }
            filter={(n) => SUPPORTED_NETWORKS.includes(n.id)}
          />
          <label htmlFor="txhash">{translateRaw('TX_HASH')}</label>
          <Input
            name="txhash"
            value={txHash}
            onChange={(e) =>
              dispatch({
                type: txStatusReducer.actionTypes.SET_TX_HASH,
                payload: e.currentTarget.value
              })
            }
          />
          {error.length > 0 && <InlineMessage value={error} />}
          <Button loading={fetching} onClick={fetchTx} fullwidth={true}>
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
          <Button
            onClick={() => dispatch({ type: txStatusReducer.actionTypes.CLEAR_FORM })}
            fullwidth={true}
          >
            {translateRaw('TX_STATUS_GO_BACK')}
          </Button>
        </>
      )}
    </ContentPanel>
  );
};

export default withRouter(TxStatus);
