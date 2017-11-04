import WalletDecrypt from 'components/WalletDecrypt';
import { AppState } from 'reducers';
import { Component } from 'react';

interface Props {
  text: string;
  wallet: AppState['wallet'];
}

interface State {
  isHidden: boolean;
}

const initialState = {
  isHidden: false
};
class ENSWallet extends Component<Props, State> {
  public state: State = initialState;

  public render() {}
}
