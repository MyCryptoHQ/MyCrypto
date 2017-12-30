import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { UnitDisplay } from 'components/ui';

interface RenderData {
  gasPriceWei: string;
  gasPriceGwei: string;
  gasLimit: string;
  feeEth: React.ReactElement<string>;
  usd: string | null;
}

interface Props {
  // Redux props
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  gasLimit: AppState['transaction']['fields']['gasLimit'];
  rates: AppState['rates']['rates'];
  // Component props
  render(data: RenderData): React.ReactElement<string> | string;
}

class FeeSummary extends React.Component<Props> {
  public render() {
    const { gasPrice, gasLimit, rates } = this.props;
    const fee = gasPrice.value && gasLimit.value && gasPrice.value.mul(gasLimit.value);
    const usd = fee && rates.ETH && fee.muln(rates.ETH.USD).toString();
    const feeEth = <UnitDisplay value={fee} unit="ether" symbol="ETH" displayShortBalance={6} />;

    return (
      <span>
        {this.props.render({
          gasPriceWei: gasPrice.value.toString(),
          gasPriceGwei: gasPrice.raw,
          feeEth,
          usd,
          gasLimit: gasLimit.raw
        })}
      </span>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    gasPrice: state.transaction.fields.gasPrice,
    gasLimit: state.transaction.fields.gasLimit,
    rates: state.rates.rates
  };
}

export default connect(mapStateToProps)(FeeSummary);
