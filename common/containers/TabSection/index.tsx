import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  changeGasPrice as dChangeGasPrice,
  changeLanguage as dChangeLanguage,
  changeNodeIntent as dChangeNodeIntent,
  addCustomNode as dAddCustomNode,
  removeCustomNode as dRemoveCustomNode,
  addCustomNetwork as dAddCustomNetwork,
  TChangeGasPrice,
  TChangeLanguage,
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork
} from 'actions/config';
import { AlphaAgreement, Footer, Header } from 'components';
import { AppState } from 'reducers';
import Notifications from './Notifications';

interface ReduxProps {
  languageSelection: AppState['config']['languageSelection'];
  node: AppState['config']['node'];
  nodeSelection: AppState['config']['nodeSelection'];
  isChangingNode: AppState['config']['isChangingNode'];
  gasPriceGwei: AppState['config']['gasPriceGwei'];
  customNodes: AppState['config']['customNodes'];
  customNetworks: AppState['config']['customNetworks'];
  latestBlock: AppState['config']['latestBlock'];
}

interface ActionProps {
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  changeGasPrice: TChangeGasPrice;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

type Props = {
  // FIXME
  children: any;
} & ReduxProps &
  ActionProps;

class TabSection extends Component<Props, {}> {
  public render() {
    const {
      children,
      // APP
      node,
      nodeSelection,
      isChangingNode,
      languageSelection,
      gasPriceGwei,
      customNodes,
      customNetworks,
      latestBlock,

      changeLanguage,
      changeNodeIntent,
      changeGasPrice,
      addCustomNode,
      removeCustomNode,
      addCustomNetwork
    } = this.props;

    const headerProps = {
      languageSelection,
      node,
      nodeSelection,
      isChangingNode,
      gasPriceGwei,
      customNodes,
      customNetworks,

      changeLanguage,
      changeNodeIntent,
      changeGasPrice,
      addCustomNode,
      removeCustomNode,
      addCustomNetwork
    };

    return (
      <div className="page-layout">
        <main>
          <Header {...headerProps} />
          <div className="Tab container">{children}</div>
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
    isChangingNode: state.config.isChangingNode,
    languageSelection: state.config.languageSelection,
    gasPriceGwei: state.config.gasPriceGwei,
    customNodes: state.config.customNodes,
    customNetworks: state.config.customNetworks,
    latestBlock: state.config.latestBlock
  };
}

export default connect(mapStateToProps, {
  changeGasPrice: dChangeGasPrice,
  changeLanguage: dChangeLanguage,
  changeNodeIntent: dChangeNodeIntent,
  addCustomNode: dAddCustomNode,
  removeCustomNode: dRemoveCustomNode,
  addCustomNetwork: dAddCustomNetwork
})(TabSection);
