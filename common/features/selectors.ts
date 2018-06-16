import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import { bufferToHex } from 'ethereumjs-util';

import { Wei, TokenValue, Nonce } from 'libs/units';
import {
  EAC_SCHEDULING_CONFIG,
  EAC_ADDRESSES,
  calcEACEndowment,
  getSchedulerAddress,
  getScheduleData,
  getValidateRequestParamsData
} from 'libs/scheduling';
import { makeTransaction } from 'libs/transaction';
import { SecureWalletName, WalletName } from 'config';
import { Token } from 'types/network';
import { AppState } from './reducers';
import { addressBookSelectors } from './addressBook';
import { walletTypes, walletSelectors } from './wallet';
import { ratesSelectors } from './rates';
import { scheduleSelectors, scheduleHelpers } from './schedule';
import { transactionsSelectors } from './transactions';
import { SavedTransaction } from 'types/transactions';
import * as configMetaSelectors from './config/meta/selectors';
import * as configSelectors from './config/selectors';
import * as transactionSelectors from './transaction/selectors';
import * as transactionFieldsSelectors from 'features/transaction/fields/selectors';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = walletSelectors.getWalletType(state);
  const offline = configMetaSelectors.getOffline(state);
  return offline && isWeb3Wallet;
};

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = configSelectors.getAllTokens(state);
  const currentUnit = transactionSelectors.getUnit(state);

  if (configSelectors.isNetworkUnit(state, currentUnit)) {
    return '';
  }

  return allTokens.reduce((tokenAddr, tokenInfo) => {
    if (tokenAddr && tokenAddr.length) {
      return tokenAddr;
    }

    if (tokenInfo.symbol === currentUnit) {
      return tokenInfo.address;
    }

    return tokenAddr;
  }, '');
}

// TODO: Convert to reselect selector (Issue #884)
export function getDisabledWallets(state: AppState): any {
  const network = configSelectors.getNetworkConfig(state);
  const isOffline = configMetaSelectors.getOffline(state);
  const disabledWallets: any = {
    wallets: [],
    reasons: {}
  };

  const addReason = (wallets: WalletName[], reason: string) => {
    if (!wallets.length) {
      return;
    }

    disabledWallets.wallets = disabledWallets.wallets.concat(wallets);
    wallets.forEach(wallet => {
      disabledWallets.reasons[wallet] = reason;
    });
  };

  // Some wallets don't support some networks
  addReason(
    configSelectors.unSupportedWalletFormatsOnNetwork(state),
    `This wallet doesn’t support the ${network.name} network`
  );

  // Some wallets are unavailable offline
  if (isOffline) {
    addReason(
      [SecureWalletName.WEB3, SecureWalletName.TREZOR],
      'This wallet cannot be accessed offline'
    );
  }

  // Some wallets are disabled on certain platforms
  if (process.env.BUILD_DOWNLOADABLE) {
    addReason([SecureWalletName.LEDGER_NANO_S], 'This wallet is only supported at MyCrypto.com');
  }
  if (process.env.BUILD_ELECTRON) {
    addReason([SecureWalletName.WEB3], 'This wallet is not supported in the MyCrypto app');
  }

  // Dedupe and sort for consistency
  disabledWallets.wallets = disabledWallets.wallets
    .filter((name: string, idx: number) => disabledWallets.wallets.indexOf(name) === idx)
    .sort();

  return disabledWallets;
}

export function getTokens(state: AppState): walletTypes.MergedToken[] {
  const network = configSelectors.getStaticNetworkConfig(state);
  const tokens: Token[] = network ? network.tokens : [];
  return tokens.concat(
    state.customTokens.map((token: Token) => {
      const mergedToken = { ...token, custom: true };
      return mergedToken;
    })
  ) as walletTypes.MergedToken[];
}

