import React from 'react';
import BN from 'bn.js';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { UnitDisplay } from 'components/ui';
import { NetworkConfig } from 'types/network';
import './FeeSummary.scss';

interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  gasLimit: string;
  fee: React.ReactElement<string>;
  usd: React.ReactElement<string> | null;
}

interface ReduxStateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  rates: AppState['rates']['rates'];
  network: NetworkConfig;
  isOffline: AppState['config']['meta']['offline'];
}

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  render(data: RenderData): React.ReactElement<string> | string;
}

type Props = OwnProps & ReduxStateProps;

class FeeSummary extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit, rates, network, isOffline } = this.props;

    const feeBig = gasPrice.value && gasLimit.value && gasPrice.value.mul(gasLimit.value);
    const fee = (
      <UnitDisplay
        value={feeBig}
        unit="ether"
        symbol={network.unit}
        displayShortBalance={6}
        checkOffline={false}
      />
    );

    const usdBig = network.isTestnet
      ? new BN(0)
      : feeBig && rates[network.unit] && feeBig.muln(rates[network.unit].USD);
    const usd = isOffline ? null : (
      <UnitDisplay
        value={usdBig}
        unit="ether"
        displayShortBalance={2}
        displayTrailingZeroes={true}
        checkOffline={true}
      />
    );

    return (
      <div className="FeeSummary">
        {this.props.render({
          gasPriceWei: gasPrice.value.toString(),
          gasPriceGwei: gasPrice.raw,
          fee,
          usd,
          gasLimit: gasLimit.raw
        })}
      </div>
    );
  }
}

function mapStateToProps(state: AppState): ReduxStateProps {
  return {
    gasLimit: state.transaction.fields.gasLimit,
    rates: state.rates.rates,
    network: getNetworkConfig(state),
    isOffline: getOffline(state)
  };
}

export default connect(mapStateToProps)(FeeSummary);
