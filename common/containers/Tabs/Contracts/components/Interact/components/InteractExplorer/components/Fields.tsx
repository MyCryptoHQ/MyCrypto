import { GasField } from './GasField';
import { AmountField } from './AmountField';
import React, { Component } from 'react';
import { NonceField, SendButton, SigningStatus } from 'components';
import WalletDecrypt, { DISABLE_WALLETS } from 'components/WalletDecrypt';
import { FullWalletOnly } from 'components/renderCbs';
import { Aux } from 'components/ui';

interface OwnProps {
  button: React.ReactElement<any>;
}
export class Fields extends Component<OwnProps> {
  public render() {
    const makeContent = () => (
      <Aux>
        <GasField />
        <AmountField />
        <NonceField />
        {this.props.button}
        <SigningStatus />
        <SendButton />
      </Aux>
    );

    const makeDecrypt = () => <WalletDecrypt disabledWallets={DISABLE_WALLETS.READ_ONLY} />;

    return <FullWalletOnly withFullWallet={makeContent} withoutFullWallet={makeDecrypt} />;
  }
}
