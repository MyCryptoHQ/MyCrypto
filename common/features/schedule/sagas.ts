import { SagaIterator, buffers, delay } from 'redux-saga';
import {
  select,
  take,
  call,
  apply,
  fork,
  put,
  all,
  takeLatest,
  actionChannel,
  race
} from 'redux-saga/effects';
import BN from 'bn.js';

import { toTokenBase, Wei, fromWei } from 'libs/units';
import {
  EAC_SCHEDULING_CONFIG,
  parseSchedulingParametersValidity,
  getScheduledTransactionAddressFromReceipt
} from 'libs/scheduling';
import RequestFactory from 'libs/scheduling/contracts/RequestFactory';
import { validDecimal, validNumber } from 'libs/validators';
import * as derivedSelectors from 'features/selectors';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import {
  transactionFieldsTypes,
  transactionFieldsActions,
  transactionMetaSelectors,
  transactionHelpers,
  transactionBroadcastTypes,
  transactionActions
} from 'features/transaction';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';
import { IGetTransaction } from 'features/types';
import * as networkActions from '../transaction/network/actions';
import { getTransactionFields, IHexStrTransaction } from 'libs/transaction';
import { localGasEstimation } from '../transaction/network/sagas';
import { INode } from 'libs/nodes/INode';
import { IWallet } from 'libs/wallet';
import { walletSelectors } from 'features/wallet';
import { notificationsActions } from 'features/notifications';
import { toBuffer } from 'ethereumjs-util';
import erc20 from 'libs/erc20';
import { BroadcastTransactionSucceededAction } from 'features/transaction/broadcast/types';
import { TransactionReceipt } from 'shared/types/transactions';
import { translateRaw } from 'translations';

//#region Schedule Timestamp
export function* setCurrentScheduleTimestampSaga({
  payload: raw
}: types.SetCurrentScheduleTimestampAction): SagaIterator {
  let value: Date | null = null;

  value = new Date(raw);

  yield put(actions.setScheduleTimestampField({ value, raw }));
}

export const currentScheduleTimestamp = takeLatest(
  [types.ScheduleActions.CURRENT_SCHEDULE_TIMESTAMP_SET],
  setCurrentScheduleTimestampSaga
);
//#endregion Schedule Timestamp

//#region Schedule Timezone
export function* setCurrentScheduleTimezoneSaga({
  payload: raw
}: types.SetCurrentScheduleTimezoneAction): SagaIterator {
  const value = raw;

  yield put(actions.setScheduleTimezone({ value, raw }));
}

export const currentScheduleTimezone = takeLatest(
  [types.ScheduleActions.CURRENT_SCHEDULE_TIMEZONE_SET],
  setCurrentScheduleTimezoneSaga
);
//#endregion Schedule Timezone

//#region Scheduling Toggle
export function* setGasLimitForSchedulingSaga({
  payload: { value: useScheduling }
}: types.SetSchedulingToggleAction): SagaIterator {
  if (useScheduling) {
    // setDefaultTimeBounty
    yield put(
      actions.setCurrentTimeBounty(fromWei(EAC_SCHEDULING_CONFIG.TIME_BOUNTY_DEFAULT, 'ether'))
    );
  } else {
    // setGasLimitForSchedulingSaga
    const gasLimit = EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK;

    yield put(
      transactionFieldsActions.setGasLimitField({
        raw: gasLimit.toString(),
        value: gasLimit
      })
    );
  }
}

export const currentSchedulingToggle = takeLatest(
  [types.ScheduleActions.TOGGLE_SET],
  setGasLimitForSchedulingSaga
);
//#endregion Scheduling Toggle

//#region Time Bounty
export function* setCurrentTimeBountySaga({
  payload: raw
}: types.SetCurrentTimeBountyAction): SagaIterator {
  const decimal: number = yield select(transactionMetaSelectors.getDecimal);
  const unit: string = yield select(derivedSelectors.getUnit);

  if (!validNumber(parseInt(raw, 10)) || !validDecimal(raw, decimal)) {
    yield put(actions.setTimeBountyField({ raw, value: new BN(0) }));
  }

  const value = toTokenBase(raw, decimal);
  const isInputValid: boolean = yield call(transactionHelpers.validateInput, value, unit);

  const isValid = isInputValid && value.gte(Wei('0'));

  yield put(actions.setTimeBountyField({ raw, value: isValid ? value : new BN(0) }));
}

export const currentTimeBounty = takeLatest(
  [types.ScheduleActions.CURRENT_TIME_BOUNTY_SET],
  setCurrentTimeBountySaga
);
//#endregion Time Bounty

