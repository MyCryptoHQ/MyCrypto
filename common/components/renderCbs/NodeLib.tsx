import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeLib } from 'selectors/config';
import { RPCNode } from 'libs/nodes';

interface Props {
  nodeLib: RPCNode;
  withNodeLib({
    nodeLib
  }: {
    nodeLib: RPCNode;
  }): React.ReactElement<any> | null;
}

class NodeLibClass extends React.Component<Props, {}> {
  public render() {
    const { nodeLib, withNodeLib } = this.props;
    return withNodeLib({ nodeLib });
  }
}

export const NodeLib = connect((state: AppState) => ({
  nodeLib: getNodeLib(state)
}))(NodeLibClass);
