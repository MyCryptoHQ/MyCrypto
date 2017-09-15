// @flow
import React, { Component } from 'react';
import type {
  HeaderProps,
  ListProps,
  NodeProps as Props,
  NodeState as State
} from './types';

const InfoHeader = ({ children, onClickHandler }: HeaderProps) =>
  <h6 onClick={onClickHandler}>
    <span>+</span> {children}
  </h6>;

const InfoList = ({ children, isOpen }: ListProps) =>
  isOpen
    ? <ul>
        {children}
      </ul>
    : null;

export default class GeneralInfoNode extends Component<Props, State> {
  state = {
    isOpen: false
  };

  toggleVisibility = () =>
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  render() {
    const {
      toggleVisibility,
      props: { innerList, name, headerContent },
      state: { isOpen }
    } = this;

    return (
      <section>
        <InfoHeader onClickHandler={toggleVisibility} name={name}>
          {headerContent}
        </InfoHeader>
        <InfoList name={name} isOpen={isOpen}>
          {innerList}
        </InfoList>
      </section>
    );
  }
}
