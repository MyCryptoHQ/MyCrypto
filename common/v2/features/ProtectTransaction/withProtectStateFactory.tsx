import {
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse
} from '../../services/ApiService/CryptoScamDB/types';
import { TUseStateReducerFactory } from '../../utils';
import { useCallback, useEffect, useRef } from 'react';
import CryptoScamDBService from '../../services/ApiService/CryptoScamDB/CryptoScamDB';
import { SendFormCallbackType } from './types';
import { ITxReceipt } from '../../types';

export interface WithProtectState {
  stepIndex: number;
  protectTxEnabled: boolean;
  txReport: CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse | null;
  mainComponentDisabled: boolean;
  receiverAddress: string | null;
}

export interface WithProtectApiFactory {
  withProtectState: WithProtectState;
  formCallback: SendFormCallbackType;

  handleTransactionReport(): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goOnNextStep(): void;
  goOnInitialStep(): void;
  showHideTransactionProtection(showOrHide: boolean): void;
  setReceiverAddress(receiverAddress: string): Promise<void>;
  setProtectionTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectionTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectionTxTimeoutFunction(): void;
}

export const WithProtectInitialState: Partial<WithProtectState> = {
  stepIndex: 0,
  protectTxEnabled: false,
  receiverAddress: null
};

const numOfSteps = 3;

const WithProtectConfigFactory: TUseStateReducerFactory<
  WithProtectState,
  WithProtectApiFactory
> = ({ state, setState }) => {
  const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));
  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  useEffect(() => {
    const isDisabled =
      state.protectTxEnabled && state.stepIndex !== numOfSteps - 1 && state.txReport === null;

    setState(prevState => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxEnabled, state.stepIndex, state.txReport]);

  const handleTransactionReport = useCallback(async (): Promise<void> => {
    if (!state.receiverAddress) return;

    try {
      const txReport = await CryptoScamDBService.instance.check(state.receiverAddress);

      setState((prevState: WithProtectState) => ({
        ...prevState,
        txReport
      }));

      return Promise.resolve();
    } catch (e) {
      console.error(e);
      setState((prevState: WithProtectState) => ({
        ...prevState,
        txReport: {
          input: prevState.receiverAddress,
          message: '',
          success: false
        } as CryptoScamDBNoInfoResponse
      }));
    }

    return Promise.reject();
  }, [state.receiverAddress, setState]);

  const setMainTransactionFormCallback = useCallback(
    (callback: SendFormCallbackType) => {
      formCallback.current = callback;
    },
    [formCallback]
  );

  const goOnNextStep = useCallback(() => {
    setState(prevState => {
      const { stepIndex } = prevState;

      return {
        ...prevState,
        stepIndex: (stepIndex + 1) % numOfSteps
      };
    });
  }, [setState]);

  const goOnInitialStep = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      stepIndex: 0,
      txReport: null
    }));
  }, [setState]);

  const showHideTransactionProtection = useCallback(
    (showOrHide: boolean) => {
      // TODO: Refactor this
      const contentPanel = document.querySelector('[class^=ContentPanel__ContentPanelWrapper]');

      if (showOrHide) {
        if (contentPanel && !contentPanel.classList.contains('has-side-panel')) {
          contentPanel.classList.add('has-side-panel');
        }
        setState(prevState => ({
          ...prevState,
          protectTxEnabled: true
        }));
      } else {
        if (contentPanel && contentPanel.classList.contains('has-side-panel')) {
          contentPanel.classList.remove('has-side-panel');
        }
        setState(prevState => ({
          ...prevState,
          protectTxEnabled: false
        }));
      }
    },
    [setState]
  );

  const setReceiverAddress = useCallback(
    async (receiverAddress: string) => {
      if (!receiverAddress) {
        return Promise.reject();
      }

      setState(prevState => ({
        ...prevState,
        receiverAddress
      }));

      return Promise.resolve();
    },
    [setState]
  );

  const setProtectionTxTimeoutFunction = useCallback(
    (cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void) => {
      const { protectTxEnabled } = state;
      // In case when protected transaction is not visible, just invoke cb function
      if (protectTxEnabled) {
        protectionTxTimeoutFunction.current = cb;
      } else {
        if (cb) {
          cb();
        }
      }
    },
    [protectionTxTimeoutFunction, state]
  );

  const invokeProtectionTxTimeoutFunction = useCallback(
    cb => {
      if (protectionTxTimeoutFunction.current) {
        protectionTxTimeoutFunction.current(cb);
      }
      protectionTxTimeoutFunction.current = null;
    },
    [protectionTxTimeoutFunction]
  );

  const clearProtectionTxTimeoutFunction = useCallback(() => {
    protectionTxTimeoutFunction.current = null;
  }, [protectionTxTimeoutFunction]);

  return {
    withProtectState: state,
    handleTransactionReport,
    setMainTransactionFormCallback,
    goOnNextStep,
    goOnInitialStep,
    showHideTransactionProtection,
    formCallback: formCallback.current,
    setReceiverAddress,
    setProtectionTxTimeoutFunction,
    invokeProtectionTxTimeoutFunction,
    clearProtectionTxTimeoutFunction
  };
};

export { WithProtectConfigFactory };
