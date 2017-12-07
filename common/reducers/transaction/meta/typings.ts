import {
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenToMetaAction,
  GetFromSucceededAction
} from 'actions/transaction';
import { TokenValue } from 'libs/units';

export interface State {
  unit: SetUnitMetaAction['payload'];
  previousUnit: SetUnitMetaAction['payload'];
  decimal: SetDecimalMetaAction['payload'];
  tokenValue: { raw: string; value: TokenValue | null }; // TODO: fix this workaround since some of the payload is optional
  tokenTo: SetTokenToMetaAction['payload'];
  from: GetFromSucceededAction['payload'] | null;
}
