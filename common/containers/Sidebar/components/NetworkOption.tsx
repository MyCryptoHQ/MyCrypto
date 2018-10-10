import React, { Component } from 'react';
import classnames from 'classnames';

import { NodeConfig } from 'types/node';
import CustomRadio from './CustomRadio';
import NodeOption from './NodeOption';

interface Props {
  name: string;
  isToggled: boolean;
  nodes: NodeConfig[];
  isSecondary: boolean;
  isSelected: boolean;
  selectedNode: NodeConfig;
  onSelect(): void;
  onNodeSelect(id: string): void;
  onClick(e: React.MouseEvent<HTMLElement>): void;
}

export default class NetworkOption extends Component<Props> {
  private node = React.createRef<HTMLLIElement>();

  public componentDidMount() {
    const { isSelected } = this.props;

    if (isSelected && this.node && this.node.current) {
      this.node.current.scrollIntoView();
    }
  }

  public render() {
    const {
      onSelect,
      onNodeSelect,
      onClick,
      name,
      isToggled,
      nodes,
      isSecondary,
      isSelected,
      selectedNode
    } = this.props;

    const className = classnames('NewNetworkOption', { 'is-secondary': isSecondary });

    return (
      <li className={className} onClick={onClick} ref={this.node}>
        <section className="NewNetworkOption-name">
          <CustomRadio onClick={onSelect} enabled={isSelected} />
          {name}
        </section>
        {isToggled && (
          <ul className="NewNetworkOption-list">
            {nodes.map(node => (
              <NodeOption
                key={node.id}
                name={node.service}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  e.stopPropagation() || onNodeSelect(node.id)
                }
                isSelected={selectedNode.id === node.id}
                {...node}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
}
