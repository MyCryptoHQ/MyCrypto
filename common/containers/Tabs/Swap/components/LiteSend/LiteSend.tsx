import React, { Component } from 'react';
import { OfflineAwareUnlockHeader } from 'components';
import { OnlyUnlocked } from 'components/renderCbs';
import { Aux } from 'components/ui';
import { Fields } from './Fields';
import { configureLiteSend, TConfigureLiteSend } from 'actions/swap';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { shouldDisplayLiteSend } from 'selectors/swap';

interface DispatchProps {
  configureLiteSend: TConfigureLiteSend;
}

interface StateProps {
  shouldDisplay: boolean;
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
    return (
      <Aux>
        <OfflineAwareUnlockHeader allowReadOnly={false} />
        <OnlyUnlocked whenUnlocked={<Fields />} />
      </Aux>
    );
  }
}

export const LiteSend = connect(
  (state: AppState) => ({ shouldDisplay: shouldDisplayLiteSend(state) }),
  { configureLiteSend }
)(LiteSendClass);
