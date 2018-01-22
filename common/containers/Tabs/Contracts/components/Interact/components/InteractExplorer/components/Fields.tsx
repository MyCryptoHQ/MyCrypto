import { AmountField } from './AmountField';
import React, { Component } from 'react';
import { SendButton, SigningStatus, GasSlider, NonceField } from 'components';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { FullWalletOnly } from 'components/renderCbs';

interface OwnProps {
  button: React.ReactElement<any>;
}
export class Fields extends Component<OwnProps> {
  public render() {
    const makeContent = () => (
      <React.Fragment>
        <AmountField />
        <NonceField alwaysDisplay={false} />
        <GasSlider readOnly={true} />
        {this.props.button}
        <SigningStatus />
        <SendButton />
      </React.Fragment>
    );

    const makeDecrypt = () => <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} />;

    return <FullWalletOnly withFullWallet={makeContent} withoutFullWallet={makeDecrypt} />;
  }
}
