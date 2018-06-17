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
import { IWallet } from 'libs/wallet';
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
import * as selectors from 'features/selectors';
import * as configMetaTypes from 'features/config/meta/types';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as configSelectors from 'features/config/selectors';
import * as ensTypes from 'features/ens/types';
import * as ensActions from 'features/ens/actions';
import * as ensSelectors from 'features/ens/selectors';
import * as walletTypes from 'features/wallet/types';
import * as walletSelectors from 'features/wallet/selectors';
import * as paritySignerTypes from 'features/paritySigner/types';
import * as paritySignerActions from 'features/paritySigner/actions';
import * as scheduleActions from 'features/schedule/actions';
import * as scheduleSelectors from 'features/schedule/selectors';
import * as notificationsActions from 'features/notifications/actions';
import * as transactionBroadcastSagas from './broadcast/sagas';
import * as transactionFieldsTypes from './fields/types';
import * as transactionFieldsActions from './fields/actions';
import * as transactionFieldsSelectors from './fields/selectors';
import * as transactionMetaTypes from './meta/types';
import * as transactionMetaActions from './meta/actions';
import * as transactionMetaSelectors from './meta/selectors';
import * as transactionNetworkTypes from './network/types';
import * as transactionNetworkActions from './network/actions';
import * as transactionSignTypes from './sign/types';
import * as transactionSignActions from './sign/actions';
import * as types from './types';
import * as actions from './actions';
import * as transactionSelectors from './selectors';
import * as helpers from './helpers';

//#region Broadcast

//#endregion Broadcast

//#region Current

//#region Current To
export function* setCurrentToSaga({ payload: raw }: types.SetCurrentToAction): SagaIterator {
  const isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn> = yield select(
    configSelectors.getIsValidAddressFn
  );
  const validAddress: boolean = yield call(isValidAddress, raw);
  const validEns: boolean = yield call(isValidENSAddress, raw);

  let value: Buffer | null = null;
  if (validAddress) {
    value = Address(raw);
  } else if (validEns) {
    yield call(setField, { value, raw });

    const [domain] = raw.split('.');
    yield put(ensActions.resolveDomainRequested(domain));
    yield take([
      ensTypes.ENSActions.RESOLVE_DOMAIN_FAILED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_SUCCEEDED,
      ensTypes.ENSActions.RESOLVE_DOMAIN_CACHED
    ]);
    const resolvedAddress: string | null = yield select(ensSelectors.getResolvedAddress, true);
    if (resolvedAddress) {
      value = Address(resolvedAddress);
    }
  }

  yield call(setField, { value, raw });
}

export function* setField(
  payload:
    | transactionFieldsTypes.SetToFieldAction['payload']
    | transactionMetaTypes.SetTokenToMetaAction['payload']
) {
  const etherTransaction: boolean = yield select(selectors.isEtherTransaction);

  if (etherTransaction) {
    yield put(transactionFieldsActions.setToField(payload));
  } else {
    yield put(transactionMetaActions.setTokenTo(payload));
  }
}

export const currentTo = takeLatest([types.TransactionActions.CURRENT_TO_SET], setCurrentToSaga);
//#endregion Current To

//#region Current Value
export function* setCurrentValueSaga(action: types.SetCurrentValueAction): SagaIterator {
  const etherTransaction = yield select(selectors.isEtherTransaction);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;
  return yield call(valueHandler, action, setter);
}

export function* valueHandler(
  { payload }: types.SetCurrentValueAction,
  setter: transactionFieldsActions.TSetValueField | transactionMetaActions.TSetTokenValue
) {
  const decimal: number = yield select(transactionMetaSelectors.getDecimal);
  const unit: string = yield select(selectors.getUnit);
  const isEth = yield select(selectors.isEtherTransaction);
  const validNum = isEth ? validNumber : validPositiveNumber;

  if (!validNum(Number(payload)) || !validDecimal(payload, decimal)) {
    return yield put(setter({ raw: payload, value: null }));
  }
  const value = toTokenBase(payload, decimal);
  const isValid: boolean = yield call(helpers.validateInput, value, unit);

  yield put(setter({ raw: payload, value: isValid ? value : null }));
}

