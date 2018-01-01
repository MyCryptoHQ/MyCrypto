import {
  SetToFieldAction,
  SetDataFieldAction,
  SetNonceFieldAction,
  SetGasLimitFieldAction
} from 'actions/transaction';
import { Wei } from 'libs/units';

export interface State {
  to: SetToFieldAction['payload'];
  data: SetDataFieldAction['payload'];
  nonce: SetNonceFieldAction['payload'];
  value: { raw: string; value: Wei | null }; // TODO: fix this workaround since some of the payload is optional
  gasLimit: SetGasLimitFieldAction['payload'];
  gasPrice: { raw: string; value: Wei };
}
