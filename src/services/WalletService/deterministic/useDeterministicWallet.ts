import { useState, useReducer, useEffect } from 'react';

import { Network, DPathFormat, ExtendedAsset } from '@types';

import { Wallet } from '..';
import { default as DeterministicWalletService } from './DeterministicWalletService';
import DeterministicWalletReducer, { initialState, DWActionTypes } from './reducer';
import {
  IUseDeterministicWallet,
  IDeterministicWalletService,
  DWAccountDisplay,
  ExtendedDPath
} from './types';
// import isEmpty from 'ramda/src/isEmpty';

interface MnemonicPhraseInputs {
  phrase: string;
  pass: string;
}

const useDeterministicWallet = (
  dpaths: ExtendedDPath[],
  walletId: DPathFormat,
  gap: number
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
        }),
      handleComplete: () =>
        dispatch({
          type: DWActionTypes.TRIGGER_COMPLETE
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
    const pathItems = state.finishedAccounts.map((acc) => ({
      ...acc.pathItem,
      balance: acc.balance
    }));
    const relevantIndexes = pathItems.reduce((acc, item) => {
      const idx = item.baseDPath.value;
      const curLastIndex = acc[idx]?.lastIndex;
      const curLastInhabitedIndex = acc[idx]?.lastInhabitedIndex || 0;
      const newLastInhabitedIndex =
        curLastInhabitedIndex < item.index && item.balance && !item.balance.isZero()
          ? item.index
          : curLastInhabitedIndex;
      acc[idx] = {
        lastIndex: curLastIndex > item.index ? curLastIndex : item.index,
        lastInhabitedIndex: newLastInhabitedIndex,
        dpath: item.baseDPath
      };
      return acc;
    }, {} as { [key: string]: { lastIndex: number; lastInhabitedIndex: number; dpath: DPath } });
    const addNewItems = Object.values(relevantIndexes)
      .map((indexItem) => {
        if (indexItem.lastIndex - indexItem.lastInhabitedIndex >= gap) return undefined; // gap is satisfied, do nothing;
        return {
          ...indexItem.dpath,
          offset: indexItem.lastIndex,
          numOfAddresses: gap - (indexItem.lastIndex - indexItem.lastInhabitedIndex) + 1
        } as ExtendedDPath;
      })
      .filter((e) => e !== undefined) as ExtendedDPath[];
    if (addNewItems.length === 0) {
      service.triggerComplete();
      return;
    }
    service.getAccounts(state.session, addNewItems);
  }, [state.finishedAccounts]);

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

  const addDPaths = (paths: ExtendedDPath[]) => {
    if (!service || shouldInit || !state.isConnected || !network || !state.session) return;
    service.getAccounts(state.session, paths);
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
    addDPaths
  };
};

export default useDeterministicWallet;
