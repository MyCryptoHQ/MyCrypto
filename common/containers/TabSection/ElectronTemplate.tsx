import React, { Component } from 'react';
import { connect } from 'react-redux';

import { VERSION } from 'config';
import { isDesktop } from 'v2/utils';
import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { ElectronNav } from 'components';
import OfflineTab from './OfflineTab';
import Notifications from './Notifications';
import ElectronBuildVerified from 'components/ElectronBuildVerified';
import Survey from 'components/Survey';
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
            <ElectronBuildVerified versionNow={VERSION} />
            {isDesktop() && <Survey />}
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <Notifications />
        </div>
        <div className="ElectronTemplate-draggable" />
      </div>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: configMetaSelectors.getOffline(state)
  };
}

export default connect(
  mapStateToProps,
  {}
)(ElectronTemplate);
