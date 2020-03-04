import {
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse
} from '../../services/ApiService/CryptoScamDB/types';
import { TUseStateReducerFactory } from '../../utils';
import { useCallback, useContext, useEffect, useRef } from 'react';
import CryptoScamDBService from '../../services/ApiService/CryptoScamDB/CryptoScamDB';
import { SendFormCallbackType } from './types';
import { Asset, ITxReceipt, Network, NetworkId } from '../../types';
import { GetBalanceResponse, GetLastTxResponse } from '../../services/ApiService/Etherscan/types';
import { EtherscanService } from 'v2/services/ApiService/Etherscan';
import { getNetworkById, NetworkContext } from '../../services/Store/Network';
import { AssetContext, getAssetByUUID } from '../../services/Store/Asset';

export interface WithProtectState {
  stepIndex: number;
  protectTxEnabled: boolean;
  cryptoScamAddressReport: CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse | null;
  etherscanBalanceReport: GetBalanceResponse | null;
  etherscanLastTxReport: GetLastTxResponse | null;
  mainComponentDisabled: boolean;
  receiverAddress: string | null;
  network: Network | null;
  asset: Asset | null;
}

export interface WithProtectApiFactory {
  withProtectState: WithProtectState;
  formCallback: SendFormCallbackType;

  handleTransactionReport(): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goOnNextStep(): void;
  goOnInitialStep(): void;
  showHideTransactionProtection(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: NetworkId | null): Promise<void>;
  setProtectionTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectionTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectionTxTimeoutFunction(): void;
}

export const WithProtectInitialState: Partial<WithProtectState> = {
  stepIndex: 0,
  protectTxEnabled: false,
  receiverAddress: null,
  network: null,
  cryptoScamAddressReport: null,
  etherscanBalanceReport: null,
  etherscanLastTxReport: null,
  asset: null
};

const numOfSteps = 3;

const WithProtectConfigFactory: TUseStateReducerFactory<
  WithProtectState,
  WithProtectApiFactory
> = ({ state, setState }) => {
  const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));
  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);

  useEffect(() => {
    const isDisabled =
      state.protectTxEnabled &&
      state.stepIndex !== numOfSteps - 1 &&
      state.cryptoScamAddressReport === null;

    setState(prevState => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxEnabled, state.stepIndex, state.cryptoScamAddressReport]);

  const handleTransactionReport = useCallback(async (): Promise<void> => {
    if (!state.receiverAddress) return;

    try {
      const cryptoScamAddressReport = await CryptoScamDBService.instance.check(
        state.receiverAddress
      );
      const etherscanBalanceReport = await EtherscanService.instance.getBalance(
        state.receiverAddress,
        state.network!.id
      );
      const etherscanLastTxReport = await EtherscanService.instance.getLastTx(
        state.receiverAddress,
        state.network!.id
      );

      setState((prevState: WithProtectState) => ({
        ...prevState,
        cryptoScamAddressReport,
        etherscanBalanceReport,
        etherscanLastTxReport
      }));

      return Promise.resolve();
    } catch (e) {
      console.error(e);
      setState((prevState: WithProtectState) => ({
        ...prevState,
        cryptoScamAddressReport: {
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
      cryptoScamAddressReport: null
    }));
  }, [setState]);

  const showHideTransactionProtection = useCallback(
    (showOrHide: boolean) => {
      setState(prevState => ({
        ...prevState,
        protectTxEnabled: showOrHide
      }));
    },
    [setState]
  );

  const setReceiverInfo = useCallback(
    async (receiverAddress: string, networkId: NetworkId | null = null) => {
      if (!receiverAddress) {
        return Promise.reject();
      }

      let network: Network | null = null;
      if (networkId) {
        network = getNetworkById(networkId, networks);
      }

      let asset: Asset | null = null;
      if (network) {
        asset = getAssetByUUID(assets)(network.baseAsset)!;
      }

      setState(prevState => ({
        ...prevState,
        receiverAddress,
        network,
        asset
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
    setReceiverInfo,
    setProtectionTxTimeoutFunction,
    invokeProtectionTxTimeoutFunction,
    clearProtectionTxTimeoutFunction
  };
};

export { WithProtectConfigFactory };
