import { Aux } from 'components/ui';
import { GasLimitField } from './GasLimitField';
import { AmountField } from './AmountField';
import { NonceField } from 'components/NonceField';
import { OfflineAwareUnlockHeader } from 'components/OfflineAwareUnlockHeader';
import { SendButton } from 'components/SendButton';
import React, { Component } from 'react';
import { SigningStatus } from 'components/SigningStatus';
import { OnlyUnlocked } from 'components/renderCbs';

interface OwnProps {
  button: React.ReactElement<any>;
}
export class Fields extends Component<OwnProps> {
  public render() {
    return (
      <Aux>
        <OfflineAwareUnlockHeader allowReadOnly={false} />
        <OnlyUnlocked
          whenUnlocked={
            <Aux>
              <GasLimitField />
              <AmountField />
              <NonceField />
              {this.props.button}
              <SigningStatus />
              <SendButton />
            </Aux>
          }
        />
      </Aux>
    );
  }
}
