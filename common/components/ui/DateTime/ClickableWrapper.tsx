import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

interface ClickableWrapperComponentProps {
  className: any;
  onClickOut(e: any): void;
}

class ClickableWrapperComponent extends Component<ClickableWrapperComponentProps> {
  public render() {
    return <div className={this.props.className}>{this.props.children}</div>;
  }

  public handleClickOutside(e: any) {
    this.props.onClickOut(e);
  }
}

export const ClickableWrapper = onClickOutside(ClickableWrapperComponent);