export function* revalidateCurrentValue(): SagaIterator {
  const etherTransaction = yield select(selectors.isEtherTransaction);
  const currVal: selectors.ICurrentValue = yield select(selectors.getCurrentValue);
  const reparsedValue: null | selectors.ICurrentValue = yield call(reparseCurrentValue, currVal);
  const unit: string = yield select(selectors.getUnit);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;
  if (!reparsedValue || !reparsedValue.value) {
    return yield put(setter({ raw: currVal.raw, value: null }));
  }
  const isValid: boolean = yield call(helpers.validateInput, reparsedValue.value, unit);
  const newVal = { raw: reparsedValue.raw, value: isValid ? reparsedValue.value : null };

  if (isValueDifferent(currVal, newVal)) {
    yield put(setter(newVal));
  }
}

export function isValueDifferent(curVal: selectors.ICurrentValue, newVal: selectors.ICurrentValue) {
  const val1 = curVal.value as BN;
  const val2 = newVal.value as BN;

  if (curVal.raw !== newVal.raw) {
    return true;
  }
  if (BN.isBN(val1) && BN.isBN(val2)) {
    return !val1.eq(val2);
  }
  if (curVal.value !== newVal.value) {
    return true;
  }
}

export function* reparseCurrentValue(value: helpers.IInput): SagaIterator {
  const isEth = yield select(selectors.isEtherTransaction);
  const decimal = yield select(transactionMetaSelectors.getDecimal);
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
  takeEvery([types.TransactionActions.CURRENT_VALUE_SET], setCurrentValueSaga),
  takeEvery(
    [
      transactionFieldsTypes.TransactionFieldsActions.GAS_LIMIT_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_FIELD_SET
    ],
    revalidateCurrentValue
  )
];
//#endregion Current Value

export const current = [currentTo, ...currentValue];
//#endregion Current

//#region Fields
const SLIDER_DEBOUNCE_INPUT_DELAY = 300;

export function* handleDataInput({
  payload
}: transactionFieldsTypes.InputDataAction): SagaIterator {
  const validData: boolean = yield call(isValidHex, payload);
  yield put(
    transactionFieldsActions.setDataField({ raw: payload, value: validData ? Data(payload) : null })
  );
}

export function* handleGasLimitInput({
  payload
}: transactionFieldsTypes.InputGasLimitAction): SagaIterator {
  const validGasLimit: boolean = yield call(gasLimitValidator, payload);
  yield put(
    transactionFieldsActions.setGasLimitField({
      raw: payload,
      value: validGasLimit ? Wei(payload) : null
    })
  );
}

export function* handleGasPriceInput({
  payload
}: transactionFieldsTypes.InputGasPriceAction): SagaIterator {
  const gasPrice = Number(payload);
  const validGasPrice: boolean = yield call(gasPriceValidator, gasPrice);
  yield put(
    transactionFieldsActions.setGasPriceField({
      raw: payload,
      value: validGasPrice ? gasPriceToBase(gasPrice) : Wei('0')
    })
  );
}

export function* handleGasPriceInputIntent({
  payload
}: transactionFieldsTypes.InputGasPriceIntentAction): SagaIterator {
  yield call(delay, SLIDER_DEBOUNCE_INPUT_DELAY);
  // Important to put and not fork handleGasPriceInput, we want
  // action to go to reducers.
  yield put(transactionFieldsActions.inputGasPrice(payload));
}

export function* handleNonceInput({
  payload
}: transactionFieldsTypes.InputNonceAction): SagaIterator {
  const validNonce: boolean = yield call(isValidNonce, payload);
  yield put(
    transactionFieldsActions.setNonceField({
      raw: payload,
      value: validNonce ? Nonce(payload) : null
    })
  );
}

export const fieldsSaga = [
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_INPUT, handleDataInput),
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.GAS_LIMIT_INPUT, handleGasLimitInput),
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_INPUT, handleGasPriceInput),
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.NONCE_INPUT, handleNonceInput),
  takeLatest(
    transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_INPUT_INTENT,
    handleGasPriceInputIntent
  )
];
//#endregion Fields

//#region Meta

//#region Token
export function* handleTokenTo({
  payload
}: transactionMetaTypes.SetTokenToMetaAction): SagaIterator {
  const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(
    transactionMetaSelectors.getTokenValue
  );
  if (!(tokenValue.value && payload.value)) {
    return;
  }

  // encode token data and dispatch it
  const data = yield call(encodeTransfer, payload.value, tokenValue.value);
  yield put(transactionFieldsActions.setDataField({ raw: bufferToHex(data), value: data }));
}

