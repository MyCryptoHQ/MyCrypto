import { SagaIterator, buffers, delay } from 'redux-saga';
import {
  apply,
  put,
  select,
  take,
  actionChannel,
  call,
  fork,
  race,
  cancel,
  takeEvery,
  takeLatest,
  all
} from 'redux-saga/effects';
import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';

import { AddressMessage } from 'config';
import { INode } from 'libs/nodes/INode';
import { IWallet, Web3Wallet } from 'libs/wallet';
import {
  Address,
  toTokenBase,
  Data,
  Wei,
  Nonce,
  gasPriceToBase,
  fromTokenBase,
  fromWei,
  TokenValue
} from 'libs/units';
import {
  makeTransaction,
  getTransactionFields,
  IHexStrTransaction,
  encodeTransfer,
  computeIndexingHash
} from 'libs/transaction';
import {
  isValidENSAddress,
  isValidETHAddress,
  validNumber,
  validPositiveNumber,
  validDecimal,
  isValidHex,
  isValidNonce,
  gasPriceValidator,
  gasLimitValidator
} from 'libs/validators';
import { transactionToRLP, signTransactionWithSignature } from 'utils/helpers';
import { AppState } from 'features/reducers';
import { CONFIG_META, ToggleAutoGasLimitAction } from 'features/config/meta/types';
import { getOffline, getAutoGasLimitEnabled } from 'features/config/meta/selectors';
import { getNodeLib } from 'features/config/nodes/selectors';
import { isNetworkUnit, getNetworkUnit } from 'features/config/selectors';
import * as ensTypes from 'features/ens/types';
import { resolveDomainRequested } from 'features/ens/actions';
import { getResolvedAddress } from 'features/ens/selectors';
import { WALLET, MergedToken } from 'features/wallet/types';
import {
  getWalletInst,
  getToken,
  getEtherBalance,
  getCurrentBalance,
  getWalletType,
  IWalletType
} from 'features/wallet/selectors';
import * as paritySignerTypes from 'features/paritySigner/types';
import { requestTransactionSignature } from 'features/paritySigner/actions';
import { setSchedulingToggle, setScheduleGasLimitField } from 'features/schedule/actions';
import { isSchedulingEnabled } from 'features/schedule/selectors';
import { showNotification } from 'features/notifications/actions';
import { TRANSACTION_BROADCAST } from './broadcast/types';
import {
  TRANSACTION_FIELDS,
  SetToFieldAction,
  InputDataAction,
  InputGasLimitAction,
  InputGasPriceAction,
  InputGasPriceIntentAction,
  InputNonceAction,
  SetDataFieldAction
} from './fields/types';
import {
  setToField,
  setValueField,
  inputGasPrice,
  setDataField,
  setGasLimitField,
  setGasPriceField,
  setNonceField,
  inputNonce,
  resetTransactionRequested,
  resetTransactionSuccessful,
  TSetValueField
} from './fields/actions';
import { getTo, getData, getValue } from './fields/selectors';
import {
  TRANSACTION_META,
  SetTokenToMetaAction,
  SetTokenValueMetaAction,
  SetUnitMetaAction
} from './meta/types';
import { setTokenTo, setTokenValue, setUnitMeta, TSetTokenValue } from './meta/actions';
import { getDecimal, getTokenValue, getTokenTo, isContractInteraction } from './meta/selectors';
import { TRANSACTION_NETWORK, EstimateGasRequestedAction } from './network/types';
import {
  getFromSucceeded,
  getFromFailed,
  estimateGasFailed,
  estimateGasSucceeded,
  estimateGasRequested,
  estimateGasTimedout,
  getNonceSucceeded,
  getNonceFailed
} from './network/actions';
import {
  TRANSACTION_SIGN,
  SignWeb3TransactionSucceededAction,
  SignLocalTransactionSucceededAction,
  SignTransactionRequestedAction
} from './sign/types';
import { signLocalTransactionSucceeded, signWeb3TransactionSucceeded } from './sign/actions';
import {
  TRANSACTION,
  SetCurrentToAction,
  SetCurrentValueAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapTokenToEtherAction
} from './types';
import {
  sendEverythingSucceeded,
  sendEverythingFailed,
  swapTokenToEther,
  swapEtherToToken,
  swapTokenToToken
} from './actions';
import {
  isEtherTransaction,
  getTransaction,
  IGetTransaction,
  getPreviousUnit,
  getDecimalFromUnit,
  getUnit,
  getCurrentValue,
  ICurrentValue,
  getCurrentToAddressMessage,
  serializedAndTransactionFieldsMatch
} from './selectors';
import {
  IFullWalletAndTransaction,
  signTransactionWrapper,
  broadcastTransactionWrapper,
  validateInput,
  IInput,
  rebaseUserInput
} from './helpers';
import { getNetworkByChainId } from '../config';

