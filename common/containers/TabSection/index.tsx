import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  changeLanguage as dChangeLanguage,
  changeNodeIntent as dChangeNodeIntent,
  addCustomNode as dAddCustomNode,
  removeCustomNode as dRemoveCustomNode,
  addCustomNetwork as dAddCustomNetwork,
  TChangeLanguage,
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork
} from 'actions/config';
import { TSetGasPriceField, setGasPriceField as dSetGasPriceField } from 'actions/transaction';
import { AlphaAgreement, Footer, Header } from 'components';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import OfflineTab from './OfflineTab';
import {
  getOffline,
  getLanguageSelection,
  getCustomNodeConfigs,
  getCustomNetworkConfigs,
  getLatestBlock,
  isNodeChanging
} from 'selectors/config';
import { NodeConfig, CustomNodeConfig } from 'types/node';
import { CustomNetworkConfig } from 'types/network';

interface Props {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

class TabSection extends Component<Props, {}> {
  public render() {
    const {
      isUnavailableOffline,
      children,
      // APP
      isOffline
    } = this.props;

    return (
      <div className="page-layout">
        <main>
          <Header {...headerProps} />
          <div className="Tab container">
            {isUnavailableOffline && isOffline ? <OfflineTab /> : children}
          </div>
          <Footer latestBlock={latestBlock} />
        </main>
        <Notifications />
        <AlphaAgreement />
      </div>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    node: state.config.node,
    nodeSelection: state.config.nodeSelection,
    isChangingNode: isNodeChanging(state),
    isOffline: getOffline(state),
    languageSelection: getLanguageSelection(state),
    customNodes: getCustomNodeConfigs(state),
    customNetworks: getCustomNetworkConfigs(state),
    latestBlock: getLatestBlock(state)
  };
}

export default connect(mapStateToProps, {})(TabSection);
