import { SetUnitMetaAction, SetDecimalMetaAction } from 'actions/transaction';
import { TokenValue } from 'libs/units';

export interface State {
  unit: SetUnitMetaAction['payload'];
  decimal: SetDecimalMetaAction['payload'];
  tokenValue: { raw: string; value: TokenValue | null }; // TODO: fix this workaround since some of the payload is optional
}
