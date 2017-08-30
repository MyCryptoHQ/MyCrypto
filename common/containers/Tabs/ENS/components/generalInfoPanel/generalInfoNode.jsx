// @flow
import * as React from 'react';
import type { HeaderProps, ListProps, NodeProps, NodeState } from './types';

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

export default class GeneralInfoNode extends React.Component<
  NodeProps,
  NodeState
> {
  state = {
    isOpen: false
  };

  toggleVisibility = () =>
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));

  render() {
    const {
      toggleVisibility, //Eslint is erroring out of prop types even when i've covered them with flow?
      props: { innerList, name, headerContent }, //eslint-disable-line
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