//#region Broadcast
export const broadcastLocalTransactionHandler = function*(signedTx: string): SagaIterator {
  const node: INode = yield select(getNodeLib);
  const txHash = yield apply(node, node.sendRawTx, [signedTx.toString()]);
  return txHash;
};

const broadcastLocalTransaction = broadcastTransactionWrapper(broadcastLocalTransactionHandler);

// web3 transactions are a little different since they do signing + broadcast in 1 step
// meaning we have to grab the tx data and send it
export const broadcastWeb3TransactionHandler = function*(tx: string): SagaIterator {
  //get web3 wallet
  const wallet: AppState['wallet']['inst'] = yield select(getWalletInst);
  if (!wallet || !(wallet instanceof Web3Wallet)) {
    throw Error('Can not broadcast: Web3 wallet not found');
  }

  const nodeLib = yield select(getNodeLib);
  const netId = yield call(nodeLib.getNetVersion);
  const networkConfig = yield select(getNetworkByChainId, netId);

  // sign and broadcast
  const txHash: string = yield apply(wallet, wallet.sendTransaction, [tx, nodeLib, networkConfig]);
  return txHash;
};

const broadcastWeb3Transaction = broadcastTransactionWrapper(broadcastWeb3TransactionHandler);

export const broadcastSaga = [
  takeEvery([TRANSACTION_BROADCAST.WEB3_TRANSACTION_REQUESTED], broadcastWeb3Transaction),
  takeEvery([TRANSACTION_BROADCAST.LOCAL_TRANSACTION_REQUESTED], broadcastLocalTransaction)
];
//#endregion Broadcast

//#region Current

//#region Current To
export function* setCurrentToSaga({ payload: raw }: SetCurrentToAction): SagaIterator {
  const validAddress: boolean = yield call(isValidETHAddress, raw);
  const validEns: boolean = yield call(isValidENSAddress, raw);

  let value: Buffer | null = null;
  if (validAddress) {
    value = Address(raw);
  } else if (validEns) {
    yield call(setField, { value, raw });

    const [domain] = raw.split('.');
    yield put(resolveDomainRequested(domain));
    yield take([
      ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED
    ]);
    const resolvedAddress: string | null = yield select(getResolvedAddress, true);
    if (resolvedAddress) {
      value = Address(resolvedAddress);
    }
  }

  yield call(setField, { value, raw });
}

export function* setField(payload: SetToFieldAction['payload'] | SetTokenToMetaAction['payload']) {
  const etherTransaction: boolean = yield select(isEtherTransaction);

  if (etherTransaction) {
    yield put(setToField(payload));
  } else {
    yield put(setTokenTo(payload));
  }
}

export const currentTo = takeLatest([TRANSACTION.CURRENT_TO_SET], setCurrentToSaga);
//#endregion Current To

//#region Current Value
export function* setCurrentValueSaga(action: SetCurrentValueAction): SagaIterator {
  const etherTransaction = yield select(isEtherTransaction);
  const setter = etherTransaction ? setValueField : setTokenValue;
  return yield call(valueHandler, action, setter);
}

