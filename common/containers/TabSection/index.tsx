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
import { getGasPrice } from 'selectors/transaction';

interface ReduxProps {
  languageSelection: AppState['config']['languageSelection'];
  node: AppState['config']['node'];
  nodeSelection: AppState['config']['nodeSelection'];
  isChangingNode: AppState['config']['isChangingNode'];
  customNodes: AppState['config']['customNodes'];
  customNetworks: AppState['config']['customNetworks'];
  latestBlock: AppState['config']['latestBlock'];
  gasPrice: AppState['transaction']['fields']['gasPrice'];
}

interface ActionProps {
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
  setGasPriceField: TSetGasPriceField;
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
      customNodes,
      customNetworks,
      latestBlock,
      setGasPriceField,
      gasPrice,
      changeLanguage,
      changeNodeIntent,
      addCustomNode,
      removeCustomNode,
      addCustomNetwork
    } = this.props;

    const headerProps = {
      languageSelection,
      node,
      nodeSelection,
      isChangingNode,
      gasPrice,
      customNodes,
      customNetworks,
      changeLanguage,
      changeNodeIntent,
      setGasPriceField,
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
    gasPrice: getGasPrice(state),
    customNodes: state.config.customNodes,
    customNetworks: state.config.customNetworks,
    latestBlock: state.config.latestBlock
  };
}

export default connect(mapStateToProps, {
  setGasPriceField: dSetGasPriceField,
  changeLanguage: dChangeLanguage,
  changeNodeIntent: dChangeNodeIntent,
  addCustomNode: dAddCustomNode,
  removeCustomNode: dRemoveCustomNode,
  addCustomNetwork: dAddCustomNetwork
})(TabSection);