export function getWalletConfigTokens(state: AppState): walletTypes.MergedToken[] {
  const tokens = getTokens(state);
  const config = walletSelectors.getWalletConfig(state);
  if (!config || !config.tokens) {
    return [];
  }
  return config.tokens
    .map(symbol => tokens.find(t => t.symbol === symbol))
    .filter(token => token) as walletTypes.MergedToken[];
}

export const getToken = (state: AppState, unit: string): walletTypes.MergedToken | undefined => {
  const tokens = getTokens(state);
  const token = tokens.find(t => t.symbol === unit);
  return token;
};

export function getTokenBalances(
  state: AppState,
  nonZeroOnly: boolean = false
): walletTypes.TokenBalance[] {
  const tokens = getTokens(state);
  if (!tokens) {
    return [];
  }
  const ret = tokens.map(t => ({
    symbol: t.symbol,
    balance: state.wallet.tokens[t.symbol]
      ? state.wallet.tokens[t.symbol].balance
      : TokenValue('0'),
    error: state.wallet.tokens[t.symbol] ? state.wallet.tokens[t.symbol].error : null,
    custom: t.custom,
    decimal: t.decimal
  }));

  return nonZeroOnly ? ret.filter(t => !t.balance.isZero()) : ret;
}

export const getTokenWithBalance = (state: AppState, unit: string): walletTypes.TokenBalance => {
  const tokens = getTokenBalances(state, false);
  const currentToken = tokens.filter(t => t.symbol === unit);
  //TODO: getting the first index is kinda hacky
  return currentToken[0];
};

export const getTokenBalance = (state: AppState, unit: string): TokenValue | null => {
  const token = getTokenWithBalance(state, unit);
  if (!token) {
    return token;
  }
  return token.balance;
};

export const getCurrentBalance = (state: AppState): Wei | TokenValue | null => {
  const etherTransaction = transactionSelectors.isEtherTransaction(state);
  if (etherTransaction) {
    return walletSelectors.getEtherBalance(state);
  } else {
    const unit = transactionSelectors.getUnit(state);
    return getTokenBalance(state, unit);
  }
};

export function getShownTokenBalances(
  state: AppState,
  nonZeroOnly: boolean = false
): walletTypes.TokenBalance[] {
  const tokenBalances = getTokenBalances(state, nonZeroOnly);
  const walletConfig = walletSelectors.getWalletConfig(state);

  let walletTokens: string[] = [];
  if (walletConfig) {
    if (walletConfig.tokens) {
      walletTokens = walletConfig.tokens;
    }
  }

  return tokenBalances.filter(t => walletTokens.includes(t.symbol));
}

export function getCurrentToLabel(state: AppState) {
  const addresses = addressBookSelectors.getAddressLabels(state);
  const currentTo = transactionSelectors.getCurrentTo(state);

  return addresses[currentTo.raw] || null;
}

const getUSDConversionRate = (state: AppState, unit: string) => {
  const { isTestnet } = configSelectors.getNetworkConfig(state);
  const { rates } = ratesSelectors.getRates(state);
  if (isTestnet) {
    return null;
  }

  const conversionRate = rates[unit];

  if (!conversionRate) {
    return null;
  }
  return conversionRate.USD;
};

export const getValueInUSD = (state: AppState, value: TokenValue | Wei) => {
  const unit = transactionSelectors.getUnit(state);
  const conversionRate = getUSDConversionRate(state, unit);
  if (!conversionRate) {
    return null;
  }
  const sendValueUSD = value.muln(conversionRate);
  return sendValueUSD;
};
export const getTransactionFeeInUSD = (state: AppState, fee: Wei) => {
  const { unit } = configSelectors.getNetworkConfig(state);
  const conversionRate = getUSDConversionRate(state, unit);

  if (!conversionRate) {
    return null;
  }

  const feeValueUSD = fee.muln(conversionRate);
  return feeValueUSD;
};

