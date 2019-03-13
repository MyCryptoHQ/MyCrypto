import erc20 from 'libs/erc20';
import BN from 'bn.js';
import EthTx from 'ethereumjs-tx';
import { bufferToHex } from 'ethereumjs-util';

import { Address, Wei, TokenValue, Nonce, getDecimalFromEtherUnit } from 'libs/units';
import {
  EAC_SCHEDULING_CONFIG,
  EAC_ADDRESSES,
  calcEACEndowment,
  getSchedulerAddress,
  getScheduleData,
  getValidateRequestParamsData
} from 'libs/scheduling';
import { makeTransaction, getTransactionFields, IHexStrTransaction } from 'libs/transaction';
import { stripHexPrefixAndLower } from 'libs/formatters';
import { SecureWalletName, WalletName, getAddressMessage, AddressMessage } from 'config';
import { Token } from 'types/network';
import { ICurrentTo, ICurrentValue, IGetTransaction } from './types';
import { AppState } from './reducers';
import { addressBookSelectors } from './addressBook';
import { walletTypes, walletSelectors } from './wallet';
import { ratesSelectors } from './rates';
import { customTokensSelectors } from './customTokens';
import { scheduleSelectors, scheduleHelpers } from './schedule';
import { transactionsSelectors } from './transactions';
import { SavedTransaction } from 'types/transactions';
import * as configMetaSelectors from './config/meta/selectors';
import * as configSelectors from './config/selectors';
import * as transactionSelectors from './transaction/selectors';
import * as transactionFieldsSelectors from './transaction/fields/selectors';
import * as transactionMetaSelectors from './transaction/meta/selectors';
import * as transactionSignTypes from './transaction/sign/types';
import * as transactionSignSelectors from './transaction/sign/selectors';
import { reduceToValues, isFullTx } from './helpers';
import Scheduler from 'libs/scheduling/contracts/Scheduler';

