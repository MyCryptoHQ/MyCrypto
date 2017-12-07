import { UnlockHeader } from 'components/ui';
import React, { Component } from 'react';
import translate from 'translations';
import { isAnyOffline } from 'selectors/config';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

export const OfflineAwareUnlockHeader: React.SFC<{}> = () => (
  <UnlockHeader title={<Title />} allowReadOnly={true} />
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
        {translate('NAV_SendEther')}
        {offlineTitle}
        />
      </div>
    );
  }
}

const Title = connect((state: AppState) => ({
  shouldDisplayOffline: isAnyOffline(state)
}))(TitleClass);
