import { useEffect, useState } from 'react';

import { useReducer } from 'reinspect';

import { DPathFormat, ExtendedAsset, Network } from '@types';
import { identity } from '@vendor';

import { processFinishedAccounts, Wallet } from '..';
import { default as DeterministicWalletService } from './DeterministicWalletService';
import DeterministicWalletReducer, { DWActionTypes, initialState } from './reducer';
import {
  DWAccountDisplay,
  ExtendedDPath,
  IDeterministicWalletService,
  IUseDeterministicWallet
} from './types';

const useDeterministicWallet = (
  dpaths: ExtendedDPath[],
  walletId: DPathFormat,
  gap: number
): IUseDeterministicWallet => {
  const [state, dispatch] = useReducer(
    DeterministicWalletReducer,
    initialState,
    identity,
    'DeterministicWallet'
  );
  const [shouldInit, setShouldInit] = useState(false);
  const [service, setService] = useState<IDeterministicWalletService | undefined>(); // Keep a reference to the session in order to send
  const [assetToQuery, setAssetToQuery] = useState(undefined as ExtendedAsset | undefined);
  const [network, setNetwork] = useState(undefined as Network | undefined);

  // Initialize DeterministicWallet and get the uri.
  useEffect(() => {
    if (!shouldInit || !assetToQuery || !network) return;
    setShouldInit(false);
    const dwService = DeterministicWalletService({
      handleInitRequest: () =>
        dispatch({
          type: DWActionTypes.CONNECTION_REQUEST
        }),
      handleInit: (session: Wallet, asset: ExtendedAsset) =>
        dispatch({
          type: DWActionTypes.CONNECTION_SUCCESS,
          payload: { session, asset }
        }),
      handleReject: (err: string) =>
        dispatch({
          type: DWActionTypes.CONNECTION_FAILURE,
          error: {
            code: DeterministicWalletReducer.errorCodes.SESSION_CONNECTION_FAILED,
            message: err
          }
        }),
      handleAccountsSuccess: () =>
        dispatch({
          type: DWActionTypes.GET_ADDRESSES_SUCCESS
        }),
      handleEnqueueAccounts: (accounts: DWAccountDisplay[]) => {
        return dispatch({
          type: DWActionTypes.ENQUEUE_ADDRESSES,
          payload: { accounts }
        });
      },
      handleAccountsUpdate: (accounts: DWAccountDisplay[], asset: ExtendedAsset) => {
        return dispatch({
          type: DWActionTypes.UPDATE_ACCOUNTS,
          payload: { accounts, asset }
        });
      },
      handleAccountsError: (err: string) =>
        dispatch({
          type: DWActionTypes.GET_ADDRESSES_FAILURE,
          error: { code: DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED, message: err }
        }),
      handleComplete: () =>
        dispatch({
          type: DWActionTypes.TRIGGER_COMPLETE
        })
    });

    // @todo: This currently expects the default dpath for the network to always be first in the arr
    dwService.init({ walletId, asset: assetToQuery, dpath: dpaths[0] });
    setService(dwService);
  }, [shouldInit]);

  useEffect(() => {
    if (!state.isConnected && state.isInit) {
      setShouldInit(false);
    }
  }, [state.isInit]);

  useEffect(() => {
    if (!service || shouldInit || !state.isConnected || !network || !state.session) return;
    service.getAccounts(state.session, dpaths);
  }, [state.isConnected]);

  useEffect(() => {
    console.debug('recheck', assetToQuery?.name);
    if (
      !service ||
      shouldInit ||
      !state.isConnected ||
      !state.session ||
      !assetToQuery ||
      !network ||
      state.queuedAccounts.length === 0
    ) {
      console.debug('recheck failed', assetToQuery?.name);
      return;
    }
    console.debug('recheck queued', assetToQuery?.name, state.queuedAccounts);
    service.handleAccountsQueue(state.queuedAccounts, network, assetToQuery);
  }, [state.queuedAccounts]);

  useEffect(() => {
    if (state.finishedAccounts.length === 0 || !service || !state.session) return;
    const { newGapItems, customDPathItems } = processFinishedAccounts(
      state.finishedAccounts,
      state.customDPaths,
      gap
    );
    if (newGapItems.length !== 0) {
      service.getAccounts(state.session, newGapItems);
      return;
    }
    if (customDPathItems.length > 0) {
      service.getAccounts(state.session, customDPathItems);
      return;
    }
    service.triggerComplete();
    return;
  }, [state.finishedAccounts, state.completed]);

  const requestConnection = (networkToUse: Network, asset: ExtendedAsset) => {
    setNetwork(networkToUse);
    setAssetToQuery(asset);
    setShouldInit(true);
  };

  const addDPaths = (customDPaths: ExtendedDPath[]) => {
    if (!service || shouldInit || !state.isConnected || !network || !state.session) {
      return;
    }
    dispatch({
      type: DWActionTypes.ADD_CUSTOM_DPATHS,
      payload: { dpaths: customDPaths }
    });
  };

  const updateAsset = (asset: ExtendedAsset) => {
    console.debug('1');
    if (!service) return;
    console.debug('2');
    setAssetToQuery(asset);
    dispatch({
      type: DWActionTypes.UPDATE_ASSET,
      payload: { asset }
    });
  };

  const scanMoreAddresses = (dpath: ExtendedDPath) => {
    if (!service || shouldInit || !state.isConnected || !network || !state.session) return;
    dispatch({
      type: DWActionTypes.GET_ADDRESSES_REQUEST
    });
    service.getAccounts(state.session, [dpath]);
  };

  return {
    state,
    requestConnection,
    updateAsset,
    addDPaths,
    scanMoreAddresses
  };
};

export default useDeterministicWallet;
