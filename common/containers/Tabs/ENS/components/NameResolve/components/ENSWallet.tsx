import WalletDecrypt from 'components/WalletDecrypt';
import { AppState } from 'reducers';
import React, { Component } from 'react';
import { IWallet } from 'libs/wallet';
import { connect } from 'react-redux';
import { Aux } from 'components/ui';

interface Props {
  text: string;
  wallet: AppState['wallet']['inst'];
  children(wallet: IWallet): React.ReactElement<any>;
}

interface State {
  isHidden: boolean;
}

const initialState = {
  isHidden: false
};

class ENSWalletClass extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    const { wallet, children, text } = this.props;
    const { isHidden } = this.state;

    const CollapseButton = (
      <section className="row text-center">
        <h4 className="col-xs-12 col-sm-12 " onClick={this.toggleHidden}>
          <a>
            <span>{isHidden ? '+ ' : '- '}</span>
            <span>{text}</span>
          </a>
        </h4>
      </section>
    );

    const DecryptComponent = (
      <Aux>
        {CollapseButton}
        {!isHidden && <WalletDecrypt />}
      </Aux>
    );

    return wallet ? (
      <section className="col-xs-12 col-sm-12 text-center">
        {children(wallet)}
      </section>
    ) : (
      DecryptComponent
    );
  }

  private toggleHidden = () =>
    this.setState(({ isHidden }) => ({
      isHidden: !isHidden
    }));
}

export const ENSWallet = connect((state: AppState) => ({
  wallet: state.wallet.inst
}))(ENSWalletClass);
