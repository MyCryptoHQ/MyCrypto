import {
  CryptoScamDBInfoResponse,
  CryptoScamDBNoInfoResponse
} from '../../services/ApiService/CryptoScamDB/types';
import { TUseStateReducerFactory } from '../../utils';
import { useCallback, useContext, useEffect, useRef } from 'react';
import CryptoScamDBService from '../../services/ApiService/CryptoScamDB/CryptoScamDB';
import { SendFormCallbackType } from './types';
import { Asset, ITxReceipt, Network, NetworkId, WalletId } from '../../types';
import { GetBalanceResponse, GetLastTxResponse } from '../../services/ApiService/Etherscan/types';
import { EtherscanService } from 'v2/services/ApiService/Etherscan';
import { getNetworkById, NetworkContext } from '../../services/Store/Network';
import { AssetContext, getAssetByUUID } from '../../services/Store/Asset';
import useMediaQuery from '../../vendor/react-use/useMediaQuery';
import { BREAK_POINTS } from '../../theme';
import { WALLETS_CONFIG } from '../../config';

export interface WithProtectState {
  stepIndex: number;
  protectTxShown: boolean;
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

  handleTransactionReport(): Promise<void>;
  setMainTransactionFormCallback(callback: SendFormCallbackType): void;
  goOnNextStep(): void;
  goOnInitialStep(): void;
  showHideTransactionProtection(showOrHide: boolean): void;
  setReceiverInfo(receiverAddress: string, network: NetworkId | null): Promise<void>;
  setProtectionTxTimeoutFunction(cb: (txReceiptCb?: (txReciept: ITxReceipt) => void) => void): void;
  invokeProtectionTxTimeoutFunction(cb: (txReceipt: ITxReceipt) => void): void;
  clearProtectionTxTimeoutFunction(): void;
  setWeb3Wallet(isWeb3Wallet: boolean, walletTypeId?: WalletId | null): void;
}

export const WithProtectInitialState: Partial<WithProtectState> = {
  stepIndex: 0,
  protectTxShown: false,
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
        protectTxShown: isMdScreen
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
      state.protectTxShown &&
      state.stepIndex !== numOfSteps - 1 &&
      state.cryptoScamAddressReport === null;

    setState(prevState => ({
      ...prevState,
      mainComponentDisabled: isDisabled
    }));
  }, [state.protectTxShown, state.stepIndex, state.cryptoScamAddressReport]);

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
        protectTxShown: showOrHide
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
    goOnInitialStep,
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
