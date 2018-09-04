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
        {translate('YOU_ARE_INTERACTING', {
          $network: this.props.node.network
        })}
        {translate('PROVIDED_BY', { $service: this.props.node.service })}
      </li>
    );
  }
}

export const Node = connect((state: AppState) => ({
  node: configNodesSelectors.getNodeConfig(state)
}))(NodeClass);
