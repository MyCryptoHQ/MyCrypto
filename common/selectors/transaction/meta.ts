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
import { toChecksumAddressByChainId } from 'libs/checksum';

const getMetaState = (state: AppState) => getTransactionState(state).meta;
const getFrom = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  // attempt to get the from address from the transaction
  if (serializedTransaction) {
    const transactionInstance = new EthTx(serializedTransaction);
    try {
      const from = transactionInstance.from;
      if (from) {
        const networkConfig = getNetworkConfig(state);
        return toChecksumAddressByChainId(from.toString('hex'), networkConfig.chainId);
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

const isContractInteraction = (state: AppState) => getMetaState(state).isContractInteraction;

const getUnit = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  const contractInteraction = isContractInteraction(state);
  // attempt to get the to address from the transaction
  if (serializedTransaction && !contractInteraction) {
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
      const stringTo = toChecksumAddressByChainId(
        stripHexPrefixAndLower(to.toString('hex')),
        networkConfig.chainId
      );
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
  getDecimalFromUnit,
  isContractInteraction
};