//#region Deposit
export function* copyTimeBountyToDeposit({
  payload: { value }
}: types.SetTimeBountyFieldAction): SagaIterator {
  if (value && value.gte(new BN(0))) {
    const multipliedValue = value.mul(new BN(EAC_SCHEDULING_CONFIG.BOUNTY_TO_DEPOSIT_MULTIPLIER));

    const raw = fromWei(multipliedValue, 'ether');

    yield put(actions.setScheduleDepositField({ raw, value: multipliedValue }));
  }
}

export const mirrorTimeBountyToDeposit = takeLatest(
  [types.ScheduleActions.TIME_BOUNTY_FIELD_SET],
  copyTimeBountyToDeposit
);
//#endregion

//#region Window Size
export function* setCurrentWindowSizeSaga({
  payload: raw
}: types.SetCurrentWindowSizeAction): SagaIterator {
  let value: BN | null = null;

  if (!validNumber(parseInt(raw, 10))) {
    yield put(actions.setWindowSizeField({ raw, value: null }));
  }

  value = new BN(raw);

  yield put(actions.setWindowSizeField({ value, raw }));
}

export const currentWindowSize = takeLatest(
  [types.ScheduleActions.CURRENT_WINDOW_SIZE_SET],
  setCurrentWindowSizeSaga
);

export const setDefaultWindowSize = takeLatest(
  [types.ScheduleActions.TYPE_SET],
  function* setDefaultWindowSizeFn(): SagaIterator {
    const currentScheduleType: selectors.ICurrentScheduleType = yield select(
      selectors.getCurrentScheduleType
    );

    if (currentScheduleType.value === 'time') {
      yield put(
        actions.setCurrentWindowSize(EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_TIME.toString())
      );
    } else {
      yield put(
        actions.setCurrentWindowSize(EAC_SCHEDULING_CONFIG.WINDOW_SIZE_DEFAULT_BLOCK.toString())
      );
    }
  }
);

//#endregion Window Size

//#region Window Start
export function* setCurrentWindowStartSaga({
  payload: raw
}: types.SetCurrentWindowStartAction): SagaIterator {
  let value: number | null = null;

  value = parseInt(raw, 10);

  yield put(actions.setWindowStartField({ value, raw }));
}

export const currentWindowStart = takeLatest(
  [types.ScheduleActions.CURRENT_WINDOW_START_SET],
  setCurrentWindowStartSaga
);
//#endregion Window Start

//#region Params Validity
export function* shouldValidateParams(): SagaIterator {
  while (true) {
    yield take([
      transactionFieldsTypes.TransactionFieldsActions.TO_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.DATA_FIELD_SET,
      transactionFieldsTypes.TransactionFieldsActions.VALUE_FIELD_SET,
      types.ScheduleActions.CURRENT_TIME_BOUNTY_SET,
      types.ScheduleActions.WINDOW_SIZE_FIELD_SET,
      types.ScheduleActions.WINDOW_START_FIELD_SET,
      types.ScheduleActions.TIMESTAMP_FIELD_SET,
      types.ScheduleActions.TIME_BOUNTY_FIELD_SET,
      types.ScheduleActions.TYPE_SET,
      types.ScheduleActions.TOGGLE_SET,
      types.ScheduleActions.TIMEZONE_SET
    ]);

    yield call(delay, 250);

    const isOffline: boolean = yield select(configMetaSelectors.getOffline);
    const scheduling: boolean = yield select(selectors.isSchedulingEnabled);

    if (isOffline || !scheduling) {
      continue;
    }

    yield call(estimateGasForScheduling);

    yield call(checkSchedulingParametersValidity);
  }
}

function* checkSchedulingParametersValidity() {
  const validateParamsCallData: derivedSelectors.IGetValidateScheduleParamsCallPayload = yield select(
    derivedSelectors.getValidateScheduleParamsCallPayload
  );

  if (!validateParamsCallData) {
    return yield put(
      actions.setScheduleParamsValidity({
        value: false
      })
    );
  }

  const node = yield select(configNodesSelectors.getNodeLib);

  const callResult: string = yield apply(node, node.sendCallRequest, [validateParamsCallData]);

  const { paramsValidity } = RequestFactory.validateRequestParams.decodeOutput(callResult);

  const errors = parseSchedulingParametersValidity(paramsValidity);

  yield put(
    actions.setScheduleParamsValidity({
      value: errors.length === 0
    })
  );
}

