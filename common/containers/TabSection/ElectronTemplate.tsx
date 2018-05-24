import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import OfflineTab from './OfflineTab';
import { getOffline } from 'selectors/config';
import { ElectronNav, AppAlphaNotice } from 'components';
import './ElectronTemplate.scss';

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps & StateProps;

class ElectronTemplate extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children, isOffline } = this.props;

    return (
      <div className="ElectronTemplate">
        <div className="ElectronTemplate-sidebar">
          <ElectronNav />
        </div>
        <div className="ElectronTemplate-content">
          <div className="Tab ElectronTemplate-content-tab">
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <Notifications />
          <AppAlphaNotice />
        </div>
        <div className="ElectronTemplate-draggable" />
      </div>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: getOffline(state)
  };
}

export default connect(mapStateToProps, {})(ElectronTemplate);