export function* valueHandler(
  { payload }: SetCurrentValueAction,
  setter: TSetValueField | TSetTokenValue
) {
  const decimal: number = yield select(getDecimal);
  const unit: string = yield select(getUnit);
  const isEth = yield select(isEtherTransaction);
  const validNum = isEth ? validNumber : validPositiveNumber;

  if (!validNum(Number(payload)) || !validDecimal(payload, decimal)) {
    return yield put(setter({ raw: payload, value: null }));
  }
  const value = toTokenBase(payload, decimal);
  const isValid: boolean = yield call(validateInput, value, unit);
  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export function* revalidateCurrentValue(): SagaIterator {
  const etherTransaction = yield select(isEtherTransaction);
  const currVal: ICurrentValue = yield select(getCurrentValue);
  const reparsedValue: null | ICurrentValue = yield call(reparseCurrentValue, currVal);
  const unit: string = yield select(getUnit);
  const setter = etherTransaction ? setValueField : setTokenValue;
  if (!reparsedValue || !reparsedValue.value) {
    return yield put(setter({ raw: currVal.raw, value: null }));
  }
  const isValid: boolean = yield call(validateInput, reparsedValue.value, unit);
  yield put(setter({ raw: reparsedValue.raw, value: isValid ? reparsedValue.value : null }));
}

export function* reparseCurrentValue(value: IInput): SagaIterator {
  const isEth = yield select(isEtherTransaction);
  const decimal = yield select(getDecimal);
  const validNum = isEth ? validNumber : validPositiveNumber;

  if (validNum(Number(value.raw)) && validDecimal(value.raw, decimal)) {
    return {
      raw: value.raw,
      value: toTokenBase(value.raw, decimal)
    };
  } else {
    return null;
  }
}

export const currentValue = [
  takeEvery([TRANSACTION.CURRENT_VALUE_SET], setCurrentValueSaga),
  takeEvery(
    [TRANSACTION_FIELDS.GAS_LIMIT_FIELD_SET, TRANSACTION_FIELDS.GAS_PRICE_FIELD_SET],
    revalidateCurrentValue
  )
];
//#endregion Current Value

export const current = [currentTo, ...currentValue];
//#endregion Current

//#region Fields
const SLIDER_DEBOUNCE_INPUT_DELAY = 300;

export function* handleDataInput({ payload }: InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(setDataField({ raw: payload, value: validData ? Data(payload) : null }));
}

export function* handleGasLimitInput({ payload }: InputGasLimitAction): SagaIterator {
  const validGasLimit: boolean = yield call(gasLimitValidator, payload);
  yield put(setGasLimitField({ raw: payload, value: validGasLimit ? Wei(payload) : null }));
}

export function* handleGasPriceInput({ payload }: InputGasPriceAction): SagaIterator {
  const gasPrice = Number(payload);
  const validGasPrice: boolean = yield call(gasPriceValidator, gasPrice);
  yield put(
    setGasPriceField({
      raw: payload,
      value: validGasPrice ? gasPriceToBase(gasPrice) : Wei('0')
    })
  );
}

export function* handleGasPriceInputIntent({ payload }: InputGasPriceIntentAction): SagaIterator {
  yield call(delay, SLIDER_DEBOUNCE_INPUT_DELAY);
  // Important to put and not fork handleGasPriceInput, we want
  // action to go to reducers.
  yield put(inputGasPrice(payload));
}

export function* handleNonceInput({ payload }: InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(setNonceField({ raw: payload, value: validNonce ? Nonce(payload) : null }));
}

export const fieldsSaga = [
  takeEvery(TRANSACTION_FIELDS.DATA_FIELD_INPUT, handleDataInput),
  takeEvery(TRANSACTION_FIELDS.GAS_LIMIT_INPUT, handleGasLimitInput),
  takeEvery(TRANSACTION_FIELDS.GAS_PRICE_INPUT, handleGasPriceInput),
  takeEvery(TRANSACTION_FIELDS.NONCE_INPUT, handleNonceInput),
  takeLatest(TRANSACTION_FIELDS.GAS_PRICE_INPUT_INTENT, handleGasPriceInputIntent)
];
//#endregion Fields

//#region Meta

//#region Token
export function* handleTokenTo({ payload }: SetTokenToMetaAction): SagaIterator {
  const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(getTokenValue);
  if (!(tokenValue.value && payload.value)) {
    return;
  }

  // encode token data and dispatch it
  const data = yield call(encodeTransfer, payload.value, tokenValue.value);
  yield put(setDataField({ raw: bufferToHex(data), value: data }));
}

export function* handleTokenValue({ payload }: SetTokenValueMetaAction) {
  const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
  const prevData = yield select(getData);
  if (!(tokenTo.value && payload.value)) {
    return;
  }
  const data = yield call(encodeTransfer, tokenTo.value, payload.value);
  if (prevData.raw === bufferToHex(data)) {
    return;
  }
  yield put(setDataField({ raw: bufferToHex(data), value: data }));
}

export const handleToken = [
  takeEvery(TRANSACTION_META.TOKEN_TO_META_SET, handleTokenTo),
  takeEvery(TRANSACTION_META.TOKEN_VALUE_META_SET, handleTokenValue)
];
//#endregion Token

//#region Set Unit
export function* handleSetUnitMeta({ payload: currentUnit }: SetUnitMetaAction): SagaIterator {
  const previousUnit: string = yield select(getPreviousUnit);
  const prevUnit = yield select(isNetworkUnit, previousUnit);
  const currUnit = yield select(isNetworkUnit, currentUnit);
  const etherToEther = currUnit && prevUnit;
  const etherToToken = !currUnit && prevUnit;
  const tokenToEther = currUnit && !prevUnit;
  const tokenToToken = !currUnit && !prevUnit;
  const decimal: number = yield select(getDecimalFromUnit, currentUnit);

  if (etherToEther || previousUnit === '') {
    return;
  }

  if (tokenToEther) {
    const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
    const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(getTokenValue);

    //set the 'to' field from what the token 'to' field was
    // if switching to ether, clear token data and value
    const { value, raw }: IInput = yield call(rebaseUserInput, tokenValue);

    const isValid = yield call(validateInput, value, currentUnit);
    return yield put(
      swapTokenToEther({ to: tokenTo, value: { raw, value: isValid ? value : null }, decimal })
    );
  }

  if (etherToToken || tokenToToken) {
    const currentToken: MergedToken | undefined = yield select(getToken, currentUnit);
    if (!currentToken) {
      throw Error('Could not find token during unit swap');
    }
    const input:
      | AppState['transaction']['fields']['value']
      | AppState['transaction']['meta']['tokenValue'] = etherToToken
      ? yield select(getValue)
      : yield select(getTokenValue);
    const { raw, value }: IInput = yield call(rebaseUserInput, input);

    const isValid = yield call(validateInput, value, currentUnit);
    const to: AppState['transaction']['fields']['to'] = yield select(getTo);

    const valueToEncode = isValid && value ? value : TokenValue('0');
    let addressToEncode;
    if (etherToToken) {
      addressToEncode = to.value || Address('0x0');
    } else {
      const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(getTokenTo);
      addressToEncode = tokenTo.value || Address('0x0');
    }

    const data = encodeTransfer(addressToEncode, valueToEncode);

    const basePayload = {
      data: { raw: bufferToHex(data), value: data },
      to: { raw: '', value: Address(currentToken.address) },
      tokenValue: { raw, value: isValid ? value : null },
      decimal
    };
    // need to set meta fields for tokenTo and tokenValue
    if (etherToToken) {
      yield put(
        setSchedulingToggle({
          value: false
        })
      );

      return yield put(
        swapEtherToToken({
          ...basePayload,
          tokenTo: to
        })
      );
    }
    // need to rebase the token if the decimal has changed and re-validate
    if (tokenToToken) {
      return yield put(swapTokenToToken(basePayload));
    }
  }
}

export const handleSetUnit = [takeEvery(TRANSACTION_META.UNIT_META_SET, handleSetUnitMeta)];
//#endregion Set Unit

export const metaSaga = [...handleToken, ...handleSetUnit];
//#endregion Meta

//#region Network

//#region From
/*
* This function will be called during transaction serialization / signing
*/
export function* handleFromRequest(): SagaIterator {
  const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
  try {
    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);
    yield put(getFromSucceeded(fromAddress));
  } catch {
    yield put(showNotification('warning', 'Your wallets address could not be fetched'));
    yield put(getFromFailed());
  }
}

