import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface Offline {
  offline: boolean;
  forceOffline: boolean;
}

interface Props extends Offline {
  withOffline({ offline, forceOffline }: Offline): React.ReactElement<any>;
}

class OfflineClass extends React.Component<Props, {}> {
  public render() {
    const { offline, forceOffline, withOffline } = this.props;
    return withOffline({ offline, forceOffline });
  }
}

export const Offline = connect((state: AppState) => ({
  offline: state.config.offline,
  forceOffline: state.config.forceOffline
}))(OfflineClass);
