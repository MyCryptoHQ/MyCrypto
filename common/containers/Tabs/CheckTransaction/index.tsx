import React from 'react';
import { connect } from 'react-redux';
import TabSection from 'containers/TabSection';
import TxHashInput from './components/TxHashInput';
import { TransactionStatus as TransactionStatusComponent } from 'components';
import { NewTabLink } from 'components/ui';
import { getNetworkConfig } from 'selectors/config';
import { AppState } from 'reducers';
import { NetworkConfig } from 'types/network';
import './index.scss';

interface Props {
  network: NetworkConfig;
}

interface State {
  hash: string;
}

class CheckTransaction extends React.Component<Props, State> {
  public state: State = {
    hash: ''
  };

  public render() {
    const { network } = this.props;
    const { hash } = this.state;

    return (
      <TabSection>
        <div className="CheckTransaction Tab-content">
          <section className="CheckTransaction-form Tab-content-pane">
            <h1 className="CheckTransaction-form-title">Check Transaction Status</h1>
            <p className="CheckTransaction-form-desc">
              Enter your Transaction Hash to check on its status.{' '}
              {!network.isCustom && (
                <React.Fragment>
                  If you don’t know your Transaction Hash, you can look it up on the{' '}
                  <NewTabLink href={network.blockExplorer.origin}>
                    {network.blockExplorer.name} explorer
                  </NewTabLink>{' '}
                  by looking up your address.
                </React.Fragment>
              )}
            </p>
            <TxHashInput onSubmit={this.handleHashSubmit} />
          </section>

          {hash && (
            <section className="CheckTransaction-tx Tab-content-pane">
              <TransactionStatusComponent txHash={hash} />
            </section>
          )}
        </div>
      </TabSection>
    );
  }

  private handleHashSubmit = (hash: string) => {
    // Reset to re-mount the component
    this.setState({ hash: '' }, () => {
      this.setState({ hash });
    });
  };
}

export default connect((state: AppState) => ({
  network: getNetworkConfig(state)
}))(CheckTransaction);