export const fromSaga = takeEvery(TRANSACTION_NETWORK.GET_FROM_REQUESTED, handleFromRequest);
//#endregion From

//#region Gas
export function* shouldEstimateGas(): SagaIterator {
  while (true) {
    const action:
      | SetToFieldAction
      | SetDataFieldAction
      | SwapEtherToTokenAction
      | SwapTokenToTokenAction
      | SwapTokenToEtherAction
      | ToggleAutoGasLimitAction = yield take([
      TRANSACTION_FIELDS.TO_FIELD_SET,
      TRANSACTION_FIELDS.DATA_FIELD_SET,
      TRANSACTION.ETHER_TO_TOKEN_SWAP,
      TRANSACTION.TOKEN_TO_TOKEN_SWAP,
      TRANSACTION.TOKEN_TO_ETHER_SWAP,
      CONFIG_META.TOGGLE_AUTO_GAS_LIMIT
    ]);

    const isOffline: boolean = yield select(getOffline);
    const autoGasLimitEnabled: boolean = yield select(getAutoGasLimitEnabled);
    const message: AddressMessage | undefined = yield select(getCurrentToAddressMessage);

    if (isOffline || !autoGasLimitEnabled || (message && message.gasLimit)) {
      continue;
    }

    // invalid field is a field that the value is null and the input box isnt empty
    // reason being is an empty field is valid because it'll be null
    const invalidField =
      (action.type === TRANSACTION_FIELDS.TO_FIELD_SET ||
        action.type === TRANSACTION_FIELDS.DATA_FIELD_SET) &&
      !action.payload.value &&
      action.payload.raw !== '';

    if (invalidField) {
      continue;
    }
    const { transaction }: IGetTransaction = yield select(getTransaction);

    const { gasLimit, gasPrice, nonce, chainId, ...rest }: IHexStrTransaction = yield call(
      getTransactionFields,
      transaction
    );

    // gas estimation calls with
    // '0x' as an address (contract creation)
    // fail, so instead we set it as undefined
    // interestingly, the transaction itself as '0x' as the
    // to address works fine.
    if (rest.to === '0x') {
      rest.to = undefined as any;
    }

    yield put(estimateGasRequested(rest));
  }
}