export function* handleTokenValue({ payload }: transactionMetaTypes.SetTokenValueMetaAction) {
  const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(
    transactionMetaSelectors.getTokenTo
  );
  const prevData = yield select(transactionFieldsSelectors.getData);
  if (!(tokenTo.value && payload.value)) {
    return;
  }
  const data = yield call(encodeTransfer, tokenTo.value, payload.value);
  if (prevData.raw === bufferToHex(data)) {
    return;
  }
  yield put(transactionFieldsActions.setDataField({ raw: bufferToHex(data), value: data }));
}

export const handleToken = [
  takeEvery(transactionMetaTypes.TransactionMetaActions.TOKEN_TO_META_SET, handleTokenTo),
  takeEvery(transactionMetaTypes.TransactionMetaActions.TOKEN_VALUE_META_SET, handleTokenValue)
];
//#endregion Token

//#region Set Unit
export function* handleSetUnitMeta({
  payload: currentUnit
}: transactionMetaTypes.SetUnitMetaAction): SagaIterator {
  const previousUnit: string = yield select(transactionSelectors.getPreviousUnit);
  const prevUnit = yield select(configSelectors.isNetworkUnit, previousUnit);
  const currUnit = yield select(configSelectors.isNetworkUnit, currentUnit);
  const etherToEther = currUnit && prevUnit;
  const etherToToken = !currUnit && prevUnit;
  const tokenToEther = currUnit && !prevUnit;
  const tokenToToken = !currUnit && !prevUnit;
  const decimal: number = yield select(selectors.getDecimalFromUnit, currentUnit);

  if (etherToEther || previousUnit === '') {
    return;
  }

  if (tokenToEther) {
    const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(
      transactionMetaSelectors.getTokenTo
    );
    const tokenValue: AppState['transaction']['meta']['tokenValue'] = yield select(
      transactionMetaSelectors.getTokenValue
    );

    //set the 'to' field from what the token 'to' field was
    // if switching to ether, clear token data and value
    const { value, raw }: helpers.IInput = yield call(helpers.rebaseUserInput, tokenValue);

    const isValid = yield call(helpers.validateInput, value, currentUnit);
    return yield put(
      actions.swapTokenToEther({
        to: tokenTo,
        value: { raw, value: isValid ? value : null },
        decimal
      })
    );
  }

  if (etherToToken || tokenToToken) {
    const currentToken: walletTypes.MergedToken | undefined = yield select(
      selectors.getToken,
      currentUnit
    );
    if (!currentToken) {
      throw Error('Could not find token during unit swap');
    }
    const input:
      | AppState['transaction']['fields']['value']
      | AppState['transaction']['meta']['tokenValue'] = etherToToken
      ? yield select(transactionFieldsSelectors.getValue)
      : yield select(transactionMetaSelectors.getTokenValue);
    const { raw, value }: helpers.IInput = yield call(helpers.rebaseUserInput, input);

    const isValid = yield call(helpers.validateInput, value, currentUnit);
    const to: AppState['transaction']['fields']['to'] = yield select(
      transactionFieldsSelectors.getTo
    );

    const valueToEncode = isValid && value ? value : TokenValue('0');
    let addressToEncode;
    if (etherToToken) {
      addressToEncode = to.value || Address('0x0');
    } else {
      const tokenTo: AppState['transaction']['meta']['tokenTo'] = yield select(
        transactionMetaSelectors.getTokenTo
      );
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
        scheduleActions.setSchedulingToggle({
          value: false
        })
      );

      return yield put(
        actions.swapEtherToToken({
          ...basePayload,
          tokenTo: to
        })
      );
    }
    // need to rebase the token if the decimal has changed and re-validate
    if (tokenToToken) {
      return yield put(actions.swapTokenToToken(basePayload));
    }
  }
}

export const handleSetUnit = [
  takeEvery(transactionMetaTypes.TransactionMetaActions.UNIT_META_SET, handleSetUnitMeta)
];
//#endregion Set Unit

export const metaSaga = [...handleToken, ...handleSetUnit];
//#endregion Meta

//#region Network

//#region From
/*
* This function will be called during transaction serialization / signing
*/
export function* handleFromRequest(): SagaIterator {
  const walletInst: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
  try {
    if (!walletInst) {
      throw Error();
    }
    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);
    yield put(transactionNetworkActions.getFromSucceeded(fromAddress));
  } catch {
    yield put(
      notificationsActions.showNotification('warning', 'Your wallets address could not be fetched')
    );
    yield put(transactionNetworkActions.getFromFailed());
  }
}

