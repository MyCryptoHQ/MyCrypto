import { TResetWallet } from 'actions/wallet';

export interface State {
  generateDisabled: boolean;
  generateTxProcessing: boolean;
}

export interface Props {
  resetWallet: TResetWallet;
}

export const initialState: State = {
  generateDisabled: true,
  generateTxProcessing: false
};
