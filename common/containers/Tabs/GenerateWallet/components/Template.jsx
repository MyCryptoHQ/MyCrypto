// @flow
import './Template.scss';
import React from 'react';

type Props = {
  content: React.Element<*>,
  help: React.Element<*>
};

export default class GenerateWalletTemplate extends React.Component {
  props: Props;

  render() {
    const { content, help } = this.props;
    return (
      <div className="GenerateWallet row">
        <div className="GenerateWallet-column col-md-9">
          <main className="GenerateWallet-column-content Tab-content-pane">
            {content}
          </main>
        </div>

        <div className="GenerateWallet-column col-md-3">
          <aside className="GenerateWallet-column-help Tab-content-pane">
            {help}
          </aside>
        </div>
      </div>
    );
  }
}
