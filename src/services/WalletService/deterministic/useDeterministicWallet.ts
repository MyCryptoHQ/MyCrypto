import { useEffect, useState } from 'react';

import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BN from 'bignumber.js';
import { useReducer } from 'reinspect';

import {
  BalanceMap,
  getBaseAssetBalancesForAddresses,
  getSingleTokenBalanceForAddresses
} from '@services/Store/BalanceService';
import { DPathFormat, ExtendedAsset, Network, WalletId } from '@types';
import { bigify } from '@utils';
import { identity } from '@vendor';

import { LedgerU2F, LedgerUSB, processFinishedAccounts, Trezor, Wallet } from '..';
import DeterministicWalletReducer, { DWActionTypes, initialState } from './reducer';
import { DWAccountDisplay, ExtendedDPath, IUseDeterministicWallet } from './types';

const selectWallet = async (walletId: WalletId) => {
  switch (walletId) {
    default:
    case WalletId.LEDGER_NANO_S_NEW: {
      const isWebUSBSupported = await TransportWebUSB.isSupported().catch(() => false);
      return isWebUSBSupported ? new LedgerUSB() : new LedgerU2F(); // @todo - fix the walletId & type
    }
    case WalletId.TREZOR_NEW:
      return new Trezor();
  }
};

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
  const [assetToQuery, setAssetToQuery] = useState(undefined as ExtendedAsset | undefined);
  const [network, setNetwork] = useState(undefined as Network | undefined);

  const getAccounts = async (session: Wallet, dpaths: ExtendedDPath[]) => {
    // Trezor wallet uses getMultipleAddresses for fetching multiple addresses at a time. Ledger doesn't have this functionality.
    if (session.getMultipleAddresses) {
      await session
        .getMultipleAddresses(dpaths)
        .then((accounts) => {
          dispatch({
            type: DWActionTypes.ENQUEUE_ADDRESSES,
            payload: { accounts }
          });
        })
        .catch((err) => {
          dispatch({
            type: DWActionTypes.GET_ADDRESSES_FAILURE,
            error: { code: DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED, message: err }
          });
        });
    } else {
      console.error(`[getAccounts]: Selected HD wallet type has no getMultipleAddresses method`);
    }
  };

  const handleAccountsQueue = (
    accounts: DWAccountDisplay[],
    network: Network,
    asset: ExtendedAsset
  ) => {
    const addresses = accounts.map(({ address }) => address);
    const balanceLookup =
      asset.type === 'base'
        ? () => getBaseAssetBalancesForAddresses(addresses, network)
        : () => getSingleTokenBalanceForAddresses(asset, network, addresses);

    try {
      balanceLookup().then((balanceMapData: BalanceMap<BN>) => {
        const walletsWithBalances: DWAccountDisplay[] = accounts.map((account) => {
          const balance = balanceMapData[account.address] || 0; // @todo - better error handling for failed lookups.
          return {
            ...account,
            balance: bigify(balance.toString())
          };
        });
        dispatch({
          type: DWActionTypes.UPDATE_ACCOUNTS,
          payload: { accounts: walletsWithBalances, asset }
        });
      });
    } catch (err) {
      dispatch({
        type: DWActionTypes.UPDATE_ACCOUNTS,
        payload: { accounts, asset }
      });
    }
  };

  // Initialize DeterministicWallet and get the uri.
  useEffect(() => {
    if (!shouldInit || !assetToQuery || !network) return;
    setShouldInit(false);

    // initialize the wallet
    selectWallet(walletId)
      .then((walletSession) => {
        return walletSession.initialize(dpaths[0]).then(() => {
          dispatch({
            type: DWActionTypes.CONNECTION_REQUEST
          });
          return walletSession;
        });
      })
      .then((walletSession) => {
        dispatch({
          type: DWActionTypes.CONNECTION_SUCCESS,
          payload: { session: walletSession, asset: assetToQuery }
        });
      })
      .catch((err) => {
        dispatch({
          type: DWActionTypes.CONNECTION_FAILURE,
          error: {
            code: DeterministicWalletReducer.errorCodes.SESSION_CONNECTION_FAILED,
            message: err
          }
        });
      });
  }, [shouldInit]);

  useEffect(() => {
    if (!state.isConnected && state.isInit) {
      setShouldInit(false);
    }
  }, [state.isInit]);

  // On first connection && on asset update
  useEffect(() => {
    if (
      shouldInit ||
      !state.isConnected ||
      !network ||
      !state.session ||
      state.finishedAccounts.length !== 0
    )
      return;
    getAccounts(state.session, dpaths);
  }, [state.isConnected, state.finishedAccounts]);

  // On scan more
  useEffect(() => {
    if (shouldInit || !state.isConnected || !network || !state.session || state.completed) return;
    getAccounts(state.session, dpaths);
  }, [state.completed]);

  // On accounts added to queue
  useEffect(() => {
    if (
      shouldInit ||
      !state.isConnected ||
      !state.session ||
      !assetToQuery ||
      !network ||
      state.queuedAccounts.length === 0
    ) {
      return;
    }
    handleAccountsQueue(state.queuedAccounts, network, assetToQuery);
  }, [state.queuedAccounts]);

  useEffect(() => {
    if (state.finishedAccounts.length === 0 || !state.session) {
      return;
    }
    const { newGapItems, customDPathItems } = processFinishedAccounts(
      state.finishedAccounts,
      state.customDPaths,
      gap
    );
    if (newGapItems.length !== 0) {
      getAccounts(state.session, newGapItems);
      return;
    }
    if (customDPathItems.length > 0) {
      getAccounts(state.session, customDPathItems);
      return;
    }
    // trigger completion
    if (!state.isGettingAccounts) {
      dispatch({
        type: DWActionTypes.TRIGGER_COMPLETE
      });
    }
    return;
  }, [state.finishedAccounts, state.completed]);

  const requestConnection = (networkToUse: Network, asset: ExtendedAsset) => {
    setNetwork(networkToUse);
    setAssetToQuery(asset);
    setShouldInit(true);
  };

  const addDPaths = (customDPaths: ExtendedDPath[]) => {
    if (shouldInit || !state.isConnected || !network || !state.session) {
      return;
    }
    dispatch({
      type: DWActionTypes.ADD_CUSTOM_DPATHS,
      payload: { dpaths: customDPaths }
    });
  };

  const updateAsset = (asset: ExtendedAsset) => {
    dispatch({
      type: DWActionTypes.UPDATE_ASSET,
      payload: { asset }
    });
    setAssetToQuery(asset);
  };

  const scanMoreAddresses = (dpath: ExtendedDPath) => {
    if (shouldInit || !state.isConnected || !network || !state.session) return;
    dispatch({
      type: DWActionTypes.GET_ADDRESSES_REQUEST
    });
    getAccounts(state.session, [dpath]);
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
