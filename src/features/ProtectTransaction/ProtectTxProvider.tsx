import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Asset, ITxReceipt, Network, WalletId, IFormikFields } from '@types';
import {
  GetBalanceResponse,
  GetTxResponse,
  EtherscanService,
  GetTokenTxResponse
} from '@services/ApiService';
import { AssetContext, getAssetByUUID, StoreContext } from '@services/Store';
import { useScreenSize } from '@utils';

import { WALLETS_CONFIG } from '../../config';
import { NansenService, NansenServiceEntry } from '@services/ApiService/Nansen';

export interface ProtectTxState {
  stepIndex: number;
  protectTxShow: boolean;
  protectTxEnabled: boolean;
  nansenAddressReport: NansenServiceEntry | null;
  etherscanBalanceReport: GetBalanceResponse | null;
  etherscanLastTokenTxReport: GetTokenTxResponse | null;
  etherscanLastTxReport: GetTxResponse | null;
  mainComponentDisabled: boolean;
  receiverAddress: string | null;
  network: Network | null;
  asset: Asset | null;
  isWeb3Wallet: boolean;
  web3WalletName: string | null;
  formValues?: IFormikFields;
}

export interface ProtectTxContext {
  state: ProtectTxState;
  updateFormValues(values: IFormikFields): void;
  handleTransactionReport(receiverAddress?: string): Promise<void>;
  goToNextStep(): void;
  goToInitialStepOrFetchReport(receiverAddress?: string, network?: Network): void;
  showHideProtectTx(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: Network): Promise<void>;
  setProtectTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
}

export const protectTxProviderInitialState: ProtectTxState = {
  stepIndex: 0,
  formValues: undefined,
  protectTxShow: false,
  protectTxEnabled: false,
  receiverAddress: null,
  network: null,
  nansenAddressReport: null,
  etherscanBalanceReport: null,
  etherscanLastTxReport: null,
  etherscanLastTokenTxReport: null,
  asset: null,
  isWeb3Wallet: false,
  web3WalletName: null,
  mainComponentDisabled: false
};

const numOfSteps = 3;

export const ProtectTxContext = createContext({} as ProtectTxContext);

const ProtectTxProvider: React.FC = ({ children }) => {
  const { isMyCryptoMember } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const [state, setState] = useState<ProtectTxState>({ ...protectTxProviderInitialState });
  const { isMdScreen } = useScreenSize();

  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const handleTransactionReport = useCallback(
    async (receiverAddress?: string, n?: Network): Promise<void> => {
      const address = receiverAddress || state.receiverAddress;
      const network = n || state.network;
      if (!address) return Promise.reject();

      const [
        nansenAddressReportResponse,
        etherscanBalanceReportResponse,
        etherscanLastTokenTxReportResponse,
        etherscanLastTxReportResponse
      ] = await Promise.all([
        NansenService.check(address).catch((e) => e),
        EtherscanService.instance.getBalance(address, network!.id).catch((e) => e),
        EtherscanService.instance.getTokenTransactions(address, network!.id).catch((e) => e),
        EtherscanService.instance.getTransactions(address, network!.id).catch((e) => e)
      ]);

      const nansenAddressReport = (() => {
        if (nansenAddressReportResponse instanceof Error) {
          return null;
        } else if (nansenAddressReportResponse.page.length === 0) {
          return { address, label: [] };
        }
        return nansenAddressReportResponse.page[0];
      })();

      const etherscanBalanceReport =
        etherscanBalanceReportResponse instanceof Error ? null : etherscanBalanceReportResponse;

      if (etherscanBalanceReportResponse instanceof Error) {
        console.error(etherscanBalanceReportResponse);
      }

      const etherscanLastTokenTxReport =
        etherscanLastTokenTxReportResponse instanceof Error
          ? null
          : etherscanLastTokenTxReportResponse;

      const etherscanLastTxReport =
        etherscanLastTxReportResponse instanceof Error ? null : etherscanLastTxReportResponse;

      if (etherscanLastTxReportResponse instanceof Error) {
        console.error(etherscanLastTxReportResponse);
      }

      setState((prevState: ProtectTxState) => ({
        ...prevState,
        nansenAddressReport,
        etherscanBalanceReport,
        etherscanLastTokenTxReport,
        etherscanLastTxReport
      }));

      return Promise.resolve();
    },
    [state.receiverAddress, setState]
  );

  const updateFormValues = (values: IFormikFields) => {
    setState((prevState) => ({ ...prevState, formValues: values }));
  };

  const goToNextStep = useCallback(() => {
    setState((prevState) => {
      const { stepIndex } = prevState;

      return {
        ...prevState,
        stepIndex: (stepIndex + 1) % numOfSteps
      };
    });
  }, [setState]);

  const goToInitialStepOrFetchReport = useCallback(
    (receiverAddress?: string, network?: Network) => {
      if (state.protectTxEnabled || (isMyCryptoMember && state.stepIndex > 0)) {
        setState((prevState) => ({
          ...prevState,
          cryptoScamAddressReport: null,
          etherscanLastTxReport: null,
          etherscanBalanceReport: null,
          receiverAddress: receiverAddress ? receiverAddress : prevState.receiverAddress,
          network: network ? network : prevState.network
        }));

        handleTransactionReport(receiverAddress, network);
      } else {
        setState((prevState) => ({
          ...prevState,
          stepIndex: 0,
          cryptoScamAddressReport: null,
          etherscanLastTxReport: null,
          etherscanBalanceReport: null,
          receiverAddress: receiverAddress ? receiverAddress : prevState.receiverAddress,
          network: network ? network : prevState.network
        }));
      }
    },
    [setState, state, handleTransactionReport]
  );

  const showHideProtectTx = useCallback(
    (showOrHide: boolean) => {
      setState((prevState) => ({
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

      setState((prevState) => ({
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
    (cb) => {
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

      setState((prevState) => ({
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
      setState((prevState) => ({
        ...prevState,
        protectTxShow: isMdScreen
      }));
    }
  }, [isMdScreen, state.protectTxEnabled]);

  useEffect(() => {
    if (state.stepIndex === numOfSteps - 1) {
      setState((prevState) => ({
        ...prevState,
        protectTxEnabled: true
      }));
    }
  }, [state.stepIndex]);

  useEffect(() => {
    const isDisabled =
      state.protectTxShow && !state.protectTxEnabled && state.nansenAddressReport === null;

    setState((prevState) => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxShow, state.stepIndex, state.nansenAddressReport, state.protectTxEnabled]);

  const providerState: ProtectTxContext = {
    state,
    updateFormValues,
    handleTransactionReport,
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
