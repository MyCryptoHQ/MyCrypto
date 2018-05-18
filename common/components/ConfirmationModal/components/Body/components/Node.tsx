import React, { Component } from 'react';
import { connect } from 'react-redux';

import { StaticNodeConfig } from 'types/node';
import { AppState } from 'features/reducers';
import { getNodeConfig } from 'features/config/nodes/derivedSelectors';

interface StateProps {
  node: StaticNodeConfig;
}

class NodeClass extends Component<StateProps, {}> {
  public render() {
    return (
      <li className="ConfModal-details-detail">
        You are interacting with the <strong>{this.props.node.network}</strong> network provided by{' '}
        <strong>{this.props.node.service}</strong>
      </li>
    );
  }
}

export const Node = connect((state: AppState) => ({
  node: getNodeConfig(state)
}))(NodeClass);
