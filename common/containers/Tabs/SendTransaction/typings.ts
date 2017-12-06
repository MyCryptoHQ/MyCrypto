import { Location } from 'history';
import { TResetWallet } from 'actions/wallet';

export interface State {
  generateDisabled: boolean;
  generateTxProcessing: boolean;
}

export interface Props {
  location: Location;
  resetWallet: TResetWallet;
}

export const initialState: State = {
  generateDisabled: true,
  generateTxProcessing: false
};
