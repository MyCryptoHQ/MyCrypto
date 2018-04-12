import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BetaAgreement, Footer, Header } from 'components';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import OfflineTab from './OfflineTab';
import { getOffline, getLatestBlock } from 'selectors/config';
import { Query } from 'components/renderCbs';

interface StateProps {
  isOffline: AppState['config']['meta']['offline'];
  latestBlock: AppState['config']['meta']['latestBlock'];
}

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps & StateProps;

class TabSection extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children, isOffline, latestBlock } = this.props;

    return (
      <div className="page-layout">
        <Query
          params={['network']}
          withQuery={({ network }) => (
            <Header networkParam={network && `${network.toLowerCase()}_auto`} />
          )}
        />
        <div className="Tab container">
          {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
        </div>
        <div className="flex-spacer" />
        <Footer latestBlock={latestBlock} />
        <Notifications />
        <BetaAgreement />
      </div>
    );
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    isOffline: getOffline(state),
    latestBlock: getLatestBlock(state)
  };
}

export default connect(mapStateToProps, {})(TabSection);
