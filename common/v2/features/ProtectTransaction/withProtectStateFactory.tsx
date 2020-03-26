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
import useMediaQuery from 'v2/vendor/react-use/useMediaQuery';
import { BREAK_POINTS } from 'v2/theme';
import { WALLETS_CONFIG } from 'v2/config';

import { SendFormCallbackType } from './types';

export interface WithProtectState {
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

export interface WithProtectApiFactory {
  withProtectState: WithProtectState;
  formCallback: SendFormCallbackType;

  handleTransactionReport(receiverAddress?: string): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goOnNextStep(): void;
  goOnInitialStepOrFetchReport(receiverAddress?: string): void;
  showHideTransactionProtection(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: NetworkId | null): Promise<void>;
  setProtectionTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectionTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectionTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
}

export const WithProtectInitialState: Partial<WithProtectState> = {
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

const WithProtectConfigFactory: TUseStateReducerFactory<
  WithProtectState,
  WithProtectApiFactory
> = ({ state, setState }) => {
  const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));
  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const { networks } = useContext(NetworkContext);
  const { assets } = useContext(AssetContext);

  const isMdScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_MD})`);

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
        const cryptoScamAddressReport = await CryptoScamDBService.instance.check(address);

        setState((prevState: WithProtectState) => ({
          ...prevState,
          cryptoScamAddressReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectState) => ({
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

        setState((prevState: WithProtectState) => ({
          ...prevState,
          etherscanBalanceReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectState) => ({
          ...prevState,
          etherscanBalanceReport: null
        }));
      }

      try {
        const etherscanLastTxReport = await EtherscanService.instance.getLastTx(
          address,
          state.network!.id
        );

        setState((prevState: WithProtectState) => ({
          ...prevState,
          etherscanLastTxReport
        }));
      } catch (e) {
        numOfErrors++;
        console.error(e);
        setState((prevState: WithProtectState) => ({
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

  const goOnNextStep = useCallback(() => {
    setState(prevState => {
      const { stepIndex } = prevState;

      return {
        ...prevState,
        stepIndex: (stepIndex + 1) % numOfSteps
      };
    });
  }, [setState]);

  const goOnInitialStepOrFetchReport = useCallback(
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

  const showHideTransactionProtection = useCallback(
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

  const setProtectionTxTimeoutFunction = useCallback(
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
    goOnNextStep,
    goOnInitialStepOrFetchReport,
    showHideTransactionProtection,
    formCallback: formCallback.current,
    setReceiverInfo,
    setProtectionTxTimeoutFunction,
    invokeProtectionTxTimeoutFunction,
    clearProtectionTxTimeoutFunction,
    setWeb3Wallet
  };
};

export { WithProtectConfigFactory };