function* estimateGasForScheduling() {
  const { transaction }: IGetTransaction = yield select(derivedSelectors.getSchedulingTransaction);

  const { gasLimit, gasPrice, nonce, chainId, ...rest }: IHexStrTransaction = yield call(
    getTransactionFields,
    transaction
  );

  yield put(networkActions.estimateGasRequested(rest));
}

export const schedulingParamsValidity = fork(shouldValidateParams);
//#endregion Params Validity

//#region Estimate Scheduling Gas
export function* estimateSchedulingGas(): SagaIterator {
  const requestChan = yield actionChannel(
    types.ScheduleActions.ESTIMATE_SCHEDULING_GAS_REQUESTED,
    buffers.sliding(1)
  );

  while (true) {
    const autoGasLimitEnabled: boolean = yield select(configMetaSelectors.getAutoGasLimitEnabled);
    const isOffline = yield select(configMetaSelectors.getOffline);

    if (!autoGasLimitEnabled) {
      continue;
    }

    if (isOffline) {
      const gasLimit = EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT;
      const gasSetOptions = {
        raw: gasLimit.toString(),
        value: gasLimit
      };

      yield put(actions.setScheduleGasLimitField(gasSetOptions));

      yield put(actions.estimateSchedulingGasSucceeded());

      continue;
    }

    const { payload }: types.EstimateSchedulingGasRequestedAction = yield take(requestChan);
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

        yield put(actions.setScheduleGasLimitField(gasSetOptions));

        yield put(actions.estimateSchedulingGasSucceeded());
      } else {
        yield put(actions.estimateSchedulingGasTimedout());
        yield call(localGasEstimation, payload);
      }
    } catch (e) {
      yield put(actions.estimateSchedulingGasFailed());
      yield call(localGasEstimation, payload);
    }
  }
}
//#endregion Estimate Scheduling Gas

//#region Prepare Approve Token Transaction
export function* prepareApproveTokenTransaction(): SagaIterator {
  while (true) {
    const action: BroadcastTransactionSucceededAction = yield take([
      transactionBroadcastTypes.TransactionBroadcastActions.TRANSACTION_SUCCEEDED
    ]);

    const isSchedulingEnabled: boolean = yield select(selectors.isSchedulingEnabled);
    const isEtherTransaction: boolean = yield select(derivedSelectors.isEtherTransaction);
    const tokenTransferAmount: { raw: string; value: BN | null } = yield select(
      transactionMetaSelectors.getTokenValue
    );
    const tokenAddress: string = yield select(derivedSelectors.getSelectedTokenContractAddress);
    const node: INode = yield select(configNodesSelectors.getNodeLib);

    if (isSchedulingEnabled && !isEtherTransaction) {
      yield put(
        actions.setScheduledTransactionHash({
          raw: action.payload.broadcastedHash,
          value: action.payload.broadcastedHash
        })
      );

      let receipt: TransactionReceipt | null = null;

      while (!receipt) {
        yield call(delay, 5000);

        try {
          receipt = yield call(node.getTransactionReceipt, action.payload.broadcastedHash);
        } catch (error) {
          continue;
        }
      }

      yield put(actions.setSchedulingToggle({ value: false }));

      yield call(delay, 100);

      yield put(
        notificationsActions.showNotification(
          'info',
          translateRaw('SCHEDULE_TOKEN_TRANSFER_APPROVE'),
          20000
        )
      );

      const scheduledTransactionAddress: string | null = yield call(
        getScheduledTransactionAddressFromReceipt,
        receipt
      );

      yield put(
        transactionActions.swapTokenToEther({
          decimal: 18,
          to: {
            raw: tokenAddress,
            value: toBuffer(tokenAddress)
          },
          value: {
            raw: '0',
            value: new BN('0')
          }
        })
      );

      const approveTokensData = erc20.approve.encodeInput({
        _spender: scheduledTransactionAddress,
        _value: tokenTransferAmount.value
      });

      yield put(
        transactionFieldsActions.setDataField({
          raw: approveTokensData,
          value: toBuffer(approveTokensData)
        })
      );

      yield put(networkActions.getNonceRequested());
    }
  }
}
//#endregion Prepare Approve Token Transaction

export function* scheduleSaga(): SagaIterator {
  yield all([
    currentWindowSize,
    currentWindowStart,
    currentScheduleTimestamp,
    currentTimeBounty,
    currentSchedulingToggle,
    currentScheduleTimezone,
    mirrorTimeBountyToDeposit,
    fork(estimateSchedulingGas),
    schedulingParamsValidity,
    fork(prepareApproveTokenTransaction),
    setDefaultWindowSize
  ]);
}
