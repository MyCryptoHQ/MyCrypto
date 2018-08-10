import React from 'react';
import { connect } from 'react-redux';
import BN from 'bn.js';
import classNames from 'classnames';

import { NetworkConfig } from 'types/network';
import { calcEACTotalCost } from 'libs/scheduling';
import { AppState } from 'features/reducers';
import { getOffline, getNetworkConfig } from 'features/config';
import { gasSelectors } from 'features/gas';
import { transactionFieldsSelectors } from 'features/transaction';
import { scheduleSelectors } from 'features/schedule';
import { UnitDisplay, Spinner } from 'components/ui';
import './FeeSummary.scss';

export interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  gasLimit: string;
  scheduleGasLimit: string;
  fee: React.ReactElement<string>;
  usd: React.ReactElement<string> | null;
}

interface ReduxStateProps {
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  rates: AppState['rates']['rates'];
  network: NetworkConfig;
  isOffline: AppState['config']['meta']['offline'];
  isGasEstimating: AppState['gas']['isEstimating'];
  scheduleGasLimit: AppState['schedule']['scheduleGasLimit'];
  timeBounty: AppState['schedule']['timeBounty'];
  scheduling: AppState['schedule']['schedulingToggle']['value'];
}

interface OwnProps {
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  scheduleGasPrice: AppState['schedule']['scheduleGasPrice'];

  render(data: RenderData): React.ReactElement<string> | string;
}

type Props = OwnProps & ReduxStateProps;

class FeeSummary extends React.Component<Props> {
  public render() {
    const {
      gasPrice,
      gasLimit,
      rates,
      network,
      isOffline,
      isGasEstimating,
      scheduling,
      scheduleGasLimit
    } = this.props;

    if (!gasPrice.value || gasPrice.value.eqn(0) || !gasLimit.value || gasLimit.value.eqn(0)) {
      return null;
    }
    if (isGasEstimating) {
      return (
        <div className="FeeSummary is-loading">
          <Spinner />
        </div>
      );
    }

    const feeBig = this.getFee();
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

    const feeSummaryClasses = classNames({
      FeeSummary: true,
      SchedulingFeeSummary: scheduling
    });

    return (
      <div className={feeSummaryClasses}>
        {this.props.render({
          gasPriceWei: gasPrice.value.toString(),
          gasPriceGwei: gasPrice.raw,
          fee,
          usd,
          gasLimit: gasLimit.raw,
          scheduleGasLimit: scheduleGasLimit.raw
        })}
      </div>
    );
  }

  private getFee() {
    const { scheduling } = this.props;

    if (scheduling) {
      return this.calculateSchedulingFee();
    }

    return this.calculateStandardFee();
  }

  private calculateStandardFee() {
    const { gasPrice, gasLimit } = this.props;

    return gasPrice.value && gasLimit.value && gasPrice.value.mul(gasLimit.value);
  }

  private calculateSchedulingFee() {
    const { gasPrice, scheduleGasLimit, scheduleGasPrice, timeBounty } = this.props;

    return (
      gasPrice.value &&
      scheduleGasLimit.value &&
      timeBounty.value &&
      calcEACTotalCost(
        scheduleGasLimit.value,
        gasPrice.value,
        scheduleGasPrice.value,
        timeBounty.value
      )
    );
  }
}

function mapStateToProps(state: AppState): ReduxStateProps {
  return {
    gasLimit: transactionFieldsSelectors.getGasLimit(state),
    rates: state.rates.rates,
    network: getNetworkConfig(state),
    isOffline: getOffline(state),
    isGasEstimating: gasSelectors.getIsEstimating(state),
    scheduling: scheduleSelectors.getSchedulingToggle(state).value,
    scheduleGasLimit: scheduleSelectors.getScheduleGasLimit(state),
    timeBounty: scheduleSelectors.getTimeBounty(state)
  };
}

export default connect(mapStateToProps)(FeeSummary);
