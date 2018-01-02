import React, { Component } from 'react';
import WalletDecrypt from 'components/WalletDecrypt';
import { OnlyUnlocked } from 'components/renderCbs';
import { Aux } from 'components/ui';
import { Fields } from './Fields';
import { isUnlocked as isUnlockedSelector } from 'selectors/wallet';
import { configureLiteSend, TConfigureLiteSend } from 'actions/swap';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { shouldDisplayLiteSend } from 'selectors/swap';

interface DispatchProps {
  configureLiteSend: TConfigureLiteSend;
}

interface StateProps {
  shouldDisplay: boolean;
  isUnlocked: boolean;
}

type Props = StateProps & DispatchProps;
class LiteSendClass extends Component<Props> {
  public componentDidMount() {
    this.props.configureLiteSend();
  }

  public render() {
    if (!this.props.shouldDisplay) {
      return null;
    }
    const { isUnlocked } = this.props;
    return <Aux>{isUnlocked ? <OnlyUnlocked whenUnlocked={<Fields />} /> : <WalletDecrypt />}</Aux>;
  }
}

export const LiteSend = connect(
  (state: AppState) => ({
    shouldDisplay: shouldDisplayLiteSend(state),
    isUnlocked: isUnlockedSelector(state)
  }),
  { configureLiteSend }
)(LiteSendClass);