export function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(
    TRANSACTION_NETWORK.ESTIMATE_GAS_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const autoGasLimitEnabled: boolean = yield select(getAutoGasLimitEnabled);
    const isOffline = yield select(getOffline);

    if (isOffline || !autoGasLimitEnabled) {
      continue;
    }

    const { payload }: EstimateGasRequestedAction = yield take(requestChan);
    // debounce 250 ms
    yield call(delay, 250);
    const node: INode = yield select(getNodeLib);
    const walletInst: IWallet = yield select(getWalletInst);
    try {
      const from: string = yield apply(walletInst, walletInst.getAddressString);
      const txObj = { ...payload, from };

      const { gasLimit } = yield race({
        gasLimit: apply(node, node.estimateGas, [txObj]),
        timeout: call(delay, 10000)
      });
      if (gasLimit) {
        const gasSetOptions = {
          raw: gasLimit.toString(),
          value: gasLimit
        };

        const scheduling: boolean = yield select(isSchedulingEnabled);

        if (scheduling) {
          yield put(setScheduleGasLimitField(gasSetOptions));
        } else {
          yield put(setGasLimitField(gasSetOptions));
        }

        yield put(estimateGasSucceeded());
      } else {
        yield put(estimateGasTimedout());
        yield call(localGasEstimation, payload);
      }
    } catch (e) {
      yield put(estimateGasFailed());
      yield call(localGasEstimation, payload);
    }
  }
}

export function* localGasEstimation(payload: EstimateGasRequestedAction['payload']) {
  const tx = yield call(makeTransaction, payload);
  const gasLimit = yield apply(tx, tx.getBaseFee);
  yield put(setGasLimitField({ raw: gasLimit.toString(), value: gasLimit }));
}

export function* setAddressMessageGasLimit() {
  const autoGasLimitEnabled: boolean = yield select(getAutoGasLimitEnabled);
  const message: AddressMessage | undefined = yield select(getCurrentToAddressMessage);
  if (autoGasLimitEnabled && message && message.gasLimit) {
    yield put(
      setGasLimitField({
        raw: message.gasLimit.toString(),
        value: new BN(message.gasLimit)
      })
    );
  }
}

export const gas = [
  fork(shouldEstimateGas),
  fork(estimateGas),
  takeEvery(TRANSACTION_FIELDS.TO_FIELD_SET, setAddressMessageGasLimit)
];
//#endregion Gas

