import { useState, useReducer, useEffect } from 'react';

import { TAddress, ITxObject } from 'v2/types';
import { useUnmount } from 'v2/vendor';

import { ITxData, default as WalletConnectService } from './WalletConnectService';
import { initialState, WcReducer } from './reducer';

const isExpectedAddress = (received: TAddress, target: TAddress): boolean =>
  received.toLowerCase() === target.toLowerCase();
const isExpectedNetwork = (received: number, target: number): boolean => received === target;

export function useWalletConnect() {
  const [state, dispatch] = useReducer(WcReducer, initialState);
  const [shouldConnect, setShouldConnect] = useState(true);
  const [service, setService] = useState(); // Keep a reference to the session in order to send

  // Ensure the service is killed when we leave the component.
  useUnmount(() => service.kill());

  // Iniitialise walletconnect and get the uri.
  useEffect(() => {
    if (!shouldConnect) return;

    const wcService = WalletConnectService({
      handleInit: (uri: string) =>
        dispatch({
          type: WcReducer.actionTypes.INIT_SUCCESS,
          payload: { uri }
        }),
      handleConnect: ({ address, chainId }) =>
        dispatch({
          type: WcReducer.actionTypes.CONNECTION_SUCCESS,
          payload: { address, chainId }
        }),
      handleUpdate: ({ address, chainId }) =>
        dispatch({
          type: WcReducer.actionTypes.CONNECTION_UPDATE,
          payload: { address, chainId }
        }),
      handleReject: () =>
        dispatch({
          type: WcReducer.actionTypes.CONNECTION_FAILURE,
          error: { code: WcReducer.errorCodes.CONNECTION_REJECTED }
        }),
      handleDisconnect: () =>
        dispatch({
          type: WcReducer.actionTypes.CONNECTION_FAILURE,
          error: { code: WcReducer.errorCodes.CONNECTION_REJECTED }
        }),
      handleError: () =>
        dispatch({
          type: WcReducer.actionTypes.INIT_FAILURE,
          error: { code: WcReducer.errorCodes.CONNECTION_REJECTED }
        })
    });

    wcService.init();
    setShouldConnect(false);
    setService(wcService);
  }, [shouldConnect]);

  const requestSign = async (tx: ITxObject & { from: TAddress }) => {
    const { from, chainId } = tx;
    dispatch({ type: WcReducer.actionTypes.SIGN_REQUEST });

    return new Promise((resolve, reject) => {
      if (!state.detectedAddress || !state.detectedChainId) {
        reject(
          new Error(`[useWalletConnect]: cannot call requestSign before successful connection`)
        );
      }

      if (!isExpectedAddress(from, state.detectedAddress!)) {
        dispatch({
          type: WcReducer.actionTypes.SIGN_FAILURE,
          error: { code: WcReducer.errorCodes.WRONG_ADDRESS }
        });
        reject(new Error('[useWalletConnect]: connected address does not match tx sender address'));
      } else if (!isExpectedNetwork(chainId, state.detectedChainId!)) {
        dispatch({
          type: WcReducer.actionTypes.SIGN_FAILURE,
          error: { code: WcReducer.errorCodes.WRONG_NETWORK }
        });
        reject(Error('[useWalletConnect]: network chainId does not match tx chainId'));
      } else {
        return service
          .sendTx(tx)
          .then((txHash: ITxData) => {
            dispatch({ type: WcReducer.actionTypes.SIGN_SUCCESS });
            resolve(txHash);
          })
          .catch((err: Error) => {
            dispatch({
              type: WcReducer.actionTypes.SIGN_FAILURE,
              error: { code: WcReducer.errorCodes.SIGN_REJECTED }
            });
            reject(err);
          });
      }
    });
  };

  const requestConnection = () => setShouldConnect(true);

  return {
    state,
    requestSign,
    requestConnection
  };
}
