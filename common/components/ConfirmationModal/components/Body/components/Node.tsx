import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { StaticNodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import { configNodesSelectors } from 'features/config';

interface StateProps {
  node: StaticNodeConfig;
}

class NodeClass extends Component<StateProps, {}> {
  public render() {
    return (
      <li className="ConfModal-details-detail">
        {translate('YOU_ARE_INTERACTING')} <strong>{this.props.node.network}</strong>
        {translate('NETWORK')} {translate('PROVIDED_BY')} <strong>{this.props.node.service}</strong>
      </li>
    );
  }
}

export const Node = connect((state: AppState) => ({
  node: configNodesSelectors.getNodeConfig(state)
}))(NodeClass);
