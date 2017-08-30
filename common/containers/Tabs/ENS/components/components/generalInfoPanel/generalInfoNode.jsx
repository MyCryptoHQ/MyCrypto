// @flow
import * as React from 'react';

type HeaderProps = {
  children: string,
  onClickHandler: () => void
};
const InfoHeader = ({ children, onClickHandler }: HeaderProps) =>
  <h6 onClick={onClickHandler}>
    <span>+</span> {children}
  </h6>;

type ListProps = {
  children: Array<React.Element<any>>,
  isOpen: boolean
};

const InfoList = ({ children, isOpen }: ListProps) =>
  isOpen
    ? <ul>
        {children}
      </ul>
    : null;

type NodeProps = {
  innerList: Array<React.Element<any>>,
  headerContent: string,
  name: string
};

type NodeState = {
  isOpen: boolean
};

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