export const fromSaga = takeEvery(
  transactionNetworkTypes.TransactionNetworkActions.GET_FROM_REQUESTED,
  handleFromRequest
);
//#endregion From

//#region Gas
export function* shouldEstimateGas(): SagaIterator {
  while (true) {
    const action:
      | transactionFieldsTypes.SetToFieldAction
      | transactionFieldsTypes.SetValueFieldAction
      | transactionFieldsTypes.SetDataFieldAction
      | types.SwapEtherToTokenAction
      | types.SwapTokenToTokenAction
      | types.SwapTokenToEtherAction
      | configMetaTypes.ToggleAutoGasLimitAction
      | transactionFieldsTypes.SetValueFieldAction = yield take([
      transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
      types.TransactionActions.ETHER_TO_TOKEN_SWAP,
      types.TransactionActions.TOKEN_TO_TOKEN_SWAP,
      types.TransactionActions.TOKEN_TO_ETHER_SWAP,
      configMetaTypes.CONFIG_META.TOGGLE_AUTO_GAS_LIMIT
    ]);

    const isOffline: boolean = yield select(configMetaSelectors.getOffline);
    const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
    const message: AddressMessage | undefined = yield select(selectors.getCurrentToAddressMessage);

    if (isOffline || !autoGasLimitEnabled || (message && message.gasLimit)) {
      continue;
    }

    // invalid field is a field that the value is null and the input box isnt empty
    // reason being is an empty field is valid because it'll be null
    const invalidField =
      (action.type === transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET ||
        action.type === transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET ||
        action.type === transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET) &&
      !action.payload.value &&
      action.payload.raw !== '';

    if (invalidField) {
      continue;
    }
    const { transaction }: selectors.IGetTransaction = yield select(selectors.getTransaction);

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

    yield put(transactionNetworkActions.estimateGasRequested(rest));
  }
}

export function* estimateGas(): SagaIterator {
  const requestChan = yield actionChannel(
    transactionNetworkTypes.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
    const isOffline = yield select(configMetaSelectors.getOffline);

    if (isOffline || !autoGasLimitEnabled) {
      continue;
    }

    const { payload }: transactionNetworkTypes.EstimateGasRequestedAction = yield take(requestChan);
    // debounce 250 ms
    yield call(delay, 250);
    const node: INode = yield select(configNodesSelectors.getNodeLib);
    const walletInst: IWallet = yield select(walletSelectors.getWalletInst);
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

        const scheduling: boolean = yield select(scheduleSelectors.isSchedulingEnabled);

        if (scheduling) {
          yield put(scheduleActions.setScheduleGasLimitField(gasSetOptions));
        } else {
          yield put(transactionFieldsActions.setGasLimitField(gasSetOptions));
        }

        yield put(transactionNetworkActions.estimateGasSucceeded());
      } else {
        yield put(transactionNetworkActions.estimateGasTimedout());
        yield call(localGasEstimation, payload);
      }
    } catch (e) {
      yield put(transactionNetworkActions.estimateGasFailed());
      yield call(localGasEstimation, payload);
    }
  }
}

export function* localGasEstimation(
  payload: transactionNetworkTypes.EstimateGasRequestedAction['payload']
) {
  const tx = yield call(makeTransaction, payload);
  const gasLimit = yield apply(tx, tx.getBaseFee);
  yield put(
    transactionFieldsActions.setGasLimitField({ raw: gasLimit.toString(), value: gasLimit })
  );
}

export function* setAddressMessageGasLimit() {
  const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
  const message: AddressMessage | undefined = yield select(selectors.getCurrentToAddressMessage);
  if (autoGasLimitEnabled && message && message.gasLimit) {
    yield put(
      transactionFieldsActions.setGasLimitField({
        raw: message.gasLimit.toString(),
        value: new BN(message.gasLimit)
      })
    );
  }
}

export const gas = [
  fork(shouldEstimateGas),
  fork(estimateGas),
  takeEvery(transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET, setAddressMessageGasLimit)
];
//#endregion Gas

