import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';

import { Asset, ITxReceipt, Network, WalletId, IFormikFields, TAddress } from '@types';
import {
  GetBalanceResponse,
  GetTxResponse,
  EtherscanService,
  GetTokenTxResponse
} from '@services/ApiService';
import { AssetContext, getAssetByUUID, StoreContext } from '@services/Store';
import { useFeatureFlags } from '@services';
import { NansenService, NansenServiceEntry } from '@services/ApiService/Nansen';
import { useScreenSize } from '@utils';
import { WALLETS_CONFIG } from '@config';

import { PTXReport } from './types';
import { getNansenReportType, getLastTx, getBalance } from './utils';

export interface IFeeAmount {
  amount: BigNumber | null;
  fee: BigNumber | null;
  rate: number | null;
}

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
  feeAmount: IFeeAmount;
}

export interface ProtectTxContext {
  readonly protectTxFeatureFlag: boolean;
  state: ProtectTxState;
  updateFormValues(values: IFormikFields): void;
  handleTransactionReport(receiverAddress?: string): Promise<void>;
  goToNextStep(): void;
  goToInitialStepOrFetchReport(receiverAddress?: string, network?: Network): void;
  showHideProtectTx(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: Network): Promise<void>;
  setFeeAmount(feeAmount: IFeeAmount): void;
  setProtectTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
  getReport(): PTXReport;
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
  mainComponentDisabled: false,
  feeAmount: { amount: null, fee: null, rate: null }
};

export const ProtectTxContext = createContext({} as ProtectTxContext);

const ProtectTxProvider: React.FC = ({ children }) => {
  const { isMyCryptoMember } = useContext(StoreContext);
  const numOfSteps = isMyCryptoMember ? 2 : 3;
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

  const setFeeAmount = (feeAmount: IFeeAmount) => {
    setState((prevState) => ({
      ...prevState,
      feeAmount
    }));
  };

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

  const getReport = useCallback(() => {
    const address = state.receiverAddress as TAddress;
    const {
      nansenAddressReport,
      etherscanLastTxReport,
      etherscanLastTokenTxReport,
      etherscanBalanceReport
    } = state;
    const labels = nansenAddressReport ? nansenAddressReport.label : null;
    const status = labels ? getNansenReportType(labels) : null;
    const lastTx = getLastTx(etherscanLastTxReport, etherscanLastTokenTxReport, address);
    const balance = getBalance(etherscanBalanceReport);
    return { address, status, labels, lastTransaction: lastTx, balance, asset: state.asset! };
  }, [state]);

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

  const { IS_ACTIVE_FEATURE } = useFeatureFlags();

  const protectTxFeatureFlag = IS_ACTIVE_FEATURE.PROTECT_TX;

  const providerState: ProtectTxContext = {
    protectTxFeatureFlag,
    state,
    updateFormValues,
    handleTransactionReport,
    goToNextStep,
    goToInitialStepOrFetchReport,
    showHideProtectTx,
    setReceiverInfo,
    setFeeAmount,
    setProtectTxTimeoutFunction,
    invokeProtectTxTimeoutFunction,
    clearProtectTxTimeoutFunction,
    setWeb3Wallet,
    getReport
  };

  return <ProtectTxContext.Provider value={providerState}>{children}</ProtectTxContext.Provider>;
};

export default ProtectTxProvider;