export const isAnyOfflineWithWeb3 = (state: AppState): boolean => {
  const { isWeb3Wallet } = walletSelectors.getWalletType(state);
  const offline = configMetaSelectors.getOffline(state);
  return offline && isWeb3Wallet;
};

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
      [SecureWalletName.WEB3, SecureWalletName.TREZOR, SecureWalletName.SAFE_T],
      'This wallet cannot be accessed offline'
    );
  }

  // Some wallets are disabled on certain platforms
  if (process.env.BUILD_ELECTRON) {
    addReason([SecureWalletName.WEB3], 'This wallet is not supported in the MyCrypto app');
    addReason(
      [SecureWalletName.SAFE_T],
      'Coming soon. Please use the MyCrypto.com website in the meantime'
    );
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

const getUSDConversionRate = (state: AppState, unit: string) => {
  const { isTestnet, hideEquivalentValues } = configSelectors.getNetworkConfig(state);
  const { rates } = ratesSelectors.getRates(state);
  if (isTestnet || hideEquivalentValues) {
    return null;
  }

  const conversionRate = rates[unit];

  if (!conversionRate) {
    return null;
  }
  return conversionRate.USD;
};

export const getValueInUSD = (state: AppState, value: TokenValue | Wei) => {
  const unit = getUnit(state);
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
  const fields = getParamsFromSerializedTx(state);
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

export const getSchedulingTransaction = (state: AppState): IGetTransaction => {
  const { isFullTransaction } = getTransaction(state);

  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const nonce = transactionFieldsSelectors.getNonce(state);
  const gasPrice = transactionFieldsSelectors.getGasPrice(state);
  const timeBounty = scheduleSelectors.getTimeBounty(state);
  const scheduleGasPrice = scheduleSelectors.getScheduleGasPrice(state);
  const scheduleGasLimit = scheduleSelectors.getScheduleGasLimit(state);
  const scheduleType = scheduleSelectors.getScheduleType(state);
  const gasLimit = transactionFieldsSelectors.getGasLimit(state);

  let endowment = Wei('0');

  let transactionData;

  const transactionFullAndValid = isFullTransaction && isSchedulingTransactionValid(state);

  if (transactionFullAndValid) {
    const deposit = scheduleSelectors.getScheduleDeposit(state);
    const scheduleTimestamp = scheduleSelectors.getScheduleTimestamp(state);
    const windowSize = scheduleSelectors.getWindowSize(state);
    const callData = transactionFieldsSelectors.getData(state);
    const scheduleTimezone = scheduleSelectors.getScheduleTimezone(state);
    const windowStart = scheduleSelectors.getWindowStart(state);
    let to = currentTo.raw;
    let etherValue = currentValue.value;
    let data = callData.raw;

    if (!isEtherTransaction(state)) {
      to = getSelectedTokenContractAddress(state);
      etherValue = Wei('0');

      const wallet = walletSelectors.getWalletInst(state);

      if (wallet && currentValue.value) {
        data = erc20.transferFrom.encodeInput({
          _from: wallet.getAddressString(),
          _to: currentTo.raw,
          _value: currentValue.value
        });
      }
    }

    endowment = calcEACEndowment(
      scheduleGasLimit.value,
      etherValue,
      scheduleGasPrice.value,
      timeBounty.value
    );

    transactionData = getScheduleData(
      to,
      data,
      scheduleGasLimit.value,
      etherValue,
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
    to: getSchedulerAddress(scheduleType.value, configSelectors.getNetworkConfig(state)),
    data: transactionData,
    gasLimit: gasLimit.value || new BN('0'),
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
  const currentNetworkName = configSelectors.getNetworkConfig(state).name;

  const wallet = walletSelectors.getWalletInst(state);
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
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
    !deposit.value ||
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
    to: EAC_ADDRESSES[currentNetworkName.toUpperCase()].requestFactory,
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

export const isEtherTransaction = (state: AppState) => {
  const unit = getUnit(state);
  const etherUnit = configSelectors.isNetworkUnit(state, unit);
  return etherUnit;
};

export const getValidGasCost = (state: AppState) => {
  const gasCost = transactionSelectors.getGasCost(state);
  const etherBalance = walletSelectors.getEtherBalance(state);
  const isOffline = configMetaSelectors.getOffline(state);
  if (isOffline || !etherBalance) {
    return true;
  }
  return gasCost.lte(etherBalance);
};

export const getDecimalFromUnit = (state: AppState, unit: string) => {
  if (configSelectors.isNetworkUnit(state, unit)) {
    return getDecimalFromEtherUnit('ether');
  } else {
    const token = getToken(state, unit);
    if (!token) {
      throw Error(`Token ${unit} not found`);
    }
    return token.decimal;
  }
};

export const getCurrentTo = (state: AppState): ICurrentTo =>
  isEtherTransaction(state)
    ? transactionFieldsSelectors.getTo(state)
    : transactionMetaSelectors.getTokenTo(state);

export const getCurrentValue = (state: AppState): ICurrentValue =>
  isEtherTransaction(state)
    ? transactionFieldsSelectors.getValue(state)
    : transactionMetaSelectors.getTokenValue(state);

export const isValidCurrentTo = (state: AppState) => {
  const currentTo = getCurrentTo(state);
  const dataExists = transactionSelectors.getDataExists(state);
  if (isEtherTransaction(state)) {
    // if data exists the address can be 0x
    return !!currentTo.value || dataExists;
  } else {
    return !!currentTo.value;
  }
};

export const isCurrentToLabelEntry = (state: AppState): boolean => {
  const currentTo = getCurrentTo(state);
  return !currentTo.raw.startsWith('0x');
};

export function getCurrentToAddressMessage(state: AppState): AddressMessage | undefined {
  const to = getCurrentTo(state);
  return getAddressMessage(to.raw);
}

export const getUnit = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  const contractInteraction = transactionMetaSelectors.isContractInteraction(state);
  // attempt to get the to address from the transaction
  if (serializedTransaction && !contractInteraction) {
    const transactionInstance = new EthTx(serializedTransaction);
    const { to } = transactionInstance;
    if (to) {
      // see if any tokens match
      let networkTokens: null | Token[] = null;
      const customTokens = customTokensSelectors.getCustomTokens(state);
      const networkConfig = configSelectors.getNetworkConfig(state);
      if (!networkConfig.isCustom) {
        networkTokens = networkConfig.tokens;
      }
      const mergedTokens = networkTokens ? [...networkTokens, ...customTokens] : customTokens;
      const toChecksumAddress = configSelectors.getChecksumAddressFn(state);
      const stringTo = toChecksumAddress(stripHexPrefixAndLower(to.toString('hex')));
      const result = mergedTokens.find(t => t.address === stringTo);
      if (result) {
        return result.symbol;
      }
    }
  }

  return transactionMetaSelectors.getMetaState(state).unit;
};

export const signaturePending = (state: AppState) => {
  const { isHardwareWallet } = walletSelectors.getWalletType(state);
  const { pending } = state.transaction.sign;
  return { isHardwareWallet, isSignaturePending: pending };
};

export const getSerializedTransaction = (state: AppState) =>
  walletSelectors.getWalletType(state).isWeb3Wallet
    ? transactionSignSelectors.getWeb3Tx(state)
    : transactionSignSelectors.getSignedTx(state);

export const getParamsFromSerializedTx = (
  state: AppState
): transactionSignTypes.SerializedTxParams => {
  const tx = getSerializedTransaction(state);
  const isEther = isEtherTransaction(state);
  const decimal = transactionMetaSelectors.getDecimal(state);
  const isSchedulingEnabled = scheduleSelectors.isSchedulingEnabled(state);

  if (!tx) {
    throw Error('Serialized transaction not found');
  }
  const fields = getTransactionFields(makeTransaction(tx));
  const { value, data, gasLimit, gasPrice, to } = fields;
  let currentValue = isEther ? Wei(value) : TokenValue(erc20.transfer.decodeInput(data)._value);
  let currentTo = isEther ? Address(to) : Address(erc20.transfer.decodeInput(data)._to);

  if (isSchedulingEnabled && !isEther) {
    const scheduledTxParams = Scheduler.schedule.decodeInput(data);
    const scheduledTxCallData = bufferToHex(scheduledTxParams._callData as Buffer);

    currentValue = TokenValue(erc20.transferFrom.decodeInput(scheduledTxCallData)._value);
    currentTo = Address(erc20.transferFrom.decodeInput(scheduledTxCallData)._to);
  }

  const unit = getUnit(state);
  const fee = Wei(gasLimit).mul(Wei(gasPrice));
  const total = fee.add(Wei(value));
  return { ...fields, currentValue, currentTo, fee, total, unit, decimal, isToken: !isEther };
};

export const getTransaction = (state: AppState): IGetTransaction => {
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const transactionFields = transactionFieldsSelectors.getFields(state);
  const unit = getUnit(state);
  const reducedValues = reduceToValues(transactionFields);
  const transaction: EthTx = makeTransaction(reducedValues);
  const dataExists = transactionSelectors.getDataExists(state);
  const validGasCost = getValidGasCost(state);
  const isFullTransaction = isFullTx(
    state,
    transactionFields,
    currentTo,
    currentValue,
    dataExists,
    validGasCost,
    unit
  );

  return { transaction, isFullTransaction };
};

export const nonStandardTransaction = (state: AppState): boolean => {
  const etherTransaction = isEtherTransaction(state);
  const { isFullTransaction } = getTransaction(state);
  const dataExists = transactionSelectors.getDataExists(state);
  return isFullTransaction && dataExists && etherTransaction;
};

export const serializedAndTransactionFieldsMatch = (state: AppState, isLocallySigned: boolean) => {
  const serialzedTransaction = getSerializedTransaction(state);
  const { transaction, isFullTransaction } = getTransaction(state);
  if (!isFullTransaction || !serialzedTransaction) {
    return false;
  }
  const t1 = getTransactionFields(transaction);
  // inject chainId into t1 as it wont have it from the fields
  const networkConfig = configSelectors.getNetworkConfig(state);
  if (!networkConfig) {
    return false;
  }
  const { chainId } = networkConfig;
  t1.chainId = chainId;

  const t2 = getTransactionFields(makeTransaction(serialzedTransaction));
  const checkValidity = (tx: IHexStrTransaction) =>
    Object.keys(tx).reduce(
      (match, currField: keyof IHexStrTransaction) => match && t1[currField] === t2[currField],
      true
    );
  //reduce both ways to make sure both are exact same
  const transactionsMatch = checkValidity(t1) && checkValidity(t2);
  // if its signed then verify the signature too
  return transactionsMatch && isLocallySigned
    ? makeTransaction(serialzedTransaction).verifySignature()
    : true;
};

export const getFrom = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);

  // attempt to get the from address from the transaction
  if (serializedTransaction) {
    const transactionInstance = new EthTx(serializedTransaction);

    try {
      const from = transactionInstance.from;
      if (from) {
        const toChecksumAddress = configSelectors.getChecksumAddressFn(state);
        return toChecksumAddress(from.toString('hex'));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return transactionMetaSelectors.getMetaState(state).from;
};

export const getCurrentBalance = (state: AppState): Wei | TokenValue | null => {
  const etherTransaction = isEtherTransaction(state);
  if (etherTransaction) {
    return walletSelectors.getEtherBalance(state);
  } else {
    const unit = getUnit(state);
    return getTokenBalance(state, unit);
  }
};

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = configSelectors.getAllTokens(state);
  const currentUnit = getUnit(state);

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

export function getCurrentToLabel(state: AppState) {
  const addresses = addressBookSelectors.getAddressLabels(state);
  const currentTo = getCurrentTo(state);

  return addresses[currentTo.raw.toLowerCase()] || null;
}
