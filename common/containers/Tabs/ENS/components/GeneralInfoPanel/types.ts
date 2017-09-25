import React from 'react';

interface InfoNode {
  name: string;
  headerContent: string;
  innerList: React.ReactElement<any>[];
}

interface HeaderProps {
  children: string;
  onClickHandler(): void;
}

interface NodeProps {
  innerList: React.ReactElement<any>[];
  headerContent: string;
  name: string;
}

interface NodeState {
  isOpen: boolean;
}

interface ListProps {
  children: React.ReactElement<any>[];
  isOpen: boolean;
}

export { InfoNode, HeaderProps, NodeProps, NodeState, ListProps };
