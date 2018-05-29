import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import TabSection from 'containers/TabSection';
import TxHashInput from './components/TxHashInput';
import { TransactionStatus as TransactionStatusComponent } from 'components';
import { getNetworkConfig } from 'selectors/config';
import { getParamFromURL } from 'utils/helpers';
import { AppState } from 'reducers';
import { NetworkConfig } from 'types/network';
import './index.scss';
import translate from 'translations';
import { etherChainExplorerInst } from 'config/data';

interface StateProps {
  network: NetworkConfig;
}

interface State {
  hash: string;
}

type Props = StateProps & RouteComponentProps<{}>;

class CheckTransaction extends React.Component<Props, State> {
  public state: State = {
    hash: ''
  };

  public componentDidMount() {
    const hash = getParamFromURL(this.props.location.search, 'txHash');
    if (hash) {
      this.setState({ hash });
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { network } = this.props;
    if (network.chainId !== nextProps.network.chainId) {
      this.setState({ hash: '' });
    }
  }

  public render() {
    const { network } = this.props;
    const { hash } = this.state;
    const CHECK_TX_KEY =
      network.id === 'ETH'
        ? 'CHECK_TX_STATUS_DESCRIPTION_MULTIPLE'
        : 'CHECK_TX_STATUS_DESCRIPTION_2';

    return (
      <TabSection>
        <div className="CheckTransaction Tab-content">
          <section className="CheckTransaction-form Tab-content-pane">
            <h1 className="CheckTransaction-form-title">{translate('CHECK_TX_STATUS_TITLE')}</h1>
            <p className="CheckTransaction-form-desc">
              {translate('CHECK_TX_STATUS_DESCRIPTION_1')}
              {!network.isCustom &&
                translate(CHECK_TX_KEY, {
                  $block_explorer: network.blockExplorer.name,
                  $block_explorer_link: network.blockExplorer.origin,
                  // On ETH networks, we also show Etherchain. Otherwise, these variables are ignored
                  $block_explorer_2: etherChainExplorerInst.name,
                  $block_explorer_link_2: etherChainExplorerInst.origin
                })}
            </p>
            <TxHashInput hash={hash} onSubmit={this.handleHashSubmit} />
          </section>

          {hash && (
            <section className="CheckTransaction-tx Tab-content-pane">
              <TransactionStatusComponent key={network.chainId} txHash={hash} />
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

export default connect((state: AppState): StateProps => ({
  network: getNetworkConfig(state)
}))(CheckTransaction);
