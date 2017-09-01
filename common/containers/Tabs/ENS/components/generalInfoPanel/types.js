// @flow
import * as React from 'react';
type AssignKeyToArrayLiteral = (
  arr: React.Element<any>[],
  key: ?string
) => React.Element<any>[];

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

export type {
  AssignKeyToArrayLiteral,
  InfoNode,
  HeaderProps,
  NodeProps,
  NodeState,
  ListProps
};
