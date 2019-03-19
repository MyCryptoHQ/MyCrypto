import React, { Component, createContext } from 'react';
import NodeOptionsServiceBase from 'v2/services/NodeOptions/NodeOptions';
import { NodeOptions, ExtendedNodeOptions } from 'v2/services/NodeOptions';

export interface ProviderState {
  nodeOptions: ExtendedNodeOptions[];
  createNodeOptions(nodeOptionsData: ExtendedNodeOptions): void;
  readNodeOptions(uuid: string): NodeOptions;
  deleteNodeOptions(uuid: string): void;
  updateNodeOptions(uuid: string, nodeOptionsData: ExtendedNodeOptions): void;
}

export const NodeOptionsContext = createContext({} as ProviderState);

const NodeOptions = new NodeOptionsServiceBase();

export class NodeOptionsProvider extends Component {
  public readonly state: ProviderState = {
    nodeOptions: NodeOptions.readAllNodeOptions() || [],
    createNodeOptions: (nodeOptionsData: ExtendedNodeOptions) => {
      NodeOptions.createNodeOptions(nodeOptionsData);
      this.getNodeOptions();
    },
    readNodeOptions: (uuid: string): NodeOptions => {
      return NodeOptions.readNodeOptions(uuid);
    },
    deleteNodeOptions: (uuid: string) => {
      NodeOptions.deleteNodeOptions(uuid);
      this.getNodeOptions();
    },
    updateNodeOptions: (uuid: string, nodeOptionsData: ExtendedNodeOptions) => {
      NodeOptions.updateNodeOptions(uuid, nodeOptionsData);
      this.getNodeOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return <NodeOptionsContext.Provider value={this.state}>{children}</NodeOptionsContext.Provider>;
  }

  private getNodeOptions = () => {
    const nodeOptions: ExtendedNodeOptions[] = NodeOptions.readAllNodeOptions() || [];
    this.setState({ nodeOptions });
  };
}