//#region Nonce
export function* handleNonceRequest(): SagaIterator {
  const nodeLib: INode = yield select(configNodesSelectors.getNodeLib);
  const walletInst: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
  const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  try {
    if (isOffline || !walletInst) {
      return;
    }

    const fromAddress: string = yield apply(walletInst, walletInst.getAddressString);

    const retrievedNonce: string = yield apply(nodeLib, nodeLib.getTransactionCount, [fromAddress]);
    const base10Nonce = Nonce(retrievedNonce);
    yield put(transactionFieldsActions.inputNonce(base10Nonce.toString()));
    yield put(transactionNetworkActions.getNonceSucceeded(retrievedNonce));
  } catch {
    yield put(
      notificationsActions.showNotification('warning', 'Your addresses nonce could not be fetched')
    );
    yield put(transactionNetworkActions.getNonceFailed());
  }
}

export function* handleNonceRequestWrapper(): SagaIterator {
  const nonceRequest = yield fork(handleNonceRequest);

  yield take(walletTypes.WalletActions.SET);
  yield cancel(nonceRequest);
}

//leave get nonce requested for nonce refresh later on
export const nonceSaga = takeEvery(
  [
    transactionNetworkTypes.TransactionNetworkActions.GET_NONCE_REQUESTED,
    walletTypes.WalletActions.SET
  ],
  handleNonceRequestWrapper
);
//#endregion Nonce

export const networkSaga = [fromSaga, ...gas, nonceSaga];
//#endregion Network

//#region Signing
export function* signLocalTransactionHandler({
  tx,
  wallet
}: helpers.IFullWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);
  yield put(
    transactionSignActions.signLocalTransactionSucceeded({
      signedTransaction,
      indexingHash,
      noVerify: false
    })
  );
}

const signLocalTransaction = helpers.signTransactionWrapper(signLocalTransactionHandler);

export function* signWeb3TransactionHandler({
  tx
}: helpers.IFullWalletAndTransaction): SagaIterator {
  const serializedTransaction: Buffer = yield apply(tx, tx.serialize);
  const indexingHash: string = yield call(computeIndexingHash, serializedTransaction);

  yield put(
    transactionSignActions.signWeb3TransactionSucceeded({
      transaction: serializedTransaction,
      indexingHash
    })
  );
}

const signWeb3Transaction = helpers.signTransactionWrapper(signWeb3TransactionHandler);

export function* signParitySignerTransactionHandler({
  tx,
  wallet
}: helpers.IFullWalletAndTransaction): SagaIterator {
  const from = yield apply(wallet, wallet.getAddressString);
  const rlp = yield call(transactionToRLP, tx);

  yield put(paritySignerActions.requestTransactionSignature(from, rlp));

  const { payload }: paritySignerTypes.FinalizeSignatureAction = yield take(
    paritySignerTypes.ParitySignerActions.FINALIZE_SIGNATURE
  );
  const signedTransaction: Buffer = yield call(signTransactionWithSignature, tx, payload);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);

  yield put(
    transactionSignActions.signLocalTransactionSucceeded({
      signedTransaction,
      indexingHash,
      noVerify: false
    })
  );
}

const signParitySignerTransaction = helpers.signTransactionWrapper(
  signParitySignerTransactionHandler
);

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
}:
  | transactionSignTypes.SignWeb3TransactionSucceededAction
  | transactionSignTypes.SignLocalTransactionSucceededAction): SagaIterator {
  if (noVerify) {
    return;
  }
  const transactionsMatch: boolean = yield select(
    selectors.serializedAndTransactionFieldsMatch,
    type === transactionSignTypes.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
    noVerify
  );
  if (!transactionsMatch) {
    yield put(
      notificationsActions.showNotification(
        'danger',
        'Something went wrong signing your transaction, please try again'
      )
    );
    yield put(transactionFieldsActions.resetTransactionRequested());
  }
}

function* handleTransactionRequest(
  action: transactionSignTypes.SignTransactionRequestedAction
): SagaIterator {
  const walletType: walletSelectors.IWalletType = yield select(walletSelectors.getWalletType);

  const signingHandler = walletType.isWeb3Wallet
    ? signWeb3Transaction
    : walletType.isParitySignerWallet ? signParitySignerTransaction : signLocalTransaction;

  return yield call(signingHandler, action);
}

export const signing = [
  takeEvery(
    transactionSignTypes.TransactionSignActions.SIGN_TRANSACTION_REQUESTED,
    handleTransactionRequest
  ),
  takeEvery(
    [
      transactionSignTypes.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      transactionSignTypes.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ],
    verifyTransaction
  )
];
//#endregion Signing

