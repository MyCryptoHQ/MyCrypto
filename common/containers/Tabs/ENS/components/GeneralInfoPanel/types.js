// @flow
import * as React from 'react';

type InfoNode = {
  name: string,
  headerContent: string,
  innerList: React.Element<any>[]
};

type HeaderProps = {
  children: string,
  onClickHandler: () => void
};

type NodeProps = {
  innerList: React.Element<any>[],
  headerContent: string,
  name: string
};

type NodeState = {
  isOpen: boolean
};

type ListProps = {
  children: React.Element<any>[],
  isOpen: boolean
};

export type { InfoNode, HeaderProps, NodeProps, NodeState, ListProps };
