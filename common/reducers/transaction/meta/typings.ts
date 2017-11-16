import { SetUnitMetaAction, SetDecimalMetaAction } from 'actions/transaction';

export interface State {
  unit: SetUnitMetaAction['payload'];
  decimal: SetDecimalMetaAction['payload'];
}
