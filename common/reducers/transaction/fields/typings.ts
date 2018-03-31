import {
  SetToFieldAction,
  SetDataFieldAction,
  SetNonceFieldAction,
  SetGasLimitFieldAction,
  SetWindowSizeFieldAction,
  SetWindowStartFieldAction,
  SetScheduleTimestampFieldAction,
  SetScheduleTypeAction,
  SetSchedulingToggleAction,
  SetScheduleGasPriceFieldAction,
  SetScheduleGasLimitFieldAction,
  SetScheduleDepositFieldAction
} from 'actions/transaction';
import { Wei } from 'libs/units';

export interface State {
  to: SetToFieldAction['payload'];
  data: SetDataFieldAction['payload'];
  nonce: SetNonceFieldAction['payload'];
  value: { raw: string; value: Wei | null }; // TODO: fix this workaround since some of the payload is optional
  gasLimit: SetGasLimitFieldAction['payload'];
  gasPrice: { raw: string; value: Wei };
  schedulingToggle: SetSchedulingToggleAction['payload'];
  timeBounty: { raw: string; value: Wei };
  windowSize: SetWindowSizeFieldAction['payload'];
  windowStart: SetWindowStartFieldAction['payload'];
  scheduleTimestamp: SetScheduleTimestampFieldAction['payload'];
  scheduleType: SetScheduleTypeAction['payload'];
  scheduleGasLimit: SetScheduleGasLimitFieldAction['payload'];
  scheduleGasPrice: SetScheduleGasPriceFieldAction['payload'];
  scheduleDeposit: SetScheduleDepositFieldAction['payload'];
}
