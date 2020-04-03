import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Asset, ITxReceipt, Network, WalletId } from 'v2/types';
import {
  GetBalanceResponse,
  GetLastTxResponse,
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse,
  CryptoScamDBService,
  EtherscanService
} from 'v2/services/ApiService';
import { AssetContext, getAssetByUUID } from 'v2/services/Store';

import { SendFormCallbackType } from './types';
import { useScreenSize } from '../../vendor/react-use';
import { WALLETS_CONFIG } from '../../config';

export interface ProtectTxState {
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

export interface ProtectTxContext {
  state: ProtectTxState;
  formCallback: SendFormCallbackType;

  handleTransactionReport(receiverAddress?: string): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goToNextStep(): void;
  goToInitialStepOrFetchReport(receiverAddress?: string): void;
  showHideProtectTx(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: Network): Promise<void>;
  setProtectTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
}

export const protectTxProviderInitialState: ProtectTxState = {
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
  web3WalletName: null,
  mainComponentDisabled: false
};

const numOfSteps = 3;

export const ProtectTxContext = createContext({} as ProtectTxContext);

const ProtectTxProvider: React.FC = ({ children }) => {
  const { assets } = useContext(AssetContext);
  const [state, setState] = useState<ProtectTxState>({ ...protectTxProviderInitialState });
  const { isMdScreen } = useScreenSize();

  const formCallback = useRef<SendFormCallbackType>(() => ({ isValid: false, values: null }));
  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const handleTransactionReport = useCallback(
    async (receiverAddress?: string): Promise<void> => {
      const address = receiverAddress || state.receiverAddress;
      if (!address) return Promise.reject();

      const [
        cryptoScamAddressReportResponse,
        etherscanBalanceReportResponse,
        etherscanLastTxReportResponse
      ] = await Promise.all(
        [
          CryptoScamDBService.check(address),
          EtherscanService.instance.getBalance(address, state.network!.id),
          EtherscanService.instance.getLastTx(address, state.network!.id)
        ].map(p => p.catch(e => e))
      );

      const cryptoScamAddressReport =
        cryptoScamAddressReportResponse instanceof Error
          ? {
              input: address,
              message: '',
              success: false
            }
          : cryptoScamAddressReportResponse;

      const etherscanBalanceReport =
        etherscanBalanceReportResponse instanceof Error ? null : etherscanBalanceReportResponse;

      if (etherscanBalanceReportResponse instanceof Error) {
        console.error(etherscanBalanceReportResponse);
      }

      const etherscanLastTxReport =
        etherscanLastTxReportResponse instanceof Error ? null : etherscanLastTxReportResponse;

      if (etherscanLastTxReportResponse instanceof Error) {
        console.error(etherscanLastTxReportResponse);
      }

      setState((prevState: ProtectTxState) => ({
        ...prevState,
        cryptoScamAddressReport,
        etherscanBalanceReport,
        etherscanLastTxReport
      }));

      return Promise.resolve();
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
    async (receiverAddress: string, network: Network) => {
      if (!receiverAddress && !network) {
        return Promise.reject();
      }

      const asset = getAssetByUUID(assets)(network.baseAsset)!;

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
      state.protectTxShow && !state.protectTxEnabled && state.cryptoScamAddressReport === null;

    setState(prevState => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxShow, state.stepIndex, state.cryptoScamAddressReport, state.protectTxEnabled]);

  const providerState: ProtectTxContext = {
    state,
    formCallback: formCallback.current,

    handleTransactionReport,
    setMainTransactionFormCallback,
    goToNextStep,
    goToInitialStepOrFetchReport,
    showHideProtectTx,
    setReceiverInfo,
    setProtectTxTimeoutFunction,
    invokeProtectTxTimeoutFunction,
    clearProtectTxTimeoutFunction,
    setWeb3Wallet
  };

  return <ProtectTxContext.Provider value={providerState}>{children}</ProtectTxContext.Provider>;
};

export default ProtectTxProvider;
