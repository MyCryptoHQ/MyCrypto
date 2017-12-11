import { NodeConfig } from 'config/data';
import React, { Component } from 'react';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { getNodeConfig } from 'selectors/config';

interface StateProps {
  node: NodeConfig;
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
