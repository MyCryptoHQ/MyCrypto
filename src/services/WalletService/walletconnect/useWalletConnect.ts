import { useEffect, useReducer, useState } from 'react';

import { ITxHash, ITxObject, TAddress } from '@types';
import { isSameAddress } from '@utils';
import { useUnmount } from '@vendor';

import { initialState, WcReducer } from './reducer';
import { IUseWalletConnect, IWalletConnectService } from './types';
import { default as WalletConnectService } from './WalletConnectService';

const isExpectedAddress = (received: TAddress, target: TAddress): boolean =>
  isSameAddress(received, target);
const isExpectedNetwork = (received: number, target: number): boolean => received === target;

export function useWalletConnect(autoKill?: boolean): IUseWalletConnect {
  const [state, dispatch] = useReducer(WcReducer, initialState);
  const [shouldConnect, setShouldConnect] = useState(true);
  const [service, setService] = useState<IWalletConnectService | undefined>(); // Keep a reference to the session in order to send

  // Ensure the service is killed when we leave the component.
  useUnmount(() => autoKill && service && service.kill());

  // Initialise walletconnect and get the uri.
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

  const requestSign = async (tx: ITxObject & { from: TAddress }): Promise<string> => {
    const { from, chainId } = tx;
    dispatch({ type: WcReducer.actionTypes.SIGN_REQUEST });

    return new Promise((resolve, reject) => {
      if (!state.detectedAddress || !state.detectedChainId || !service) {
        return reject(
          new Error(`[useWalletConnect]: cannot call requestSign before successful connection`)
        );
      }

      if (!isExpectedAddress(from, state.detectedAddress)) {
        dispatch({
          type: WcReducer.actionTypes.SIGN_FAILURE,
          error: { code: WcReducer.errorCodes.WRONG_ADDRESS }
        });
        reject(new Error('[useWalletConnect]: connected address does not match tx sender address'));
      } else if (!isExpectedNetwork(chainId, state.detectedChainId)) {
        dispatch({
          type: WcReducer.actionTypes.SIGN_FAILURE,
          error: { code: WcReducer.errorCodes.WRONG_NETWORK }
        });
        reject(Error('[useWalletConnect]: network chainId does not match tx chainId'));
      } else {
        return service
          .sendTx(tx)
          .then((txHash: ITxHash) => {
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

  const signMessage = async ({
    msg,
    address
  }: {
    msg: string;
    address: TAddress;
  }): Promise<string> => {
    dispatch({ type: WcReducer.actionTypes.SIGN_REQUEST });
    if (!state.detectedAddress || !state.detectedChainId || !service) {
      throw new Error(`[useWalletConnect]: cannot call signMessage before successful connection`);
    }

    try {
      const signedMsg = await service.signMessage(msg, address);
      dispatch({ type: WcReducer.actionTypes.SIGN_SUCCESS });
      return signedMsg;
    } catch (e) {
      dispatch({
        type: WcReducer.actionTypes.SIGN_FAILURE,
        error: { code: WcReducer.errorCodes.SIGN_REJECTED }
      });
      throw e;
    }
  };

  const requestConnection = () => setShouldConnect(true);

  const kill = async () => {
    if (service) {
      return service.kill();
    }
  };

  return {
    state,
    requestSign,
    requestConnection,
    signMessage,
    kill
  };
}