export interface AllUSDValues {
  valueUSD: BN | null;
  feeUSD: BN | null;
  totalUSD: BN | null;
}

export const getAllUSDValuesFromSerializedTx = (state: AppState): AllUSDValues => {
  const fields = transactionSelectors.getParamsFromSerializedTx(state);
  if (!fields) {
    return {
      feeUSD: null,
      valueUSD: null,
      totalUSD: null
    };
  }
  const { currentValue, fee } = fields;
  const valueUSD = getValueInUSD(state, currentValue);
  const feeUSD = getTransactionFeeInUSD(state, fee);
  return {
    feeUSD,
    valueUSD,
    totalUSD: feeUSD && valueUSD ? valueUSD.add(feeUSD) : null
  };
};

export function getRecentNetworkTransactions(state: AppState): SavedTransaction[] {
  const txs = transactionsSelectors.getRecentTransactions(state);
  const network = configSelectors.getNetworkConfig(state);
  return txs.filter(tx => tx.chainId === network.chainId);
}

export function getRecentWalletTransactions(state: AppState): SavedTransaction[] {
  const networkTxs = getRecentNetworkTransactions(state);
  const wallet = walletSelectors.getWalletInst(state);

  if (wallet) {
    const addr = wallet.getAddressString().toLowerCase();
    return networkTxs.filter(tx => tx.from.toLowerCase() === addr);
  } else {
    return [];
  }
}

export const getSchedulingTransaction = (state: AppState): transactionSelectors.IGetTransaction => {
  const { isFullTransaction } = transactionSelectors.getTransaction(state);

  const currentTo = transactionSelectors.getCurrentTo(state);
  const currentValue = transactionSelectors.getCurrentValue(state);
  const nonce = transactionFieldsSelectors.getNonce(state);
  const gasPrice = transactionFieldsSelectors.getGasPrice(state);
  const timeBounty = scheduleSelectors.getTimeBounty(state);
  const scheduleGasPrice = scheduleSelectors.getScheduleGasPrice(state);
  const scheduleGasLimit = scheduleSelectors.getScheduleGasLimit(state);
  const scheduleType = scheduleSelectors.getScheduleType(state);

  const endowment = calcEACEndowment(
    scheduleGasLimit.value,
    currentValue.value,
    scheduleGasPrice.value,
    timeBounty.value
  );

  let transactionData = null;

  const transactionFullAndValid = isFullTransaction && isSchedulingTransactionValid(state);

  if (transactionFullAndValid) {
    const deposit = scheduleSelectors.getScheduleDeposit(state);
    const scheduleTimestamp = scheduleSelectors.getScheduleTimestamp(state);
    const windowSize = scheduleSelectors.getWindowSize(state);
    const callData = transactionFieldsSelectors.getData(state);
    const scheduleTimezone = scheduleSelectors.getScheduleTimezone(state);
    const windowStart = scheduleSelectors.getWindowStart(state);

    transactionData = getScheduleData(
      currentTo.raw,
      callData.raw,
      scheduleGasLimit.value,
      currentValue.value,
      scheduleHelpers.windowSizeBlockToMin(windowSize.value, scheduleType.value),
      scheduleHelpers.calculateWindowStart(
        scheduleType.value,
        scheduleTimestamp,
        scheduleTimezone.value,
        windowStart.value
      ),
      scheduleGasPrice.value,
      timeBounty.value,
      deposit.value
    );
  }

  const transactionOptions = {
    to: getSchedulerAddress(scheduleType.value),
    data: transactionData,
    gasLimit: EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT,
    gasPrice: gasPrice.value,
    nonce: Nonce('0'),
    value: endowment
  };

  if (nonce) {
    transactionOptions.nonce = Nonce(nonce.raw);
  }

  const schedulingTransaction: EthTx = makeTransaction(transactionOptions);

  return {
    transaction: schedulingTransaction,
    isFullTransaction: transactionFullAndValid
  };
};

