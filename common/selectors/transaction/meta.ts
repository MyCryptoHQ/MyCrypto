import { AppState } from 'reducers';
import { getTransactionState } from './transaction';
import { getToken } from 'selectors/wallet';
import { isNetworkUnit } from 'selectors/config/wallet';
import { getDecimalFromEtherUnit } from 'libs/units';
import { getSerializedTransaction } from 'selectors/transaction';
import EthTx from 'ethereumjs-tx';
import { getCustomTokens } from 'selectors/customTokens';
import { getNetworkConfig } from 'selectors/config';
import { Token } from '../../../shared/types/network';
import { stripHexPrefixAndLower } from 'libs/values';
import { toChecksumAddress } from 'ethereumjs-util';

const getMetaState = (state: AppState) => getTransactionState(state).meta;
const getFrom = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  // attempt to get the from address from the transaction
  if (serializedTransaction) {
    const transactionInstance = new EthTx(serializedTransaction);
    try {
      const from = transactionInstance.from;
      if (from) {
        return toChecksumAddress(from.toString('hex'));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getMetaState(state).from;
};
const getDecimal = (state: AppState) => getMetaState(state).decimal;

const getTokenTo = (state: AppState) => getMetaState(state).tokenTo;
const getTokenValue = (state: AppState) => getMetaState(state).tokenValue;
const getUnit = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  // attempt to get the to address from the transaction
  if (serializedTransaction) {
    const transactionInstance = new EthTx(serializedTransaction);
    const { to } = transactionInstance;
    if (to) {
      // see if any tokens match
      let networkTokens: null | Token[] = null;
      const customTokens = getCustomTokens(state);
      const networkConfig = getNetworkConfig(state);
      if (!networkConfig.isCustom) {
        networkTokens = networkConfig.tokens;
      }
      const mergedTokens = networkTokens ? [...networkTokens, ...customTokens] : customTokens;
      const stringTo = toChecksumAddress(stripHexPrefixAndLower(to.toString('hex')));
      const result = mergedTokens.find(t => t.address === stringTo);
      if (result) {
        return result.symbol;
      }
    }
  }

  return getMetaState(state).unit;
};
const getPreviousUnit = (state: AppState) => getMetaState(state).previousUnit;
const getDecimalFromUnit = (state: AppState, unit: string) => {
  if (isNetworkUnit(state, unit)) {
    return getDecimalFromEtherUnit('ether');
  } else {
    const token = getToken(state, unit);
    if (!token) {
      throw Error(`Token ${unit} not found`);
    }
    return token.decimal;
  }
};

export {
  getFrom,
  getDecimal,
  getTokenValue,
  getTokenTo,
  getUnit,
  getPreviousUnit,
  getDecimalFromUnit
};
