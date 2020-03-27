import { useCallback, useContext, useEffect, useRef } from 'react';

import { TUseStateReducerFactory } from 'v2/utils';
import { Asset, ITxReceipt, Network, NetworkId, WalletId } from 'v2/types';
import {
  GetBalanceResponse,
  GetLastTxResponse,
  EtherscanService,
  CryptoScamDBService,
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse
} from 'v2/services/ApiService';
import { getNetworkById, NetworkContext, AssetContext, getAssetByUUID } from 'v2/services/Store';
import { useScreenSize } from 'v2/vendor';
import { WALLETS_CONFIG } from 'v2/config';

import { SendFormCallbackType } from './types';

export interface WithProtectTxState {
  stepIndex: number;
  protectTxShow: boolean;
  protectTxEnabled: boolean;
  cryptoScamAddressReport: CryptoScamDBNoInfoResponse | CryptoScamDBInfoResponse | null;
  etherscanBalanceReport: GetBalanceResponse | null;
  etherscanLastTxReport: GetLastTxResponse | null;
  mainComponentDisabled: boolean;
  receiverAddress: string | null;
  network: Network | null;
  asset: Asset | null;
  isWeb3Wallet: boolean;
  web3WalletName: string | null;
}

export interface WithProtectTxApiFactory {
  withProtectState: WithProtectTxState;
  formCallback: SendFormCallbackType;

  handleTransactionReport(receiverAddress?: string): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goToNextStep(): void;
  goToInitialStepOrFetchReport(receiverAddress?: string): void;
  showHideProtectTx(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: NetworkId | null): Promise<void>;
  setProtectTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
}

export const withProtectTxInitialState: Partial<WithProtectTxState> = {
  stepIndex: 0,
  protectTxShow: false,
  protectTxEnabled: false,
  receiverAddress: null,
  network: null,
  cryptoScamAddressReport: null,
  etherscanBalanceReport: null,
  etherscanLastTxReport: null,
  asset: null,
  isWeb3Wallet: false,
  web3WalletName: null
};

const numOfSteps = 3;

const WithProtectTxConfigFactory: TUseStateReducerFactory<
  WithProtectTxState,
  WithProtectTxApiFactory
> = ({ state, setState }) => {
  const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));
  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);

  const { isMdScreen } = useScreenSize();

  useEffect(() => {
    // Show tx protect in case of window resize
    if (state.protectTxEnabled) {
      setState(prevState => ({
        ...prevState,
        protectTxShow: isMdScreen
      }));
    }
  }, [isMdScreen, state.protectTxEnabled]);

  useEffect(() => {
    if (state.stepIndex === numOfSteps - 1) {
      setState(prevState => ({
        ...prevState,
        protectTxEnabled: true
      }));
    }
  }, [state.stepIndex]);

  useEffect(() => {
    const isDisabled =
      state.protectTxShow &&
      state.stepIndex !== numOfSteps - 1 &&
      state.cryptoScamAddressReport === null;

    setState(prevState => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxShow, state.stepIndex, state.cryptoScamAddressReport]);

  const handleTransactionReport = useCallback(
    async (receiverAddress?: string): Promise<void> => {
      const address = receiverAddress || state.receiverAddress;
      if (!address) return Promise.reject();

      let numOfErrors = 0;

      try {
        const cryptoScamAddressReport = await CryptoScamDBService.check(address);

        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          cryptoScamAddressReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          cryptoScamAddressReport: {
            input: address,
            message: '',
            success: false
          } as CryptoScamDBNoInfoResponse
        }));
      }

      try {
        const etherscanBalanceReport = await EtherscanService.instance.getBalance(
          address,
          state.network!.id
        );

        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          etherscanBalanceReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          etherscanBalanceReport: null
        }));
      }

      try {
        const etherscanLastTxReport = await EtherscanService.instance.getLastTx(
          address,
          state.network!.id
        );

        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          etherscanLastTxReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectTxState) => ({
          ...prevState,
          etherscanLastTxReport: null
        }));
      }

      if (numOfErrors < 3) {
        return Promise.resolve();
      }
      return Promise.reject();
    },
    [state.receiverAddress, setState]
  );

  const setMainTransactionFormCallback = useCallback(
    (callback: SendFormCallbackType) => {
      formCallback.current = callback;
    },
    [formCallback]
  );

  const goToNextStep = useCallback(() => {
    setState(prevState => {
      const { stepIndex } = prevState;

      return {
        ...prevState,
        stepIndex: (stepIndex + 1) % numOfSteps
      };
    });
  }, [setState]);

  const goToInitialStepOrFetchReport = useCallback(
    (receiverAddress?: string) => {
      if (state.protectTxEnabled) {
        setState(prevState => ({
          ...prevState,
          cryptoScamAddressReport: null,
          etherscanLastTxReport: null,
          etherscanBalanceReport: null,
          receiverAddress: receiverAddress ? receiverAddress : prevState.receiverAddress
        }));

        handleTransactionReport(receiverAddress);
      } else {
        setState(prevState => ({
          ...prevState,
          stepIndex: 0,
          cryptoScamAddressReport: null,
          etherscanLastTxReport: null,
          etherscanBalanceReport: null
        }));
      }
    },
    [setState, state, handleTransactionReport]
  );

  const showHideProtectTx = useCallback(
    (showOrHide: boolean) => {
      setState(prevState => ({
        ...prevState,
        protectTxShow: showOrHide
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

  const setProtectTxTimeoutFunction = useCallback(
    (cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void) => {
      const { protectTxEnabled, isWeb3Wallet } = state;
      if (protectTxEnabled && !isWeb3Wallet) {
        protectionTxTimeoutFunction.current = cb;
      } else {
        if (cb) {
          cb();
        }
      }
    },
    [protectionTxTimeoutFunction, state]
  );

  const invokeProtectTxTimeoutFunction = useCallback(
    cb => {
      if (protectionTxTimeoutFunction.current) {
        protectionTxTimeoutFunction.current(cb);
      }
      protectionTxTimeoutFunction.current = null;
    },
    [protectionTxTimeoutFunction]
  );

  const clearProtectTxTimeoutFunction = useCallback(() => {
    protectionTxTimeoutFunction.current = null;
  }, [protectionTxTimeoutFunction]);

  const setWeb3Wallet = useCallback(
    (isWeb3Wallet: boolean, walletTypeId: WalletId | null = null) => {
      const web3WalletType = walletTypeId ? WALLETS_CONFIG[walletTypeId].name : null;

      setState(prevState => ({
        ...prevState,
        isWeb3Wallet,
        web3WalletName: web3WalletType
      }));
    },
    [setState]
  );

  return {
    withProtectState: state,
    handleTransactionReport,
    setMainTransactionFormCallback,
    goToNextStep,
    goToInitialStepOrFetchReport,
    showHideProtectTx,
    formCallback: formCallback.current,
    setReceiverInfo,
    setProtectTxTimeoutFunction,
    invokeProtectTxTimeoutFunction,
    clearProtectTxTimeoutFunction,
    setWeb3Wallet
  };
};

export { WithProtectTxConfigFactory };
