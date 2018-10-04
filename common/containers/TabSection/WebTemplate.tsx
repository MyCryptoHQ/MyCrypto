import React, { Component } from 'react';
import { connect } from 'react-redux';

import { makeAutoNodeName } from 'libs/nodes';
import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { sidebarActions, sidebarSelectors } from 'features/sidebar';
import Sidebar from 'containers/Sidebar';
import { Header } from 'components';
import NewFooter from 'components/Footer/NewFooter/NewFooter';
import { Query } from 'components/renderCbs';
import Notifications from './Notifications';
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
    const { isUnavailableOffline, children, isOffline, sidebarVisible, toggleSidebar } = this.props;

    return (
      <React.Fragment>
        <div className="WebTemplate">
          <button onClick={toggleSidebar}>Sidebar</button>
          {sidebarVisible && <Sidebar />}
          <Query
            params={['network']}
            withQuery={({ network }) => (
              <Header networkParam={network && makeAutoNodeName(network)} />
            )}
          />
          <div className="Tab container">
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <div className="WebTemplate-spacer" />
          {/* <Footer latestBlock={latestBlock} /> */}
          <NewFooter />
          <Notifications />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: configMetaSelectors.getOffline(state),
    latestBlock: configMetaSelectors.getLatestBlock(state),
    sidebarVisible: sidebarSelectors.getSidebarVisible(state)
  };
}

export default connect(mapStateToProps, { toggleSidebar: sidebarActions.toggleSidebar })(
  WebTemplate
);
