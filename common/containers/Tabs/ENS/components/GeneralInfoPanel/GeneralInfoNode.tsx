import React from 'react';
import { HeaderProps, ListProps, NodeProps, NodeState } from './types';

const InfoHeader = ({ children, onClickHandler }: HeaderProps) => (
  <h6 onClick={onClickHandler}>
    <span>+</span> {children}
  </h6>
);

const InfoList = ({ children, isOpen }: ListProps) => (isOpen ? <ul>{children}</ul> : null);

export default class GeneralInfoNode extends React.Component<NodeProps, NodeState> {
  public state = {
    isOpen: false
  };

  public toggleVisibility = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  public render() {
    const { toggleVisibility, props: { innerList, headerContent }, state: { isOpen } } = this;

    return (
      <section>
        <InfoHeader onClickHandler={toggleVisibility}>{headerContent}</InfoHeader>
        <InfoList isOpen={isOpen}>{innerList}</InfoList>
      </section>
    );
  }
}
