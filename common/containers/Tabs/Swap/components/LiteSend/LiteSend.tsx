import { SwapInput } from 'reducers/swap/types';
import React, { Component } from 'react';
import { OfflineAwareUnlockHeader } from 'components';
import { OnlyUnlocked } from 'components/renderCbs';
import { Aux } from 'components/ui';
import { Fields } from './Fields';

export interface OwnProps {
  unit: SwapInput['id'];
  amount: SwapInput['amount'];
  address: string | null;
}

class LiteSend extends Component<OwnProps> {
  public render() {
    if (!this.props.address) {
      return null;
    }

    return (
      <Aux>
        <OfflineAwareUnlockHeader allowReadOnly={false} />
        <OnlyUnlocked whenUnlocked={<Fields />} />
      </Aux>
    );
  }
}
