import {
  changeGasPrice as dChangeGasPrice,
  changeLanguage as dChangeLanguage,
  changeNodeIntent as dChangeNodeIntent,
  addCustomNode as dAddCustomNode,
  removeCustomNode as dRemoveCustomNode,
  TChangeGasPrice,
  TChangeLanguage,
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode
} from 'actions/config';
import { AlphaAgreement, Footer, Header } from 'components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import Notifications from './Notifications';
import { NodeConfig, CustomNodeConfig } from 'config/data';

interface Props {
  // FIXME
  children: any;

  languageSelection: string;
  node: NodeConfig;
  nodeSelection: string;
  isChangingNode: boolean;
  gasPriceGwei: number;
  customNodes: CustomNodeConfig[];
  latestBlock: string;

  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  changeGasPrice: TChangeGasPrice;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
}
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
      latestBlock,

      changeLanguage,
      changeNodeIntent,
      changeGasPrice,
      addCustomNode,
      removeCustomNode
    } = this.props;

    const headerProps = {
      languageSelection,
      node,
      nodeSelection,
      isChangingNode,
      gasPriceGwei,
      customNodes,

      changeLanguage,
      changeNodeIntent,
      changeGasPrice,
      addCustomNode,
      removeCustomNode
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

function mapStateToProps(state: AppState) {
  return {
    node: state.config.node,
    nodeSelection: state.config.nodeSelection,
    isChangingNode: state.config.isChangingNode,
    languageSelection: state.config.languageSelection,
    gasPriceGwei: state.config.gasPriceGwei,
    customNodes: state.config.customNodes,
    latestBlock: state.config.latestBlock
  };
}

export default connect(mapStateToProps, {
  changeGasPrice: dChangeGasPrice,
  changeLanguage: dChangeLanguage,
  changeNodeIntent: dChangeNodeIntent,
  addCustomNode: dAddCustomNode,
  removeCustomNode: dRemoveCustomNode
})(TabSection);
