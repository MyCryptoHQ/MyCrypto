import React from 'react';
import BN from 'bn.js';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { getIsEstimating } from 'selectors/gas';
import { getTimeBounty, getScheduleGasLimit } from 'selectors/transaction';
import { UnitDisplay, Spinner } from 'components/ui';
import { NetworkConfig } from 'types/network';
import './FeeSummary.scss';
import { calcEACTotalCost, EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import { gasPriceToBase } from 'libs/units';

interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  scheduleGasLimit: string;
  fee: React.ReactElement<string>;
  usd: React.ReactElement<string> | null;
}

interface ReduxStateProps {
  scheduleGasLimit: AppState['transaction']['fields']['scheduleGasLimit'];
  rates: AppState['rates']['rates'];
  network: NetworkConfig;
  isOffline: AppState['config']['meta']['offline'];
  isGasEstimating: AppState['gas']['isEstimating'];
  timeBounty: AppState['transaction']['fields']['timeBounty'];
}

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  scheduleGasPrice: AppState['transaction']['fields']['scheduleGasPrice'];

  render(data: RenderData): React.ReactElement<string> | string;
}

type Props = OwnProps & ReduxStateProps;

class SchedulingFeeSummary extends React.Component<Props> {
  public render() {
    const {
      gasPrice,
      scheduleGasLimit,
      rates,
      network,
      isOffline,
      isGasEstimating,
      scheduleGasPrice,
      timeBounty
    } = this.props;

    if (isGasEstimating || !scheduleGasPrice) {
      return (
        <div className="FeeSummary is-loading">
          <Spinner />
        </div>
      );
    }

    const feeBig =
      gasPrice.value &&
      scheduleGasLimit.value &&
      timeBounty.value &&
      calcEACTotalCost(
        scheduleGasLimit.value,
        gasPrice.value,
        scheduleGasPrice.value || gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK),
        timeBounty.value
      );

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
      <div className="FeeSummary SchedulingFeeSummary">
        {this.props.render({
          gasPriceWei: gasPrice.value.toString(),
          gasPriceGwei: gasPrice.raw,
          fee,
          usd,
          scheduleGasLimit: scheduleGasLimit.raw
        })}
      </div>
    );
  }
}

function mapStateToProps(state: AppState): ReduxStateProps {
  return {
    scheduleGasLimit: getScheduleGasLimit(state),
    rates: state.rates.rates,
    network: getNetworkConfig(state),
    isOffline: getOffline(state),
    isGasEstimating: getIsEstimating(state),
    timeBounty: getTimeBounty(state)
  };
}

export default connect(mapStateToProps)(SchedulingFeeSummary);
