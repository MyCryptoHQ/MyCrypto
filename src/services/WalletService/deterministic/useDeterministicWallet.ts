import { useState, useReducer, useEffect } from 'react';

import { Network, DPathFormat, ExtendedAsset } from '@types';

import { default as DeterministicWalletService } from './DeterministicWalletService';
import DeterministicWalletReducer, { initialState, DWActionTypes } from './reducer';
import { IUseDeterministicWallet, IDeterministicWalletService, DWAccountDisplay } from './types';
import { Wallet } from '..';

// interface IUseDeterministicWalletProps {
// 	network: Network;
// 	asset: ExtendedAsset;
// 	walletId: WalletId
// }

const useDeterministicWallet = (
  network: Network,
  _: ExtendedAsset,
  dpaths: DPath[],
  numOfAccountsToCheck: number,
  walletId: DPathFormat
): IUseDeterministicWallet => {
  const [state, dispatch] = useReducer(DeterministicWalletReducer, initialState);
  const [shouldInit, setShouldInit] = useState(false);
  const [service, setService] = useState<IDeterministicWalletService | undefined>(); // Keep a reference to the session in order to send

  // Iniitialise DeterministicWallet and get the uri.
  useEffect(() => {
    if (!setShouldInit) return;
    setShouldInit(false);
    const dwService = DeterministicWalletService({
      walletId,
      handleInitRequest: () =>
        dispatch({
          type: DWActionTypes.CONNECTION_REQUEST
        }),
      handleInit: (session: Wallet) =>
        dispatch({
          type: DWActionTypes.CONNECTION_SUCCESS,
          payload: { session }
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
      handleAccountsUpdate: (accounts: DWAccountDisplay[]) => {
        console.debug('[handleAccountsUpdate]: accounts:', accounts);
        return dispatch({
          type: DWActionTypes.GET_ADDRESSES_UPDATE,
          payload: { accounts }
        });
      },
      handleAccountsError: () =>
        dispatch({
          type: DWActionTypes.GET_ADDRESSES_FAILURE,
          error: { code: DeterministicWalletReducer.errorCodes.GET_ACCOUNTS_FAILED }
        })
    });

    dwService.init(network, walletId);
    //setShouldInit(false);

    setService(dwService);
  }, [setShouldInit]);

  useEffect(() => {
    if (!state.isConnected && state.isInit) {
      setShouldInit(false);
    }
  }, [state.isInit]);

  useEffect(() => {
    if (!service || shouldInit || !state.isConnected || !state.session) return;
    console.debug('[here] service: ', service);

    dpaths.map((dpath) => {
      // @ts-ignore
      service.getAccounts(state.session, dpath, numOfAccountsToCheck, 0, network);
    });
  }, [state.isConnected]);

  const requestConnection = () => setShouldInit(true);

  return {
    state,
    requestConnection
  };
};

export default useDeterministicWallet;