const isSchedulingTransactionValid = (state: AppState): boolean => {
  const schedulingState = scheduleSelectors.getScheduleState(state);
  const windowSizeValid = scheduleSelectors.isWindowSizeValid(state);
  const windowStartValid = scheduleHelpers.isWindowStartValid(
    schedulingState,
    configMetaSelectors.getLatestBlock(state)
  );
  const scheduleTimestampValid = scheduleHelpers.isScheduleTimestampValid(schedulingState);
  const scheduleGasPriceValid = scheduleSelectors.isValidScheduleGasPrice(state);
  const scheduleGasLimitValid = scheduleSelectors.isValidScheduleGasLimit(state);
  const depositValid = scheduleSelectors.isValidScheduleDeposit(state);
  const timeBountyValid = scheduleSelectors.isValidCurrentTimeBounty(state);

  // return true if all fields are valid
  return (
    // either windowStart or scheduleTimestamp is used for scheduling
    (windowStartValid || scheduleTimestampValid) &&
    windowSizeValid &&
    scheduleGasPriceValid &&
    scheduleGasLimitValid &&
    depositValid &&
    timeBountyValid
  );
};

export interface IGetValidateScheduleParamsCallPayload {
  to: string;
  data: string;
}

export const getValidateScheduleParamsCallPayload = (
  state: AppState
): IGetValidateScheduleParamsCallPayload | undefined => {
  const wallet = walletSelectors.getWalletInst(state);
  const currentTo = transactionSelectors.getCurrentTo(state);
  const currentValue = transactionSelectors.getCurrentValue(state);
  const timeBounty = scheduleSelectors.getTimeBounty(state);
  const scheduleGasPrice = scheduleSelectors.getScheduleGasPrice(state);
  const scheduleGasLimit = scheduleSelectors.getScheduleGasLimit(state);
  const scheduleType = scheduleSelectors.getScheduleType(state);
  const deposit = scheduleSelectors.getScheduleDeposit(state);
  const scheduleTimestamp = scheduleSelectors.getScheduleTimestamp(state);
  const windowSize = scheduleSelectors.getWindowSize(state);
  const scheduleTimezone = scheduleSelectors.getScheduleTimezone(state);
  const windowStart = scheduleSelectors.getWindowStart(state);

  /*
     * Checks if any of these values are null or invalid
     * due to an user input.
     */
  if (
    !currentValue.value ||
    !currentTo.value ||
    !scheduleGasPrice.value ||
    !wallet ||
    !windowSize.value ||
    // we need either windowStart or scheduleTimestamp for scheduling
    !(windowStart.value || scheduleTimestamp.value)
  ) {
    return;
  }

  const callGasLimit = scheduleGasLimit.value || EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

  const endowment = calcEACEndowment(
    callGasLimit,
    currentValue.value,
    scheduleGasPrice.value,
    timeBounty.value
  );

  const fromAddress = wallet.getAddressString();

  const data = getValidateRequestParamsData(
    bufferToHex(currentTo.value),
    callGasLimit,
    currentValue.value,
    scheduleHelpers.windowSizeBlockToMin(windowSize.value, scheduleType.value),
    scheduleHelpers.calculateWindowStart(
      scheduleType.value,
      scheduleTimestamp,
      scheduleTimezone.value,
      windowStart.value
    ),
    scheduleGasPrice.value,
    timeBounty.value,
    deposit.value || Wei('0'),
    scheduleType.value === 'time',
    endowment,
    fromAddress
  );

  return {
    to: EAC_ADDRESSES.KOVAN.requestFactory,
    data
  };
};

export const isValidCurrentWindowStart = (state: AppState) => {
  const currentWindowStart = scheduleSelectors.getWindowStart(state);

  if (!currentWindowStart.value) {
    return false;
  }

  return currentWindowStart.value > parseInt(configMetaSelectors.getLatestBlock(state), 10);
};
