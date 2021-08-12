import { useEffect, useReducer } from 'react';

import { isHexString } from '@ethersproject/bytes';
import { Input } from '@mycrypto/ui';
import queryString from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import {
  Button,
  ContentPanel,
  InlineMessage,
  NetworkSelector,
  Spinner,
  TxReceipt
} from '@components';
import { DEFAULT_NETWORK, ROUTE_PATHS } from '@config';
import { useAssets, useNetworks } from '@services';
import { getMergedTxHistory, getStoreAccounts, useSelector } from '@store';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { ITxReceipt } from '@types';
import { isVoid, noOp } from '@utils';
import { useEffectOnce, useUpdateEffect } from '@vendor';

import { fetchTxStatus, makeTx } from './helpers';
import { generateInitialState, txStatusReducer } from './TxStatus.reducer';

const Wrapper = styled.div<{ fullPageLoading: boolean }>`
  ${({ fullPageLoading }) =>
    fullPageLoading &&
    `
    display: flex;
    justify-content: center;
    align-items: center;
`}
  min-height: 600px;
`;

const SButton = styled(Button)`
  margin-top: 0;
`;

const SLabel = styled.label`
  margin-top: ${SPACING.SM};
  color: ${COLORS.GREY_DARKEST};
  font-weight: normal;
`;

const TxStatus = ({ history, location }: RouteComponentProps) => {
  const qs = queryString.parse(location.search);

  const { assets } = useAssets();
  const { networks } = useNetworks();
  const accounts = useSelector(getStoreAccounts);
  const txHistory = useSelector(getMergedTxHistory);

  const defaultTxHash = qs.hash ? qs.hash : '';
  const defaultNetwork = qs.network ? qs.network : DEFAULT_NETWORK;

  const initialState = generateInitialState(defaultTxHash, defaultNetwork);

  const [reducerState, dispatch] = useReducer(txStatusReducer, initialState);

  const { networkId, txHash, tx, error, fetching, fromLink } = reducerState;
  // Fetch TX on load if possible
  useEffectOnce(() => {
    if (!isVoid(defaultTxHash)) {
      handleSubmit(true);
    }
  });

  // Update URL
  useUpdateEffect(() => {
    if (networkId === DEFAULT_NETWORK) {
      history.replace(`${ROUTE_PATHS.TX_STATUS.path}/?hash=${txHash}`);
    } else {
      history.replace(`${ROUTE_PATHS.TX_STATUS.path}/?hash=${txHash}&network=${networkId}`);
    }
  }, [txHash, networkId]);

  useEffect(() => {
    if (fetching) {
      fetchTxStatus({ networks, txHash, networkId, txCache: txHistory })
        .then((t) => makeTx({ txHash, networkId, accounts, assets, networks, ...t }))
        .then((t) => dispatch({ type: txStatusReducer.actionTypes.FETCH_TX_SUCCESS, payload: t }))
        .catch((e) => {
          console.error(e);
          dispatch({ type: txStatusReducer.actionTypes.FETCH_TX_ERROR });
        });
    }
  }, [fetching]);

  const handleSubmit = (fromLinkSharing: boolean) => {
    dispatch({ type: txStatusReducer.actionTypes.FETCH_TX, payload: fromLinkSharing });
  };

  const clearForm = () => {
    dispatch({ type: txStatusReducer.actionTypes.CLEAR_FORM });
  };

  const fullPageLoading = fromLink && !tx;

  const isFormValid = txHash.length > 0 && isHexString(txHash);

  return (
    <ContentPanel heading={translateRaw('TX_STATUS')}>
      <Wrapper fullPageLoading={fullPageLoading || false}>
        {!tx && !fromLink && (
          <>
            <NetworkSelector
              network={networkId ? networkId : undefined}
              onChange={(n) =>
                dispatch({ type: txStatusReducer.actionTypes.SET_NETWORK, payload: n })
              }
            />
            <SLabel htmlFor="txhash">{translateRaw('TX_HASH')}</SLabel>
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
            {error && <InlineMessage value={error} />}
            <Button
              disabled={!isFormValid}
              loading={fetching}
              onClick={() => handleSubmit(false)}
              fullwidth={true}
            >
              {translateRaw('FETCH')}
            </Button>
          </>
        )}
        {fullPageLoading && <Spinner color="brand" size={4} />}
        {tx && (
          <>
            <TxReceipt
              txConfig={tx.config}
              txReceipt={tx.receipt as ITxReceipt}
              resetFlow={noOp}
              onComplete={noOp}
              disableDynamicTxReceiptDisplay={true}
            />
            <SButton onClick={clearForm} fullwidth={true} colorScheme={'inverted'}>
              {translateRaw('TX_STATUS_GO_BACK')}
            </SButton>
          </>
        )}
      </Wrapper>
    </ContentPanel>
  );
};

export default withRouter(TxStatus);
