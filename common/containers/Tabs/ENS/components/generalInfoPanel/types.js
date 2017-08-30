// @flow
import * as React from 'react';

type InfoNode = {
  name: string,
  headerContent: string,
  innerList: Array<React.Element<any>>
};

type HeaderProps = {
  children: string,
  onClickHandler: () => void
};

type NodeProps = {
  innerList: Array<React.Element<any>>,
  headerContent: string,
  name: string
};

type NodeState = {
  isOpen: boolean
};

type ABlankNooperProps = {
  content: React.Element<any>,
  href: string
};

type ListProps = {
  children: Array<React.Element<any>>,
  isOpen: boolean
};

export type {
  InfoNode,
  HeaderProps,
  NodeProps,
  NodeState,
  ABlankNooperProps,
  ListProps
};
