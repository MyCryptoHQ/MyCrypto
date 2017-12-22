import React from 'react';
import './Template.scss';

interface Props {
  children: React.ReactElement<any>;
}

export default class GenerateWalletTemplate extends React.Component<Props, {}> {
  public render() {
    return <div className="GenerateWallet Tab-content-pane">{this.props.children}</div>;
  }
}