//#region Nonce
export function* handleNonceRequest(): SagaIterator {
  const nodeLib: INode = yield select(getNodeLib);
  const walletInst: AppState['wallet']['inst'] = yield select(getWalletInst);
  const isOffline: boolean = yield select(getOffline);
  try {
    if (isOffline || !walletInst) {
      return;
    }

    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);

    const retrievedNonce: string = yield apply(nodeLib, nodeLib.getTransactionCount, [fromAddress]);
    const base10Nonce = Nonce(retrievedNonce);
    yield put(inputNonce(base10Nonce.toString()));
    yield put(getNonceSucceeded(retrievedNonce));
  } catch {
    yield put(showNotification('warning', 'Your addresses nonce could not be fetched'));
    yield put(getNonceFailed());
  }
}

export function* handleNonceRequestWrapper(): SagaIterator {
  const nonceRequest = yield fork(handleNonceRequest);

  yield take(WALLET.SET);
  yield cancel(nonceRequest);
}

//leave get nonce requested for nonce refresh later on
export const nonceSaga = takeEvery(
  [TRANSACTION_NETWORK.GET_NONCE_REQUESTED, WALLET.SET],
  handleNonceRequestWrapper
);
//#endregion Nonce

export const networkSaga = [fromSaga, ...gas, nonceSaga];
//#endregion Network

//#region Signing
export function* signLocalTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);
  yield put(signLocalTransactionSucceeded({ signedTransaction, indexingHash, noVerify: false }));
}

const signLocalTransaction = signTransactionWrapper(signLocalTransactionHandler);

export function* signWeb3TransactionHandler({ tx }: IFullWalletAndTransaction): SagaIterator {
  const serializedTransaction: Buffer = yield apply(tx, tx.serialize);
  const indexingHash: string = yield call(computeIndexingHash, serializedTransaction);

  yield put(
    signWeb3TransactionSucceeded({
      transaction: serializedTransaction,
      indexingHash
    })
  );
}

const signWeb3Transaction = signTransactionWrapper(signWeb3TransactionHandler);

export function* signParitySignerTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const from = yield apply(wallet, wallet.getAddressString);
  const rlp = yield call(transactionToRLP, tx);

  yield put(requestTransactionSignature(from, rlp));

  const { payload }: paritySignerTypes.FinalizeSignatureAction = yield take(
    paritySignerTypes.ParitySignerActions.FINALIZE_SIGNATURE
  );
  const signedTransaction: Buffer = yield call(signTransactionWithSignature, tx, payload);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);

  yield put(signLocalTransactionSucceeded({ signedTransaction, indexingHash, noVerify: false }));
}

const signParitySignerTransaction = signTransactionWrapper(signParitySignerTransactionHandler);

/**
 * @description Verifies that the transaction matches the fields, and if its a locally signed transaction (so it has a signature) it will verify the signature too
 * @param {(SignWeb3TransactionSucceededAction | SignLocalTransactionSucceededAction)} {
 *   type
 * }
 * @returns {SagaIterator}
 */
function* verifyTransaction({
  type,
  payload: { noVerify }
}: SignWeb3TransactionSucceededAction | SignLocalTransactionSucceededAction): SagaIterator {
  if (noVerify) {
    return;
  }
  const transactionsMatch: boolean = yield select(
    serializedAndTransactionFieldsMatch,
    type === TRANSACTION_SIGN.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
    noVerify
  );
  if (!transactionsMatch) {
    yield put(
      showNotification('danger', 'Something went wrong signing your transaction, please try again')
    );
    yield put(resetTransactionRequested());
  }
}

function* handleTransactionRequest(action: SignTransactionRequestedAction): SagaIterator {
  const walletType: IWalletType = yield select(getWalletType);

  const signingHandler = walletType.isWeb3Wallet
    ? signWeb3Transaction
    : walletType.isParitySignerWallet ? signParitySignerTransaction : signLocalTransaction;

  return yield call(signingHandler, action);
}

export const signing = [
  takeEvery(TRANSACTION_SIGN.SIGN_TRANSACTION_REQUESTED, handleTransactionRequest),
  takeEvery(
    [
      TRANSACTION_SIGN.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      TRANSACTION_SIGN.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ],
    verifyTransaction
  )
];
//#endregion Signing

