import {
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenValueMetaAction
} from 'actions/transaction';

export interface State {
  unit: SetUnitMetaAction['payload'];
  decimal: SetDecimalMetaAction['payload'];
  tokenValue: SetTokenValueMetaAction['payload'];
}
