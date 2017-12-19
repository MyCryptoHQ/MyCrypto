import { UnlockHeader } from 'components/ui';
import React, { Component } from 'react';
import translate from 'translations';
import { isAnyOffline } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface Props {
  allowReadOnly: boolean;
}
export const OfflineAwareUnlockHeader: React.SFC<Props> = ({ allowReadOnly }) => (
  <UnlockHeader title={<Title />} allowReadOnly={allowReadOnly} />
);

interface StateProps {
  shouldDisplayOffline: boolean;
}

class TitleClass extends Component<StateProps> {
  public render() {
    const { shouldDisplayOffline } = this.props;
    const offlineTitle = shouldDisplayOffline ? (
      <span style={{ color: 'red' }}> (Offline)</span>
    ) : null;
    return (
      <div>
        {translate('Account')}
        {offlineTitle}
      </div>
    );
  }
}

const Title = connect((state: AppState) => ({
  shouldDisplayOffline: isAnyOffline(state)
}))(TitleClass);