//#region Send Everything
export function* handleSendEverything(): SagaIterator {
  const { transaction }: selectors.IGetTransaction = yield select(selectors.getTransaction);
  const currentBalance: Wei | TokenValue | null = yield select(selectors.getCurrentBalance);
  const etherBalance: AppState['wallet']['balance']['wei'] = yield select(
    walletSelectors.getEtherBalance
  );
  if (!etherBalance || !currentBalance) {
    return yield put(actions.sendEverythingFailed());
  }
  transaction.value = Buffer.from([]);

  const etherTransaction: boolean = yield select(selectors.isEtherTransaction);
  const setter = etherTransaction
    ? transactionFieldsActions.setValueField
    : transactionMetaActions.setTokenValue;

  // set transaction value to 0 so it's not calculated in the upfrontcost

  const totalCost: Wei = yield apply(transaction, transaction.getUpfrontCost);
  if (totalCost.gt(etherBalance)) {
    // Dust amount is too small
    yield put(
      notificationsActions.showNotification(
        'warning',
        `The cost of gas is higher than your balance. Total cost: ${totalCost} >  Your Ether balance: ${etherBalance}`
      )
    );
    yield put(actions.sendEverythingFailed());

    return yield put(setter({ raw: '0', value: null }));
  }
  if (etherTransaction) {
    const remainder = currentBalance.sub(totalCost);
    const rawVersion = fromWei(remainder, 'ether');
    yield put(setter({ raw: rawVersion, value: remainder }));

    yield put(actions.sendEverythingSucceeded());
  } else {
    // else we just max out the token value
    const decimal: number = yield select(transactionMetaSelectors.getDecimal);
    const rawVersion = fromTokenBase(currentBalance, decimal);
    yield put(setter({ raw: rawVersion, value: currentBalance }));

    yield put(actions.sendEverythingSucceeded());
  }
}

export const sendEverything = [
  takeEvery(types.TransactionActions.SEND_EVERYTHING_REQUESTED, handleSendEverything)
];

//#endregion Send Everything

//#region Reset
export function* resetTransactionState(): SagaIterator {
  const contractInteraction: ReturnType<
    typeof transactionMetaSelectors.isContractInteraction
  > = yield select(transactionMetaSelectors.isContractInteraction);
  yield put(
    transactionFieldsActions.resetTransactionSuccessful({
      isContractInteraction: contractInteraction
    })
  );
}

/**
 * After a transaction is signed, wait for any action that would result in the transaction state changing then fire off
 * a handler that will remove the current serialized transaction so the user does not send a stale transaction
 */
export function* watchTransactionState(): SagaIterator {
  while (true) {
    // wait for transaction to be signed
    yield take([
      transactionSignTypes.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      transactionSignTypes.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED
    ]);

    const { bail } = yield race({
      bail: take([types.TransactionActions.RESET_REQUESTED, walletTypes.WalletActions.RESET]), // bail on actions that would wipe state
      wipeState: take([
        types.TransactionActions.CURRENT_TO_SET,
        types.TransactionActions.CURRENT_VALUE_SET,
        transactionFieldsTypes.TransactionFieldsActions.GAS_LIMIT_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.NONCE_FIELD_SET,
        transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
        transactionMetaTypes.TransactionMetaActions.TOKEN_TO_META_SET,
        transactionMetaTypes.TransactionMetaActions.TOKEN_VALUE_META_SET,
        transactionMetaTypes.TransactionMetaActions.UNIT_META_SET
      ]) // watch for any actions that would change transaction state
    });

    if (bail) {
      continue;
    }

    yield put(transactionFieldsActions.resetTransactionRequested());
  }
}

export function* setNetworkUnit(): SagaIterator {
  const networkUnit = yield select(configSelectors.getNetworkUnit);
  yield put(transactionMetaActions.setUnitMeta(networkUnit));
}

export const reset = [
  takeEvery([walletTypes.WalletActions.RESET], resetTransactionState),
  takeEvery(types.TransactionActions.RESET_REQUESTED, resetTransactionState),
  fork(watchTransactionState),
  takeEvery(types.TransactionActions.RESET_SUCCESSFUL, setNetworkUnit)
];

//#endregion Reset

export function* transactionSaga(): SagaIterator {
  yield all([
    ...transactionBroadcastSagas.broadcastSaga,
    ...current,
    ...fieldsSaga,
    ...metaSaga,
    ...networkSaga,
    ...signing,
    ...sendEverything,
    ...reset
  ]);
}
