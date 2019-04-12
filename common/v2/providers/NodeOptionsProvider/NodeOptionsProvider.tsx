import React, { Component, createContext } from 'react';
import * as service from 'v2/services/NodeOptions/NodeOptions';
import { NodeOptions, ExtendedNodeOptions } from 'v2/services/NodeOptions';

export interface ProviderState {
  nodeOptions: ExtendedNodeOptions[];
  createNodeOptions(nodeOptionsData: ExtendedNodeOptions): void;
  readNodeOptions(uuid: string): NodeOptions;
  deleteNodeOptions(uuid: string): void;
  updateNodeOptions(uuid: string, nodeOptionsData: ExtendedNodeOptions): void;
}

export const NodeOptionsContext = createContext({} as ProviderState);

export class NodeOptionsProvider extends Component {
  public readonly state: ProviderState = {
    nodeOptions: service.readAllNodeOptions() || [],
    createNodeOptions: (nodeOptionsData: ExtendedNodeOptions) => {
      service.createNodeOptions(nodeOptionsData);
      this.getNodeOptions();
    },
    readNodeOptions: (uuid: string): NodeOptions => {
      return service.readNodeOptions(uuid);
    },
    deleteNodeOptions: (uuid: string) => {
      service.deleteNodeOptions(uuid);
      this.getNodeOptions();
    },
    updateNodeOptions: (uuid: string, nodeOptionsData: ExtendedNodeOptions) => {
      service.updateNodeOptions(uuid, nodeOptionsData);
      this.getNodeOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return <NodeOptionsContext.Provider value={this.state}>{children}</NodeOptionsContext.Provider>;
  }

  private getNodeOptions = () => {
    const nodeOptions: ExtendedNodeOptions[] = service.readAllNodeOptions() || [];
    this.setState({ nodeOptions });
  };
}
