import React, { Component } from 'react';

export type ExpandHandler = (ev: React.FormEvent<HTMLAnchorElement>) => void;

interface Props {
  children: React.ReactElement<any>;
  expandLabel(expandHandler: ExpandHandler): React.ReactElement<any>;
}

interface State {
  expanded: boolean;
}

const initialState: State = { expanded: false };

export class Expandable extends Component<Props, State> {
  public state: State = initialState;

  public render() {
    return (
      <React.Fragment>
        {this.props.expandLabel(this.expandHandler)}
        {this.state.expanded && this.props.children}
      </React.Fragment>
    );
  }

  private expandHandler = (_: React.FormEvent<HTMLAnchorElement>) =>
    this.setState(({ expanded }) => ({ expanded: !expanded }));
}
