import React from 'react';
import './Template.scss';

interface Props {
  content: React.ReactElement<any>;
  help: React.ReactElement<any>;
}

export default class GenerateWalletTemplate extends React.Component<Props, {}> {
  public render() {
    const { content, help } = this.props;
    return (
      <div className="GenerateWallet row">
        <div className="GenerateWallet-column col-md-9">
          <main className="GenerateWallet-column-content Tab-content-pane">{content}</main>
        </div>

        <div className="GenerateWallet-column col-md-3">
          <aside className="GenerateWallet-column-help Tab-content-pane">{help}</aside>
        </div>
      </div>
    );
  }
}
