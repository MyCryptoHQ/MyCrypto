import { createContext, FC, useCallback, useEffect, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';

import { WALLETS_CONFIG } from '@config';
import {
  EtherscanService,
  GetBalanceResponse,
  GetTokenTxResponse,
  GetTxResponse
} from '@services/ApiService';
import { NansenService, NansenServiceEntry } from '@services/ApiService/Nansen';
import { useFeatureFlags } from '@services/FeatureFlag';
import { getAssetByUUID, useAssets } from '@services/Store';
import { getIsMyCryptoMember, useSelector } from '@store';
import { Asset, IFormikFields, ITxReceipt, Network, TAddress, WalletId } from '@types';

import { PTXReport } from './types';
import { getBalance, getLastTx, getNansenReportType } from './utils';

export interface IFeeAmount {
  amount: BigNumber | null;
  fee: BigNumber | null;
  rate: number | null;
}

export interface ProtectTxState {
  stepIndex: number;
  protectTxShow: boolean;
  enabled: boolean;
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
  isPTXFree: boolean;
}

export interface ProtectTxContext {
  readonly protectTxFeatureFlag: boolean;
  state: ProtectTxState;
  updateFormValues(values: IFormikFields): void;
  handleTransactionReport(receiverAddress?: string, network?: Network): Promise<void>;
  goToNextStep(): void;
  goToInitialStepOrFetchReport(receiverAddress?: string, network?: Network): void;
  showHideProtectTx(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: Network): void;
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
  enabled: false,
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
  feeAmount: { amount: null, fee: null, rate: null },
  isPTXFree: false
};

export const ProtectTxContext = createContext({} as ProtectTxContext);

const ProtectTxProvider: FC = ({ children }) => {
  const isMyCryptoMember = useSelector(getIsMyCryptoMember);
  // FREE FOR NOW
  const isPTXFree = isMyCryptoMember || true;
  const numOfSteps = isPTXFree ? 2 : 3;
  const { assets } = useAssets();
  const [state, setState] = useState<ProtectTxState>({
    ...protectTxProviderInitialState,
    isPTXFree
  });

  const protectionTxTimeoutFunction = useRef<((cb: () => ITxReceipt) => void) | null>(null);

  const handleTransactionReport = useCallback(
    async (receiverAddress?: string, n?: Network): Promise<void> => {
      const address = receiverAddress ?? state.receiverAddress;
      const network = n ?? state.network;
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

      const nansenAddressReport: NansenServiceEntry | null = (() => {
        if (
          nansenAddressReportResponse instanceof Error ||
          !nansenAddressReportResponse ||
          nansenAddressReportResponse?.error
        ) {
          return null;
        } else if (nansenAddressReportResponse.result.labels.length === 0) {
          return { labels: [] };
        }
        return nansenAddressReportResponse.result;
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
    [state.receiverAddress]
  );

  const updateFormValues = (values: IFormikFields) => {
    setState((prevState) => ({ ...prevState, formValues: values }));
  };

  const goToNextStep = () => {
    setState((prevState) => {
      const { stepIndex } = prevState;

      return {
        ...prevState,
        stepIndex: (stepIndex + 1) % numOfSteps
      };
    });
  };

  const goToInitialStepOrFetchReport = useCallback(
    (receiverAddress?: string, network?: Network) => {
      if (state.enabled || (isPTXFree && state.stepIndex > 0)) {
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
    [state, handleTransactionReport]
  );

  const showHideProtectTx = (showOrHide: boolean) => {
    setState((prevState) => ({
      ...prevState,
      protectTxShow: showOrHide
    }));
  };

  const setReceiverInfo = (receiverAddress: string, network: Network) => {
    if (!receiverAddress && !network) {
      return;
    }

    const asset = getAssetByUUID(assets)(network.baseAsset)!;

    setState((prevState) => ({
      ...prevState,
      receiverAddress,
      network,
      asset
    }));
  };

  const setFeeAmount = (feeAmount: IFeeAmount) => {
    setState((prevState) => ({
      ...prevState,
      feeAmount
    }));
  };

  const setProtectTxTimeoutFunction = useCallback(
    (cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void) => {
      const { enabled, isWeb3Wallet } = state;
      if (enabled && !isWeb3Wallet) {
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

  const setWeb3Wallet = (isWeb3Wallet: boolean, walletTypeId: WalletId | null = null) => {
    const web3WalletType = walletTypeId ? WALLETS_CONFIG[walletTypeId].name : null;

    setState((prevState) => ({
      ...prevState,
      isWeb3Wallet,
      web3WalletName: web3WalletType
    }));
  };

  const getReport = useCallback(() => {
    const address = state.receiverAddress as TAddress;
    const {
      nansenAddressReport,
      etherscanLastTxReport,
      etherscanLastTokenTxReport,
      etherscanBalanceReport
    } = state;
    const labels = nansenAddressReport ? nansenAddressReport.labels : null;
    const status = labels ? getNansenReportType(labels) : null;
    const lastTx = getLastTx(etherscanLastTxReport, etherscanLastTokenTxReport, address);
    const balance = getBalance(etherscanBalanceReport);
    return { address, status, labels, lastTransaction: lastTx, balance, asset: state.asset! };
  }, [state]);

  useEffect(() => {
    if (state.stepIndex === numOfSteps - 1) {
      setState((prevState) => ({
        ...prevState,
        enabled: true
      }));
    }
  }, [state.stepIndex]);

  useEffect(() => {
    const isDisabled = state.protectTxShow && !state.enabled && state.nansenAddressReport === null;

    setState((prevState) => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxShow, state.stepIndex, state.nansenAddressReport, state.enabled]);

  const { isFeatureActive } = useFeatureFlags();

  const protectTxFeatureFlag = isFeatureActive('PROTECT_TX');

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
