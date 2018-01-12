import React from 'react';
import BN from 'bn.js';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig } from 'selectors/config';
import { UnitDisplay } from 'components/ui';
import './FeeSummary.scss';

interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  gasLimit: string;
  fee: React.ReactElement<string>;
  usd: React.ReactElement<string> | null;
}

interface Props {
  // Redux props
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  rates: AppState['rates']['rates'];
  network: AppState['config']['network'];
  isOffline: AppState['config']['offline'];
  // Component props
  render(data: RenderData): React.ReactElement<string> | string;
}

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

function mapStateToProps(state: AppState) {
  return {
    gasPrice: state.transaction.fields.gasPrice,
    gasLimit: state.transaction.fields.gasLimit,
    rates: state.rates.rates,
    network: getNetworkConfig(state),
    isOffline: state.config.offline
  };
}

export default connect(mapStateToProps)(FeeSummary);
