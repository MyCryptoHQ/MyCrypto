import { Aux } from 'components/ui';
import { GasField } from './GasField';
import { AmountField } from './AmountField';
import { NonceField } from 'components/NonceField';
import { OfflineAwareUnlockHeader } from 'components/OfflineAwareUnlockHeader';
import { isUnlocked } from 'selectors/wallet';
import { SendButton } from 'components/SendButton';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { SigningStatus } from 'components/SigningStatus';

interface StateProps {
  unlocked: boolean;
}
interface OwnProps {
  button: React.ReactElement<any>;
}
class FieldsClass extends Component<StateProps & OwnProps> {
  public render() {
    return this.props.unlocked ? (
      <Aux>
        <GasField />
        <AmountField />
        <NonceField />
        {this.props.button}
        <SigningStatus />
        <SendButton />
      </Aux>
    ) : (
      <OfflineAwareUnlockHeader />
    );
  }
}

export const Fields = connect((state: AppState) => ({ unlocked: isUnlocked(state) }))(FieldsClass);
export const FieldsClas: React.SFC<{}> = () => (
  <Aux>
    <OfflineAwareUnlockHeader />
    <GasField />
    <AmountField />
    <NonceField />
  </Aux>
);
