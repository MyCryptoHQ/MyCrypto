import { getWalletType } from 'selectors/wallet';
import { AppState } from 'reducers';
import { getTransactionState } from './transaction';
import { getTransactionFields, makeTransaction, IHexStrTransaction } from 'libs/transaction';
import { isEtherTransaction, getUnit, getDecimal } from 'selectors/transaction';
import { Wei, TokenValue, Address } from 'libs/units';
import erc20 from 'libs/erc20';

const getSignState = (state: AppState) => getTransactionState(state).sign;

const signaturePending = (state: AppState) => {
  const { isHardwareWallet } = getWalletType(state);
  const { pending } = state.transaction.sign;
  return { isHardwareWallet, isSignaturePending: pending };
};

const getSignedTx = (state: AppState) => getSignState(state).local.signedTransaction;

const getWeb3Tx = (state: AppState) => getSignState(state).web3.transaction;

const getSerializedTransaction = (state: AppState) =>
  getWalletType(state).isWeb3Wallet ? getWeb3Tx(state) : getSignedTx(state);

export interface SerializedTxParams extends IHexStrTransaction {
  unit: string;
  currentTo: Buffer;
  currentValue: Wei | TokenValue;
  fee: Wei;
  total: Wei;
  isToken: boolean;
  decimal: number;
}

export const getParamsFromSerializedTx = (state: AppState): SerializedTxParams => {
  const tx = getSerializedTransaction(state);
  const isEther = isEtherTransaction(state);
  const decimal = getDecimal(state);

  if (!tx) {
    throw Error('Serialized transaction not found');
  }
  const fields = getTransactionFields(makeTransaction(tx));
  const { value, data, gasLimit, gasPrice, to } = fields;
  const currentValue = isEther ? Wei(value) : TokenValue(erc20.transfer.decodeInput(data)._value);
  const currentTo = isEther ? Address(to) : Address(erc20.transfer.decodeInput(data)._to);
  const unit = getUnit(state);
  const fee = Wei(gasLimit).mul(Wei(gasPrice));
  const total = fee.add(Wei(value));
  return { ...fields, currentValue, currentTo, fee, total, unit, decimal, isToken: !isEther };
};

export { signaturePending, getSignedTx, getWeb3Tx, getSignState, getSerializedTransaction };
