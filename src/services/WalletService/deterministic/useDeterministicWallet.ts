import { useState, useReducer, useEffect } from 'react';

import { Network, DPathFormat, ExtendedAsset } from '@types';

import { Wallet } from '..';
import { default as DeterministicWalletService } from './DeterministicWalletService';
import DeterministicWalletReducer, { initialState, DWActionTypes } from './reducer';
import { IUseDeterministicWallet, IDeterministicWalletService, DWAccountDisplay } from './types';

interface MnemonicPhraseInputs {
  phrase: string;
  pass: string;
}

const useDeterministicWallet = (
  dpaths: DPath[],
  numOfAccountsToCheck: number,
  walletId: DPathFormat
): IUseDeterministicWallet => {
  const [state, dispatch] = useReducer(DeterministicWalletReducer, initialState);
  const [shouldInit, setShouldInit] = useState(false);
  const [service, setService] = useState<IDeterministicWalletService | undefined>(); // Keep a reference to the session in order to send
  const [assetToQuery, setAssetToQuery] = useState(undefined as ExtendedAsset | undefined);
  const [network, setNetwork] = useState(undefined as Network | undefined);
  const [mnemonicInputs, setMnemonicInputs] = useState({} as MnemonicPhraseInputs);
  // Initialize DeterministicWallet and get the uri.
  useEffect(() => {
    if (!shouldInit || !assetToQuery || !network) return;
    setShouldInit(false);
    const dwService = DeterministicWalletService({
      walletId,
      handleInitRequest: () =>
        dispatch({
          type: DWActionTypes.CONNECTION_REQUEST
        }),
      handleInit: (session: Wallet, asset: ExtendedAsset) =>
        dispatch({
          type: DWActionTypes.CONNECTION_SUCCESS,
          payload: { session, asset }
        }),
      handleReject: () =>
        dispatch({
          type: DWActionTypes.CONNECTION_FAILURE,
          error: { code: DeterministicWalletReducer.errorCodes.SESSION_CONNECTION_FAILED }
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
      handleAccountsError: () =>
        dispatch({
          type: DWActionTypes.GET_ADDRESSES_FAILURE,
          error: { code: DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED }
        })
    });

    dwService.init(walletId, assetToQuery, mnemonicInputs.phrase, mnemonicInputs.pass);
    setService(dwService);
  }, [shouldInit]);

  useEffect(() => {
    if (!state.isConnected && state.isInit) {
      setShouldInit(false);
    }
  }, [state.isInit]);

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
    if (!service || shouldInit || !state.isConnected || !network || !state.session) return;
    service.getAccounts(state.session, dpaths, numOfAccountsToCheck, 0, network);
  }, [state.isConnected]);

  const requestConnection = (
    networkToUse: Network,
    asset: ExtendedAsset,
    mnemonicPhrase?: string,
    pass?: string
  ) => {
    if (mnemonicPhrase) {
      setMnemonicInputs({ phrase: mnemonicPhrase, pass: pass! });
    }
    setNetwork(networkToUse);
    setAssetToQuery(asset);
    setShouldInit(true);
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
    updateAsset
  };
};

export default useDeterministicWallet;