//#region Send Everything
export function* handleSendEverything(): SagaIterator {
  const { transaction }: IGetTransaction = yield select(getTransaction);
  const currentBalance: Wei | TokenValue | null = yield select(getCurrentBalance);
  const etherBalance: AppState['wallet']['balance']['wei'] = yield select(getEtherBalance);
  if (!etherBalance || !currentBalance) {
    return yield put(sendEverythingFailed());
  }
  transaction.value = Buffer.from([]);

  const etherTransaction: boolean = yield select(isEtherTransaction);
  const setter = etherTransaction ? setValueField : setTokenValue;

  // set transaction value to 0 so it's not calculated in the upfrontcost

  const totalCost: Wei = yield apply(transaction, transaction.getUpfrontCost);
  if (totalCost.gt(etherBalance)) {
    // Dust amount is too small
    yield put(
      showNotification(
        'warning',
        `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
      )
    );
    yield put(sendEverythingFailed());

    return yield put(setter({ raw: '0', value: null }));
  }
  if (etherTransaction) {
    const remainder = currentBalance.sub(totalCost);
    const rawVersion = fromWei(remainder, 'ether');
    yield put(setter({ raw: rawVersion, value: remainder }));

    yield put(sendEverythingSucceeded());
  } else {
    // else we just max out the token value
    const decimal: number = yield select(getDecimal);
    const rawVersion = fromTokenBase(currentBalance, decimal);
    yield put(setter({ raw: rawVersion, value: currentBalance }));

    yield put(sendEverythingSucceeded());
  }
}

export const sendEverything = [
  takeEvery(TRANSACTION.SEND_EVERYTHING_REQUESTED, handleSendEverything)
];

//#endregion Send Everything

//#region Reset
export function* resetTransactionState(): SagaIterator {
  const contractInteraction: ReturnType<typeof isContractInteraction> = yield select(
    isContractInteraction
  );
  yield put(resetTransactionSuccessful({ isContractInteraction: contractInteraction }));
}

/**
 * After a transaction is signed, wait for any action that would result in the transaction state changing then fire off
 * a handler that will remove the current serialized transaction so the user does not send a stale transaction
 */
export function* watchTransactionState(): SagaIterator {
  while (true) {
    // wait for transaction to be signed
    yield take([
      TRANSACTION_SIGN.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      TRANSACTION_SIGN.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ]);

    const { bail } = yield race({
      bail: take([TRANSACTION.RESET_REQUESTED, WALLET.RESET]), // bail on actions that would wipe state
      wipeState: take([
        TRANSACTION.CURRENT_TO_SET,
        TRANSACTION.CURRENT_VALUE_SET,
        TRANSACTION_FIELDS.GAS_LIMIT_FIELD_SET,
        TRANSACTION_FIELDS.GAS_PRICE_FIELD_SET,
        TRANSACTION_FIELDS.VALUE_FIELD_SET,
        TRANSACTION_FIELDS.DATA_FIELD_SET,
        TRANSACTION_FIELDS.NONCE_FIELD_SET,
        TRANSACTION_FIELDS.TO_FIELD_SET,
        TRANSACTION_META.TOKEN_TO_META_SET,
        TRANSACTION_META.TOKEN_VALUE_META_SET,
        TRANSACTION_META.UNIT_META_SET
      ]) // watch for any actions that would change transaction state
    });

    if (bail) {
      continue;
    }

    yield put(resetTransactionRequested());
  }
}

export function* setNetworkUnit(): SagaIterator {
  const networkUnit = yield select(getNetworkUnit);
  yield put(setUnitMeta(networkUnit));
}

export const reset = [
  takeEvery([WALLET.RESET], resetTransactionState),
  takeEvery(TRANSACTION.RESET_REQUESTED, resetTransactionState),
  fork(watchTransactionState),
  takeEvery(TRANSACTION.RESET_SUCCESSFUL, setNetworkUnit)
];

//#endregion Reset

export function* transactionSaga(): SagaIterator {
  yield all([
    ...broadcastSaga,
    ...current,
    ...fieldsSaga,
    ...metaSaga,
    ...networkSaga,
    ...signing,
    ...sendEverything,
    ...reset
  ]);
}
