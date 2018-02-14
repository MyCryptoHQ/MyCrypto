import React from 'react';
import TabSection from 'containers/TabSection';
import TxHashInput from './components/TxHashInput';

export default class TransactionStatus extends React.Component<{}> {
  public render() {
    return (
      <TabSection>
        <div className="Tab-content">
          <section className="Tab-content-pane">
            <h1>Check Transaction Status</h1>
            <p>Enter your Transaction Hash to check on its status.</p>
            <TxHashInput onSubmit={this.handleHashSubmit} />
          </section>
        </div>
      </TabSection>
    );
  }

  private handleHashSubmit = (hash: string) => {
    console.log(hash);
  };
}
