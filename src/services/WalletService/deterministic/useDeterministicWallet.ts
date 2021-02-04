import { useEffect, useState } from 'react';

import { useReducer } from 'reinspect';

import { DPathFormat, ExtendedAsset, Network } from '@types';
import { identity, pipe, prop, uniqBy } from '@vendor';

import { processFinishedAccounts, Wallet } from '..';
import { default as DeterministicWalletService } from './DeterministicWalletService';
import { findFinishedZeroBalanceAccounts } from './helpers';
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
    if (
      !service ||
      shouldInit ||
      !state.isConnected ||
      !state.session ||
      !assetToQuery ||
      !network ||
      state.queuedAccounts.length === 0
    )
      return;
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

  const generateFreshAddress = (defaultDPath: ExtendedDPath): boolean => {
    if (!service || shouldInit || !state.isConnected || !network || !state.session) {
      return false;
    }
    const finishedDefaultDPathEntries = state.finishedAccounts.filter(
      (account) => account.pathItem.baseDPath.value === defaultDPath.value
    );
    const finishedAccountFreshAddress = findFinishedZeroBalanceAccounts(
      finishedDefaultDPathEntries
    );
    const filteredDefaultDPathAccounts = uniqBy(
      pipe(prop('pathItem'), prop('index')),
      finishedAccountFreshAddress
    );
    if (filteredDefaultDPathAccounts.length > defaultDPath.offset) {
      dispatch({
        type: DWActionTypes.DESIGNATE_FRESH_ADDRESS,
        payload: { address: filteredDefaultDPathAccounts[defaultDPath.offset].address }
      });
      return true;
    }
    return false;
  };

  const updateAsset = (asset: ExtendedAsset) => {
    if (!service) return;
    setAssetToQuery(asset);
    dispatch({
      type: DWActionTypes.UPDATE_ASSET,
      payload: { asset }
    });
  };

  return {
    state,
    requestConnection,
    updateAsset,
    addDPaths,
    generateFreshAddress
  };
};

export default useDeterministicWallet;
