import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import OfflineTab from './OfflineTab';
import './WebTemplate.scss';

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
  latestBlock: AppState['config']['meta']['latestBlock'];
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps & StateProps;

class WebTemplate extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children, isOffline } = this.props;

    return (
      <React.Fragment>
        <div className="WebTemplate">
          <div className="Tab container">
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <div className="WebTemplate-spacer" />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: configMetaSelectors.getOffline(state),
    latestBlock: configMetaSelectors.getLatestBlock(state)
  };
}

export default connect(mapStateToProps)(WebTemplate);
